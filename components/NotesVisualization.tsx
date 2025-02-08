"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { FloatingNote } from "./FloatingNote";
import { NoteDialog } from "./NoteDialog";
import { useWindowSize } from "@/hooks/use-window-size";
import { Note } from "@/types/note";
import { noteService } from "@/lib/services/noteService";

const NAVBAR_HEIGHT = 64;
const UPDATE_INTERVAL = 10000;
const NOTES_PER_FETCH = 15;
const MAX_NOTES = 25;
const MOVEMENT_DURATION = 20;

const getRandomPosition = (
  width: number,
  height: number,
  isInitial: boolean = false
) => {
  const padding = isInitial ? 150 : -100;

  const minX = padding;
  const maxX = width - padding;
  const minY = isInitial ? NAVBAR_HEIGHT + padding : NAVBAR_HEIGHT - padding;
  const maxY = height - padding;

  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY,
  };
};

export function NotesVisualization({ initialNotes }: { initialNotes: Note[] }) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const { width = 0, height = 0 } = useWindowSize();
  const totalNotesRef = useRef<number | null>(null);
  const fetchedOffsets = useRef<Set<number>>(new Set());

  const getRandomOffset = async () => {
    try {
      if (totalNotesRef.current === null) {
        const { total } = await noteService.getNotes(1, 0);
        totalNotesRef.current = total;
      }

      const total = totalNotesRef.current;
      const maxOffset = Math.max(0, total - NOTES_PER_FETCH);

      if (fetchedOffsets.current.size * NOTES_PER_FETCH >= total) {
        return null;
      }

      let attempts = 0;
      let offset: number;
      do {
        offset = Math.floor(Math.random() * maxOffset);
        attempts++;
      } while (fetchedOffsets.current.has(offset) && attempts < 10);

      if (attempts >= 10) return null;

      fetchedOffsets.current.add(offset);
      return offset;
    } catch (error) {
      console.error("Failed to get total notes count:", error);
      return null;
    }
  };

  const fetchRandomNotes = async () => {
    try {
      const offset = await getRandomOffset();

      if (offset === null) {
        console.log("All available notes have been fetched");
        return false;
      }

      const { notes: newNotes } = await noteService.getNotes(
        NOTES_PER_FETCH,
        offset
      );

      setNotes((currentNotes) => {
        const combinedNotes = [...currentNotes, ...newNotes];
        const uniqueNotes = Array.from(
          new Map(combinedNotes.map((note) => [note.id, note])).values()
        );
        return uniqueNotes.slice(-MAX_NOTES);
      });

      return true;
    } catch (error) {
      console.error("Failed to fetch random notes:", error);
      return false;
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const setupInterval = () => {
      intervalId = setInterval(async () => {
        const shouldContinue = await fetchRandomNotes();
        if (!shouldContinue) {
          clearInterval(intervalId);
        }
      }, UPDATE_INTERVAL);
    };

    setupInterval();
    return () => clearInterval(intervalId);
  }, []);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 overflow-hidden ">
        {notes.map((note) => (
          <FloatingNoteWithAnimation
            key={note.id}
            note={note}
            width={width}
            height={height}
            onClick={() => {
              handleNoteClick(note);
            }}
          />
        ))}
      </div>

      <NoteDialog
        note={selectedNote}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

// Separate component for animated note
function FloatingNoteWithAnimation({
  note,
  width,
  height,
  onClick,
}: {
  note: Note;
  width: number;
  height: number;
  onClick: () => void;
}) {
  const controls = useAnimationControls();
  const scale = Math.random() * 0.3 + 0.7;
  const startDelay = Math.random() * 1;

  const initialPosition = {
    x: Math.random() * (width + 400) - 200,
    y: Math.random() * (height + 400) - 200 + NAVBAR_HEIGHT,
  };

  const handleClick = () => {
    onClick();
  };

  useEffect(() => {
    const animatePosition = async () => {
      await controls.start({
        opacity: 1,
        transition: {
          duration: 1,
          delay: startDelay,
        },
      });

      while (true) {
        const newPosition = getRandomPosition(width, height);
        await controls.start({
          x: newPosition.x,
          y: newPosition.y,
          transition: {
            duration: MOVEMENT_DURATION,
            ease: "easeInOut",
          },
        });
      }
    };

    animatePosition();
  }, [controls, width, height, startDelay]);

  return (
    <motion.div
      initial={{
        x: initialPosition.x,
        y: initialPosition.y,
        opacity: 0,
        scale,
      }}
      animate={controls}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      style={{
        position: "absolute",
        transform: `scale(${scale})`,
      }}
    >
      <FloatingNote note={note} onClick={handleClick} />
    </motion.div>
  );
}
