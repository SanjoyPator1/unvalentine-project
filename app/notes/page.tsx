"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Note } from "@/types/note";
import { NoteCard } from "@/components/NoteCard";
import { Loader2 } from "lucide-react";
import { noteService } from "@/lib/services/noteService";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PAGE_SIZE = 10;

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef(null);

  const fetchNotes = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const { notes: newNotes, total } = await noteService.getNotes(
        PAGE_SIZE,
        offset
      );
      setNotes((prev) => [...prev, ...newNotes]);
      setOffset((prevOffset) => prevOffset + PAGE_SIZE);
      setHasMore(notes.length + newNotes.length < total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading, notes.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNotes();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNotes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.header
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-3">
            Anonymous Notes
          </h1>
          <p className="text-muted-foreground">
            A collection of heartfelt thoughts shared by our community
          </p>
        </motion.header>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {notes.map((note, index) => (
            <NoteCard
              key={note.id}
              note={note}
              index={index}
              className="transition-all duration-300"
            />
          ))}
        </div>

        {hasMore && (
          <div
            ref={observerTarget}
            className="h-20 flex items-center justify-center"
          >
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Loading more notes...</span>
              </div>
            )}
          </div>
        )}

        {!hasMore && notes.length > 0 && (
          <motion.p
            className="text-center text-muted-foreground text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            You've reached the end of the notes ✨
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
