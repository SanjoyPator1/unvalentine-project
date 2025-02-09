"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { noteService } from "@/lib/services/noteService";
import { NotesVisualization } from "@/components/NotesVisualization";
import { Note } from "@/types/note";
import ValentineLoading from "@/components/ValentineLoading";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  const decorations = [
    // { emoji: "💪", size: "text-3xl" },
    { emoji: "✨", size: "text-4xl" },
    { emoji: "👑", size: "text-3xl" },
    { emoji: "🦋", size: "text-4xl" },
    { emoji: "⭐", size: "text-3xl" },
    { emoji: "🌟", size: "text-4xl" },
    { emoji: "🎭", size: "text-3xl" },
    { emoji: "🎵", size: "text-3xl" },
  ];

  const decorationsWithPositions = useMemo(() => {
    const spacing = 60;
    const totalWidth = (decorations.length - 1) * spacing;

    return decorations.map((item, index) => {
      const x = -totalWidth / 2 + index * spacing;
      const y = 5;

      return {
        ...item,
        x,
        y,
        delay: index * 0.15,
        floatOffset: Math.random() * 15 - 7.5,
        rotateOffset: Math.random() * 20 - 10,
      };
    });
  }, []);

  const floatingVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      rotate: 0,
    },
    animate: (custom: {
      floatOffset: number;
      rotateOffset: number;
      x: number;
      y: number;
    }) => ({
      x: custom.x,
      y: [
        custom.y + custom.floatOffset,
        custom.y - custom.floatOffset,
        custom.y + custom.floatOffset,
      ],
      rotate: [custom.rotateOffset, -custom.rotateOffset, custom.rotateOffset],
      scale: 1,
      opacity: [0.7, 1, 0.7],
      transition: {
        x: {
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        },
        y: {
          repeat: Infinity,
          duration: 3 + Math.random(),
          ease: "easeInOut",
        },
        rotate: {
          repeat: Infinity,
          duration: 4 + Math.random(),
          ease: "easeInOut",
        },
        opacity: {
          repeat: Infinity,
          duration: 2 + Math.random(),
          ease: "easeInOut",
        },
        scale: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
    }),
  };

  useEffect(() => {
    const fetchInitialNotes = async () => {
      try {
        const { notes: fetchedNotes } = await noteService.getNotes(15, 0);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialNotes();

    const timer = setTimeout(() => {
      setShowDescription(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ValentineLoading />;
  }

  return (
    <div className="fixed inset-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-muted/20 pointer-events-none"
      />

      <div className="absolute inset-0">
        <NotesVisualization initialNotes={notes} />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-0 right-0 flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-x-4 -inset-y-2 bg-background/5 backdrop-blur-[2px] rounded-3xl" />
            <div className="absolute -inset-x-8 -inset-y-4 bg-pink-500/[0.02] blur-2xl rounded-full" />

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0, 0.2, 0.2, 1],
              }}
              className="relative text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="inline-block bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] [text-shadow:0_0_25px_rgba(236,72,153,0.2)]">
                Express Your Heart
              </span>
            </motion.h1>
          </div>

          <AnimatePresence>
            {showDescription && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.4,
                    ease: [0, 0.2, 0.2, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  transition: {
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground mx-auto max-w-[700px] mt-6 px-4"
              >
                Share your thoughts anonymously this Valentine&apos;s Day. Join
                our community of singles expressing themselves through digital
                sticky notes.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div className="relative w-full h-48 mt-8">
            {decorationsWithPositions.map((item, index) => {
              const y = showDescription ? item.y : item.y - 30;
              const x = item.x;

              return (
                <motion.div
                  key={index}
                  initial="initial"
                  animate="animate"
                  variants={floatingVariants}
                  custom={{
                    floatOffset: item.floatOffset,
                    rotateOffset: item.rotateOffset,
                    x,
                    y,
                  }}
                  transition={{ delay: item.delay }}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "0%",
                  }}
                >
                  <div
                    className={`${item.size} filter drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transform -translate-x-1/2 -translate-y-1/2`}
                  >
                    {item.emoji}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
