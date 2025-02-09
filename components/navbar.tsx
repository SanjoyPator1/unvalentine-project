"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Layers,
  Menu,
  PenSquare,
  UserCircle2,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSoundContext } from "./SoundProvider";

const getValentineIcon = () => {
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();

  if (month === 1 && day >= 7 && day <= 14) {
    const dayMap: Record<number, string> = {
      7: "🌹", // Rose Day (Feb 7)
      8: "💍", // Propose Day (Feb 8)
      9: "🍫", // Chocolate Day (Feb 9)
      10: "🧸", // Teddy Day (Feb 10)
      11: "🤝", // Promise Day (Feb 11)
      12: "🤗", // Hug Day (Feb 12)
      13: "💋", // Kiss Day (Feb 13)
      14: "❤️", // Valentine's Day (Feb 14)
    };

    return dayMap[day] || "💝";
  }
  return "💝";
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [valentineIcon, setValentineIcon] = useState("💝");
  const { isMuted, toggleMute } = useSoundContext();

  useEffect(() => {
    setValentineIcon(getValentineIcon());
  }, []);

  const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
    <Link
      href={href}
      className="flex flex-col items-center text-sm"
      onClick={() => setIsOpen(false)}
    >
      <Button
        variant={isActive ? "secondary" : "ghost"}
        size="sm"
        className="w-9 px-0 mb-1"
      >
        {icon}
      </Button>
      <span className="text-xs text-muted-foreground">{label}</span>
    </Link>
  );

  const navItems = [
    {
      href: "/create",
      icon: <PenSquare className="h-5 w-5" />,
      label: "Create",
    },
    {
      href: "/notes",
      icon: <Layers className="h-5 w-5" />,
      label: "Notes",
    },
  ];

  const renderNavContent = () => (
    <>
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={pathname === item.href}
        />
      ))}
      <div className="flex flex-col items-center text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="w-9 px-0 mb-1"
          onClick={toggleMute}
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
        <span className="text-xs text-muted-foreground">Anonymous</span>
      </div>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-5 flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-4xl">{valentineIcon}</span>
          <span className="inline-block font-bold text-xl bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Unvalentine
          </span>
        </Link>

        <div className="flex-1 flex justify-end">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {renderNavContent()}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="w-9 px-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-64">
              <div className="flex flex-col space-y-6 mt-6">
                {renderNavContent()}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
