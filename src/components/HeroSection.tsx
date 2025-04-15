
import { motion } from "framer-motion";
import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 w-full flex flex-col items-center">
      {/* Hero Content */}
      <div className="container px-4 md:px-6 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gradient">
            AI-Powered Aircraft Recognition
          </h1>
          <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground mt-4">
            Upload any aircraft image and instantly identify the exact model with detailed specifications using advanced AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-8 rounded-2xl max-w-3xl w-full mx-auto mt-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Try It Now</h2>
            <p className="text-muted-foreground">
              Upload an image of any aircraft to see the AI in action
            </p>
          </div>

          <div className="border-2 border-dashed border-primary/20 rounded-xl p-12 flex flex-col items-center justify-center gap-4">
            <Upload size={48} className="text-primary/80" />
            <p>Drag & drop an image here or click to browse</p>
            <Button asChild>
              <Link to="/upload">
                Upload Image <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          <FeatureCard 
            title="Instant Recognition" 
            description="Our AI model can identify thousands of aircraft models with high precision"
          />
          <FeatureCard 
            title="Detailed Specs" 
            description="Get comprehensive specifications including speed, range, and origin"
          />
          <FeatureCard 
            title="Flight History Scanner" 
            description="Estimate flight paths based on image metadata"
          />
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="glass-panel p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default HeroSection;
