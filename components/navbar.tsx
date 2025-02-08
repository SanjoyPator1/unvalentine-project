"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, PenSquare, Layers, UserCircle2 } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Unvalentine
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-6">
          <nav className="flex items-center space-x-6">
            <Link href="/create" className="flex flex-col items-center text-sm">
              <Button
                variant={pathname === "/create" ? "secondary" : "ghost"}
                size="sm"
                className="w-9 px-0 mb-1"
              >
                <PenSquare className="h-5 w-5" />
              </Button>
              <span className="text-xs text-muted-foreground">Create</span>
            </Link>

            <Link href="/notes" className="flex flex-col items-center text-sm">
              <Button
                variant={pathname === "/notes" ? "secondary" : "ghost"}
                size="sm"
                className="w-9 px-0 mb-1"
              >
                <Layers className="h-5 w-5" />
              </Button>
              <span className="text-xs text-muted-foreground">Notes</span>
            </Link>

            <div className="flex flex-col items-center text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="w-9 px-0 mb-1"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <span className="text-xs text-muted-foreground">Sound</span>
            </div>

            <div className="flex flex-col items-center text-sm">
              <Button variant="ghost" size="sm" className="w-9 px-0 mb-1">
                <UserCircle2 className="h-5 w-5" />
              </Button>
              <span className="text-xs text-muted-foreground text-center">
                Anonymous
              </span>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}
