import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from 'motion/react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  index: number;
  onClick?: () => void;
}

export function FeatureCard({ title, description, icon: Icon, color, index, onClick }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateX: 5,
        rotateY: 5
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="perspective-1000"
    >
      <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm group h-full">
        <CardContent className="p-6 space-y-4 h-full flex flex-col">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.8 + index * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 200
            }}
            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-current/25 transition-shadow duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-semibold text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {title}
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {description}
            </p>
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
          >
            <Button 
              className={`w-full bg-gradient-to-r ${color} hover:shadow-lg hover:shadow-current/25 text-white border-0 group-hover:scale-105 transition-all duration-300`}
              size="lg"
              onClick={onClick}
            >
              <span>Launch</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>

          {/* Hover Effect Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg pointer-events-none`} />
        </CardContent>
      </Card>
    </motion.div>
  );
}