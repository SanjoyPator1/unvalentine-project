import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { FloatingNote } from "@/components/FloatingNote";
import { NoteDialog } from "@/components/NoteDialog";
import { useWindowSize } from "@/hooks/use-window-size";
import { Note } from "@/types/note";
import { noteService } from "@/lib/services/noteService";

const NAVBAR_HEIGHT = 64;

const getDeviceConfig = (width: number) => {
  if (width < 640) {
    // Mobile
    return {
      maxNotes: 8,
      notesPerFetch: 5,
      movementDuration: 40,
      scale: { min: 0.6, max: 0.8 },
      updateInterval: 15000,
      padding: 80,
    };
  } else if (width < 1024) {
    // Tablet
    return {
      maxNotes: 15,
      notesPerFetch: 8,
      movementDuration: 35,
      scale: { min: 0.65, max: 0.85 },
      updateInterval: 12000,
      padding: 100,
    };
  } else {
    // Desktop
    return {
      maxNotes: 25,
      notesPerFetch: 15,
      movementDuration: 30,
      scale: { min: 0.7, max: 1 },
      updateInterval: 10000,
      padding: 150,
    };
  }
};

const getRandomPosition = (
  width: number,
  height: number,
  padding: number,
  isInitial = false
) => {
  if (isInitial) {
    const gridCols = width < 640 ? 2 : width < 1024 ? 3 : 4;
    const gridRows = width < 640 ? 4 : width < 1024 ? 5 : 6;

    const cellWidth = (width - padding * 2) / gridCols;
    const cellHeight = (height - NAVBAR_HEIGHT - padding * 2) / gridRows;

    const col = Math.floor(Math.random() * gridCols);
    const row = Math.floor(Math.random() * gridRows);

    const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.5;
    const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.5;

    return {
      x: padding + col * cellWidth + cellWidth / 2 + randomOffsetX,
      y:
        NAVBAR_HEIGHT +
        padding +
        row * cellHeight +
        cellHeight / 2 +
        randomOffsetY,
    };
  }

  const safeWidth = Math.max(width - padding * 2, 300);
  const safeHeight = Math.max(height - padding * 2 - NAVBAR_HEIGHT, 400);

  return {
    x: Math.random() * safeWidth + padding,
    y: Math.random() * safeHeight + NAVBAR_HEIGHT + padding,
  };
};

const AnimatedNote = React.memo(
  ({
    note,
    width,
    height,
    onClick,
    deviceConfig,
    isInitial = false,
  }: {
    note: Note;
    width: number;
    height: number;
    onClick: () => void;
    deviceConfig: ReturnType<typeof getDeviceConfig>;
    isInitial?: boolean;
  }) => {
    const controls = useAnimationControls();
    const isMobile = width < 640;
    const isAnimating = useRef(false);
    const isMounted = useRef(false);
    const prefersReducedMotion = useRef(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    const scale = useRef(
      Math.random() * (deviceConfig.scale.max - deviceConfig.scale.min) +
        deviceConfig.scale.min
    );

    const initialPosition = useRef(
      getRandomPosition(width, height, deviceConfig.padding, isInitial)
    );

    const startAnimation = useCallback(async () => {
      if (
        !isMounted.current ||
        isAnimating.current ||
        prefersReducedMotion.current
      )
        return;
      isAnimating.current = true;

      try {
        await controls.start({
          opacity: 1,
          scale: scale.current,
          transition: {
            duration: isInitial ? 1.2 : 0.5,
            delay: isInitial ? Math.random() * 0.5 : 0,
            ease: isInitial ? "easeOut" : "linear",
          },
        });

        if (isMounted.current && !prefersReducedMotion.current) {
          while (isMounted.current) {
            const newPosition = getRandomPosition(
              width,
              height,
              deviceConfig.padding,
              false
            );
            await controls.start({
              x: newPosition.x,
              y: newPosition.y,
              transition: {
                duration: deviceConfig.movementDuration,
                ease: "linear",
              },
            });
          }
        }
      } catch (error) {
        console.error("Animation error:", error);
      } finally {
        isAnimating.current = false;
      }
    }, [controls, width, height, deviceConfig, isInitial]);

    useEffect(() => {
      isMounted.current = true;
      const delay = isInitial ? Math.random() * 1000 : Math.random() * 500;
      const timeoutId = setTimeout(startAnimation, delay);

      return () => {
        isMounted.current = false;
        clearTimeout(timeoutId);
      };
    }, [startAnimation, isInitial]);

    return (
      <motion.div
        initial={{
          x: initialPosition.current.x,
          y: initialPosition.current.y,
          opacity: 0,
          scale: isInitial ? 0.5 : scale.current,
        }}
        animate={controls}
        style={{
          position: "absolute",
          willChange: "transform",
          contain: "layout style paint",
        }}
        className="gpu-accelerated"
      >
        <FloatingNote note={note} onClick={onClick} isMobile={isMobile} />
      </motion.div>
    );
  }
);

AnimatedNote.displayName = "AnimatedNote";

export function NotesVisualization({ initialNotes }: { initialNotes: Note[] }) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const { width = 0, height = 0 } = useWindowSize();
  const deviceConfig = getDeviceConfig(width);
  const totalNotesRef = useRef<number | null>(null);
  const fetchedOffsets = useRef<Set<number>>(new Set());

  const getRandomOffset = useCallback(async () => {
    if (totalNotesRef.current === null) {
      try {
        const { total } = await noteService.getNotes(1, 0);
        totalNotesRef.current = total;
      } catch (error) {
        console.error("Failed to get total notes count:", error);
        return null;
      }
    }

    const total = totalNotesRef.current;
    const maxOffset = Math.max(0, total - deviceConfig.notesPerFetch);

    if (fetchedOffsets.current.size * deviceConfig.notesPerFetch >= total) {
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
  }, [deviceConfig.notesPerFetch]);

  const fetchRandomNotes = useCallback(async () => {
    const offset = await getRandomOffset();
    if (offset === null) return false;

    try {
      const { notes: newNotes } = await noteService.getNotes(
        deviceConfig.notesPerFetch,
        offset
      );

      setNotes((currentNotes) => {
        const combinedNotes = [...currentNotes, ...newNotes];
        const uniqueNotes = Array.from(
          new Map(combinedNotes.map((note) => [note.id, note])).values()
        );
        return uniqueNotes.slice(-deviceConfig.maxNotes);
      });
      return true;
    } catch (error) {
      console.error("Failed to fetch random notes:", error);
      return false;
    }
  }, [getRandomOffset, deviceConfig]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const setupInterval = () => {
      intervalId = setInterval(async () => {
        const shouldContinue = await fetchRandomNotes();
        if (!shouldContinue) {
          clearInterval(intervalId);
        }
      }, deviceConfig.updateInterval);
    };

    setupInterval();
    return () => clearInterval(intervalId);
  }, [fetchRandomNotes, deviceConfig]);

  const handleNoteClick = useCallback((note: Note) => {
    setSelectedNote(note);
    setDialogOpen(true);
  }, []);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {notes.map((note, index) => (
            <AnimatedNote
              key={note.id}
              note={note}
              width={width}
              height={height}
              onClick={() => handleNoteClick(note)}
              deviceConfig={deviceConfig}
              isInitial={index < deviceConfig.maxNotes}
            />
          ))}
        </div>
      </div>

      <NoteDialog
        note={selectedNote}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

export default NotesVisualization;
