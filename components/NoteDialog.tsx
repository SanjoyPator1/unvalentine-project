import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { Note } from "@/types/note";
import { getRandomAvatar } from "@/lib/helperFunction";

interface NoteDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoteDialog({ note, open, onOpenChange }: NoteDialogProps) {
  if (!note) return null;

  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-background/95 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border-2 border-muted">
                    <AvatarImage
                      src={getRandomAvatar(note.id)}
                      alt="Anonymous"
                    />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm font-medium">Anonymous Note</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <time dateTime={note.created_at}>{formattedDate}</time>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="p-6 h-[60vh]">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              </ScrollArea>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
