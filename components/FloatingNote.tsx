import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomAvatar } from "@/lib/helperFunction";
import { Note } from "@/types/note";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Heart } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

interface FloatingNoteProps {
  note: Note;
  onClick: () => void;
  isMobile?: boolean;
}

const stickyNoteVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    rotate: [-0.5, 0.5, -0.5, 0],
    transition: {
      scale: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
      rotate: {
        duration: 0.3,
      },
    },
  },
  float: {
    y: [0, -8, 0],
    transition: {
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  mobileInitial: {
    opacity: 0,
    scale: 0.9,
  },
  mobileAnimate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
    },
  },
  mobileHover: {
    scale: 1.01,
    transition: {
      duration: 0.2,
    },
  },
  mobileFloat: {
    y: [0, -4, 0],
    transition: {
      y: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

export function FloatingNote({
  note,
  onClick,
  isMobile = false,
}: FloatingNoteProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick();
    },
    [onClick]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      onClick();
    },
    [onClick]
  );

  const currentVariants = isMobile
    ? {
        initial: "mobileInitial",
        animate: prefersReducedMotion
          ? "mobileAnimate"
          : ["mobileAnimate", "mobileFloat"],
        whileHover: "mobileHover",
      }
    : {
        initial: "initial",
        animate: prefersReducedMotion ? "animate" : ["animate", "float"],
        whileHover: "hover",
      };

  return (
    <div className="p-4">
      {" "}
      <motion.div
        variants={stickyNoteVariants}
        {...currentVariants}
        className="cursor-pointer pointer-events-auto transform-gpu"
        onClick={handleClick}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        style={{
          touchAction: isMobile ? "none" : undefined,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <Card
          className={`
          ${isMobile ? "w-64" : "w-72"}
          bg-gradient-to-br from-background/95 to-background/90 
          backdrop-blur supports-[backdrop-filter]:bg-background/60 
          border-2 border-pink-500/20 hover:border-pink-500/30 
          transition-colors duration-300 shadow-lg hover:shadow-xl 
          hover:shadow-pink-500/10 relative overflow-visible group
          ${isMobile ? "touch-manipulation select-none" : ""}
          transform-gpu
        `}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full shadow-lg overflow-hidden transform-gpu">
            <div className="absolute inset-0.5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full" />
            <div className="absolute inset-1 bg-background rounded-full" />
            <div className="absolute inset-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-75 animate-pulse" />
          </div>

          <CardContent className={`${isMobile ? "p-4 pt-5" : "p-5 pt-6"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-pink-500/20 hover:border-pink-500/40 transition-colors duration-300">
                  <AvatarImage src={getRandomAvatar(note.id)} alt="Anonymous" />
                  <AvatarFallback>AN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Anonymous</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <time dateTime={note.created_at}>{formattedDate}</time>
                  </div>
                </div>
              </div>
              <Heart className="h-4 w-4 text-muted-foreground/40 group-hover:text-pink-500/60 transition-colors duration-300" />
            </div>

            <div className="relative">
              <p
                className={`
                text-sm leading-relaxed mb-3
                ${isMobile ? "line-clamp-3" : "line-clamp-4"}
              `}
              >
                {note.content}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background/95 to-transparent" />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs font-medium hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-300 group/button"
              onClick={handleClick}
            >
              Read more
              <ChevronRight className="h-3 w-3 ml-1 group-hover/button:translate-x-0.5 transition-transform" />
            </Button>
          </CardContent>

          <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 transform-gpu">
            <div className="absolute inset-0 bg-pink-500/20" />
            <div className="absolute bottom-0 right-0 w-0 h-0 border-8 border-background" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default FloatingNote;
