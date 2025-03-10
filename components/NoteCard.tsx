"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { Note } from "@/types/note";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRandomAvatar } from "@/lib/helperFunction";

interface NoteCardProps {
  note: Note;
  className?: string;
  index?: number;
}

const MAX_PREVIEW_CHARS = 280;
const MAX_LINES_FALLBACK = 5;

export const NoteCard = ({
  note,
  className = "",
  index = 0,
}: NoteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const contentRef = useRef<HTMLParagraphElement>(null);

  const getDisplayText = () => {
    if (isExpanded) return note.content;

    if (note.content.length <= MAX_PREVIEW_CHARS) {
      return note.content;
    }

    const lastSpace = note.content.lastIndexOf(" ", MAX_PREVIEW_CHARS);
    return lastSpace > 0
      ? note.content.slice(0, lastSpace)
      : note.content.slice(0, MAX_PREVIEW_CHARS);
  };

  useEffect(() => {
    setAvatarUrl(getRandomAvatar(note.id));
  }, [note.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkOverflow = () => {
      if (contentRef.current) {
        const exceedsCharLimit = note.content.length > MAX_PREVIEW_CHARS;
        const lineHeight = parseInt(
          getComputedStyle(contentRef.current).lineHeight
        );
        const maxHeight = lineHeight * MAX_LINES_FALLBACK;
        const exceedsLineLimit = contentRef.current.scrollHeight > maxHeight;

        setShouldShowButton(exceedsCharLimit || exceedsLineLimit);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [note.content]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(note.created_at));
  }, [note.created_at]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.1, 0.3),
      }}
      className={className}
      viewport={{ once: true }}
    >
      <Card className="group hover:shadow-lg transition-shadow duration-300 dark:hover:shadow-pink-500/5">
        <CardContent className="p-5">
          <div className="flex gap-4">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <Avatar className="h-10 w-10 border-2 border-muted">
                <AvatarImage src={avatarUrl} alt="Anonymous User" />
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
            </div>

            {/* Content Section */}
            <div className="flex-grow space-y-3 min-w-0">
              <div className="relative">
                <p
                  ref={contentRef}
                  className="text-sm leading-relaxed transition-all duration-200"
                >
                  {getDisplayText()}
                  {!isExpanded && shouldShowButton && (
                    <span className="text-muted-foreground">...</span>
                  )}
                </p>

                <div className="flex gap-sm justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2">
                    <Clock className="h-3.5 w-3.5" />
                    <time dateTime={note.created_at}>{formattedDate}</time>
                  </div>
                  {shouldShowButton && (
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-200"
                      >
                        {isExpanded ? (
                          <span className="flex items-center gap-1">
                            Show less <ChevronUp className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            Show more <ChevronDown className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
