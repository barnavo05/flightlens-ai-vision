
import React from "react";
import { motion } from "framer-motion";

const BackgroundEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Multiple background images with parallax effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?q=80&w=2070')] bg-cover bg-center"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518623489648-a173ef7824f3?q=80&w=2062')] bg-cover bg-center mix-blend-overlay"
      />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-background"></div>
    </div>
  );
};

export default BackgroundEffect;
