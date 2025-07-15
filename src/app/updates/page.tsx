'use client';

import { Construction } from "lucide-react";
import { motion } from "framer-motion";

export default function UpdatesPage() {
  return (
    <div className="h-[calc(100vh-3rem)] flex items-center justify-center">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{ 
            rotate: [-1, 1, -1],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Construction className="h-16 w-16 text-muted-foreground mx-auto" />
        </motion.div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground/70">Updates Under Construction</h1>
          <p className="text-muted-foreground">This section is being redesigned</p>
        </div>
      </motion.div>
    </div>
  );
}