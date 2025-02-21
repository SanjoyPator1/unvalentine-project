"use client";

import { motion } from "framer-motion";

export default function RootLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-col items-center space-y-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Unvalentine
          </span>
        </motion.div>

        <div className="relative w-24 h-8 flex justify-center items-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0.3 }}
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your digital wall...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
