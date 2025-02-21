import { motion } from "framer-motion";
import { useMemo } from "react";

const ValentineLoading = () => {
  const decorations = [
    { emoji: "💪", size: "text-4xl" },
    { emoji: "✨", size: "text-5xl" },
    { emoji: "👑", size: "text-4xl" },
    { emoji: "🦋", size: "text-5xl" },
    { emoji: "⭐", size: "text-4xl" },
    { emoji: "🌟", size: "text-5xl" },
    { emoji: "🎭", size: "text-4xl" },
    { emoji: "🎵", size: "text-4xl" },
  ];

  const decorationsWithPositions = useMemo(() => {
    return decorations.map((item, index) => {
      const angle = Math.PI * (0.1 + (1 * index) / (decorations.length - 1));
      const radius = 170;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius + 90;

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
    animate: (custom: { floatOffset: number; rotateOffset: number }) => ({
      y: [custom.floatOffset, -custom.floatOffset, custom.floatOffset],
      rotate: [custom.rotateOffset, -custom.rotateOffset, custom.rotateOffset],
      scale: 1,
      opacity: [0.7, 1, 0.7],
      transition: {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative w-[700px] h-[400px]">
        {/* Background effects */}
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-3xl" />
        <div className="absolute inset-0 bg-pink-500/[0.03] blur-3xl rounded-full" />

        <div className="relative w-full h-full flex flex-col items-center justify-center -mt-20">
          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 z-10 mb-16"
          >
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Embracing Independence
            </h2>
            <p className="text-sm text-muted-foreground">
              Loading your wall of authentic expressions...
            </p>
          </motion.div>

          {/* Decorative elements below text */}
          <div className="relative w-full h-48">
            {decorationsWithPositions.map((item, index) => (
              <motion.div
                key={index}
                initial="initial"
                animate="animate"
                variants={floatingVariants}
                custom={{
                  floatOffset: item.floatOffset,
                  rotateOffset: item.rotateOffset,
                }}
                transition={{ delay: item.delay }}
                className="absolute"
                style={{
                  left: "50%",
                  top: "0%",
                  x: item.x,
                  y: item.y,
                }}
              >
                <div
                  className={`${item.size} filter drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transform -translate-x-1/2 -translate-y-1/2`}
                >
                  {item.emoji}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValentineLoading;
