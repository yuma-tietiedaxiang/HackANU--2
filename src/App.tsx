import bossBabyImage from "figma:asset/60370e76ad86727a660dc2e6d1cdd0123fe7159f.png";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { ChatAssistant } from "./components/ChatAssistant";
import { FeatureCard } from "./components/FeatureCard";
import { ExpenditureDashboard } from "./components/ExpenditureDashboard";
import { ProjectPlanGenerator } from "./components/ProjectPlanGenerator";
import { NetworkingHub } from "./components/NetworkingHub";
import { ScenarioSimulator } from "./components/ScenarioSimulator";
import { motion } from "motion/react";
import { TrendingUp, Gavel, Users, Sparkles, Target } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "home" | "expenditure" | "bidding" | "networking" | "scenario"
  >("home");

  const features = [
    {
      title: "Expenditure Dashboard",
      description:
        "Track and analyze your startup's financial health with intelligent insights",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      onClick: () => setCurrentPage("expenditure"),
    },
    {
      title: "Project Plan Generator",
      description:
        "Create formal, compliant project documentation with AI-powered templates",
      icon: Gavel,
      color: "from-purple-500 to-pink-500",
      onClick: () => setCurrentPage("bidding"),
    },
    {
      title: "Networking Registration",
      description:
        "Connect with investors, mentors, and fellow entrepreneurs in your ecosystem",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      onClick: () => setCurrentPage("networking"),
    },
    {
      title: "Scenario Simulator",
      description:
        "Model different business scenarios and test strategic decisions with AI-powered simulations",
      icon: Target,
      color: "from-orange-500 to-red-500",
      onClick: () => setCurrentPage("scenario"),
    },
  ];

  if (currentPage === "expenditure") {
    return <ExpenditureDashboard onBack={() => setCurrentPage("home")} />;
  }

  if (currentPage === "bidding") {
    return <ProjectPlanGenerator onBack={() => setCurrentPage("home")} />;
  }

  if (currentPage === "networking") {
    return <NetworkingHub onBack={() => setCurrentPage("home")} />;
  }

  if (currentPage === "scenario") {
    return <ScenarioSimulator onBack={() => setCurrentPage("home")} />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -20, 20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Co-founder</span>
          </div>

          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            Chat Assistant
          </Button>
        </motion.header>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Co-founder
              </motion.h1>

              <motion.p
                className="text-xl lg:text-2xl text-gray-300 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                "I run on code, not equity."
              </motion.p>

              <motion.p
                className="text-lg text-gray-400 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Your digital co-founder that helps startups manage finances,
                secure contracts, and build meaningful connections—all powered
                by intelligent automation.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg"
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Boss Baby Character */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotateY: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
              <img
                src={bossBabyImage}
                alt="Boss Baby - Your Digital Co-founder"
                className="relative w-80 h-80 object-contain rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <FeatureCard {...feature} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Built for the next generation of entrepreneurs • Hackathon 2024</p>
        </motion.footer>
      </div>

      {/* Chat Assistant */}
      <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
