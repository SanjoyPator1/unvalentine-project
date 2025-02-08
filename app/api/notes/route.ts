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

function sanitizeIp(ip: string): string {
  // Clean the IP address by removing any extra spaces or invalid characters
  return ip.trim().split(',')[0].trim();
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
  const headers = {
    forwarded: request.headers.get('forwarded'),
    xForwardedFor: request.headers.get('x-forwarded-for'),
    xRealIp: request.headers.get('x-real-ip'),
    cfConnectingIp: request.headers.get('cf-connecting-ip'), // Cloudflare
    trueClientIp: request.headers.get('true-client-ip'),    // Cloudflare
    xClientIp: request.headers.get('x-client-ip'),
  };

  // Log headers in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('IP-related headers:', headers);
  }

  // Try each header in order
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (headerValue) {
      const ip = sanitizeIp(headerValue);
      if (!isLocalhost(ip)) {
        console.log(`Using IP from ${headerName}:`, ip);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateNoteRequest;
    const clientIp = getIpAddress(request);
    
    // Log in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.log('Received request from IP:', clientIp);
      console.log('Request body:', body);
    }

    // Validate content
    if (!body.content?.trim()) {
      console.log('Invalid request: Empty content');
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

    // Log success in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.log('Note created successfully:', data);
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