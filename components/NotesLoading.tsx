import { motion } from "framer-motion";

const NotesLoading = () => {
  // Animation variants for floating notes
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const noteVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Positions for the floating notes
  const notePositions = [
    "translate-x-0",
    "-translate-x-16 translate-y-8",
    "translate-x-16 translate-y-8",
    "-translate-x-8 translate-y-16",
    "translate-x-8 translate-y-16",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Background blur effect */}
        <div className="absolute -inset-x-8 -inset-y-8 bg-background/50 backdrop-blur-sm rounded-3xl" />

        {/* Gradient glow effect */}
        <div className="absolute -inset-x-16 -inset-y-16 bg-pink-500/[0.03] blur-2xl rounded-full" />

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="relative flex flex-col items-center space-y-4"
        >
          {/* Floating notes */}
          <div className="relative h-32 w-32">
            {notePositions.map((position, index) => (
              <motion.div
                key={index}
                variants={noteVariants}
                className={`absolute w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/40 to-rose-500/40 backdrop-blur-sm ${position}`}
                style={{
                  transformOrigin: "center",
                  boxShadow: "0 0 20px rgba(236,72,153,0.1)",
                }}
              />
            ))}
          </div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="relative text-center space-y-2"
          >
            <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Gathering Notes
            </h2>
            <p className="text-sm text-muted-foreground">
              Creating your wall of expressions...
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotesLoading;
