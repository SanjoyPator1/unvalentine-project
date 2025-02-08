// app/api/notes/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { CreateNoteRequest } from '@/types/note';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function isLocalhost(ip: string): boolean {
  return ip === '::1' || ip === '127.0.0.1' || ip === 'localhost';
}

function extractIpFromForwarded(forwarded: string): string | null {
  // Match the IP address after "for=" and before the next semicolon
  const match = forwarded.match(/for=([^;]+)/);
  return match ? match[1] : null;
}

function sanitizeIp(headerValue: string, headerName: string): string | null {
  if (!headerValue) return null;

  // Handle Vercel's forwarded header format
  if (headerName === 'forwarded') {
    return extractIpFromForwarded(headerValue);
  }

  // For other headers, get first IP if multiple are present
  const cleanIp = headerValue.split(',')[0].trim();
  return cleanIp || null;
}

// Helper function to get the real IP address
function getIpAddress(request: NextRequest): string {
  // For development environment, use a consistent IP
  if (process.env.NODE_ENV === 'development') {
    return '127.0.0.1';
  }

  // Log headers in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.log('All request headers:', Object.fromEntries(request.headers));
  }

  // Check headers in order of reliability
  const headerChecks = [
    ['forwarded', request.headers.get('forwarded')],
    ['x-forwarded-for', request.headers.get('x-forwarded-for')],
    ['x-real-ip', request.headers.get('x-real-ip')],
    ['cf-connecting-ip', request.headers.get('cf-connecting-ip')],
    ['true-client-ip', request.headers.get('true-client-ip')],
    ['x-client-ip', request.headers.get('x-client-ip')]
  ] as const;

  // Try each header
  for (const [headerName, headerValue] of headerChecks) {
    if (headerValue) {
      const ip = sanitizeIp(headerValue, headerName);
      if (ip && !isLocalhost(ip)) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Using IP from ${headerName}:`, ip);
        }
        return ip;
      }
    }
  }

  // If we're in production and couldn't get a valid IP, log a warning
  if (process.env.NODE_ENV === 'production') {
    console.warn('No valid IP address found in production environment');
  }

  // Default fallback for development
  return '127.0.0.1';
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const { count } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  return count !== null && count < 5;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateNoteRequest;
    const clientIp = getIpAddress(request);
    
    // Check rate limit before proceeding
    const isAllowed = await checkRateLimit(clientIp);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate content
    if (!body.content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Insert note with IP address
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          content: body.content,
          ip_address: clientIp,
        }
      ])
      .select('id, content, created_at')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create note' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { note: data } });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('id, content, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { notes: data } });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}