
import { motion } from "framer-motion";
import { ArrowRight, Upload, PlaneTakeoff } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import BackgroundEffect from "@/components/BackgroundEffect";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundEffect />
      
      <header className="w-full py-4 px-6 glass-panel flex items-center justify-between relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <PlaneTakeoff size={28} className="text-primary" />
          <h1 className="text-xl font-bold text-gradient">FlightLens AI</h1>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <HeroSection />
      </main>

      <footer className="py-6 px-8 text-center text-sm text-muted-foreground relative z-10">
        <p>© 2025 FlightLens AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
