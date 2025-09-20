import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { formatNumber } from "../utils/numberFormatter";
import { EventDiscovery } from "./networking/EventDiscovery";
import { EventRegistration } from "./networking/EventRegistration";
import { CalendarDashboard } from "./networking/CalendarDashboard";
import { NetworkingAnalytics } from "./networking/NetworkingAnalytics";
import { RecommendationEngine } from "./networking/RecommendationEngine";
import {
  ArrowLeft,
  Users,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  Search,
  BarChart3,
  Bot,
} from "lucide-react";

interface NetworkingHubProps {
  onBack: () => void;
}

export function NetworkingHub({ onBack }: NetworkingHubProps) {
  const [activeTab, setActiveTab] = useState("discovery");
  const [isScanning, setIsScanning] = useState(true);

  // Mock statistics - would come from real data
  const stats = {
    eventsFound: 48,
    registered: 12,
    attended: 8,
    upcomingEvents: 5,
    networkingScore: 85,
  };

  // Simulate initial event scanning
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "discovery", label: "Event Discovery", icon: Search },
    { id: "recommendations", label: "AI Recommendations", icon: Bot },
    { id: "registration", label: "Registration Hub", icon: Target },
    { id: "calendar", label: "Calendar Dashboard", icon: Calendar },
    { id: "analytics", label: "Networking Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="h-6 w-px bg-gray-700" />

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl">Auto-Growth Engine</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isScanning ? (
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-400 animate-pulse"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Scanning Events...
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-green-500 text-green-400"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {stats.eventsFound} Events Found
              </Badge>
            )}
          </div>
        </motion.header>

        {/* Statistics Panel */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Search className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl text-white">{stats.eventsFound}</p>
              <p className="text-gray-400 text-sm">Events Found</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl text-white">{stats.registered}</p>
              <p className="text-gray-400 text-sm">Registered</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl text-white">{stats.attended}</p>
              <p className="text-gray-400 text-sm">Attended</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-2xl text-white">{stats.upcomingEvents}</p>
              <p className="text-gray-400 text-sm">Upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-2xl text-white">{stats.networkingScore}</p>
              <p className="text-gray-400 text-sm">Network Score</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="scanning-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[50vh] space-y-8"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl text-white">Scanning the Ecosystem</h2>
                <p className="text-gray-400">
                  Our AI is discovering networking opportunities tailored to
                  your startup...
                </p>
              </div>

              <div className="space-y-3">
                {[
                  "Scanning accelerator programs...",
                  "Finding relevant conferences...",
                  "Analyzing competition opportunities...",
                  "Matching investor events...",
                ].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.4, duration: 0.5 }}
                    className="flex items-center space-x-3 text-sm text-gray-300"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-5 bg-gray-900 border-gray-800">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center space-x-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="discovery">
                  <EventDiscovery />
                </TabsContent>

                <TabsContent value="recommendations">
                  <RecommendationEngine />
                </TabsContent>

                <TabsContent value="registration">
                  <EventRegistration />
                </TabsContent>

                <TabsContent value="calendar">
                  <CalendarDashboard />
                </TabsContent>

                <TabsContent value="analytics">
                  <NetworkingAnalytics />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
