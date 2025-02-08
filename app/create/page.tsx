"use client";
import { CreateNote } from "@/components/CreateNote";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const textGradientVariants: Variants = {
  initial: {
    backgroundPositionX: "0%",
  },
  animate: {
    backgroundPositionX: "100%",
    transition: {
      duration: 3,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
  hover: {
    transition: {
      duration: 0.3,
    },
  },
};

export default function CreateNotePage() {
  return (
    <motion.div
      className="container max-w-2xl mx-auto md:py-12 space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center space-y-4" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Express Your{" "}
          <motion.span
            className="inline-block bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto]"
            variants={textGradientVariants}
            initial="initial"
            animate="animate"
          >
            Truth
          </motion.span>
        </h1>
        <motion.p
          className="text-muted-foreground text-lg max-w-[600px] mx-auto"
          variants={itemVariants}
        >
          This Valentine&apos;s Day, share your authentic thoughts anonymously.
          Join our community of singles expressing themselves through digital
          notes.
        </motion.p>
      </motion.div>

      <motion.div
        className="backdrop-blur-sm bg-card/30 rounded-xl shadow-sm border border-border/10"
        variants={cardVariants}
        whileHover="hover"
        initial="hidden"
        animate="visible"
        layout
      >
        <motion.div
          className="max-w-xl mx-auto p-6 space-y-6"
          variants={itemVariants}
        >
          <motion.div className="space-y-2" variants={itemVariants}>
            <motion.h2
              className="text-xl font-semibold"
              variants={itemVariants}
            >
              Write Your Note
            </motion.h2>
            <motion.p
              className="text-sm text-muted-foreground"
              variants={itemVariants}
            >
              Whether you&apos;re celebrating independence or expressing your
              feelings, your voice matters here
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <CreateNote />
          </motion.div>

          <motion.div
            className="pt-4 border-t border-border/40"
            variants={itemVariants}
          >
            <motion.p
              className="text-sm text-muted-foreground text-center"
              variants={itemVariants}
            >
              Your identity stays private. Your thoughts become part of our
              collective expression.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
