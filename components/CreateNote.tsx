"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { noteService } from "@/lib/services/noteService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PenSquare, Loader2, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function CreateNote() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const maxLength = 10000;

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Your note is empty",
        description: "Write something to share with the community.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await noteService.createNote(content);
      setContent("");
      toast({
        title: "Note posted successfully",
        description: "Your voice has been added to our digital wall.",
      });

      trackEvent("create_note", "engagement", "note_created_success");

      router.push("/notes");
    } catch (error) {
      toast({
        title: "Couldn't post your note",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
      trackEvent("note_error", "engagement", "note_creation_failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative group">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your Valentine's Day perspective... Your single status is your strength, your thoughts are your power."
          className="min-h-[200px] resize-none bg-background/50 border-pink-500/20 focus-visible:ring-1 focus-visible:ring-pink-500/30 rounded-lg shadow-sm transition-all duration-200"
          disabled={isSubmitting}
          maxLength={maxLength}
        />
        <div className="absolute bottom-3 right-3 text-sm text-muted-foreground/60 transition-opacity duration-200 opacity-0 group-focus-within:opacity-100">
          {content.length}/{maxLength}
        </div>
        {content && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => setContent("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:hover:shadow-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <PenSquare className="mr-2 h-4 w-4" />
            Post Note
          </>
        )}
      </Button>
    </form>
  );
}
