import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { CompanyProfileUploader } from "./CompanyProfileUploader";
import { AvailableTenders } from "./bidding/AvailableTenders";
import { EligibilityChecker } from "./bidding/EligibilityChecker";
import { ApplicationTemplates } from "./bidding/ApplicationTemplates";
import { ActiveProposals } from "./bidding/ActiveProposals";
import { CompanyProfile } from "./bidding/CompanyProfile";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  Gavel,
  Search,
  FileCheck,
  Send,
  Building,
  Trophy,
  XCircle,
  Target,
} from "lucide-react";

interface BiddingAssistantProps {
  onBack: () => void;
}

export function BiddingAssistant({ onBack }: BiddingAssistantProps) {
  const [profileUploaded, setProfileUploaded] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "complete"
  >("idle");
  const [companyData, setCompanyData] = useState<any>(null);

  // Mock statistics - would come from real data
  const stats = {
    applied: 12,
    won: 3,
    lost: 2,
    pending: 7,
    successRate: 25,
  };

  const handleProfileUploaded = (data: any) => {
    setCompanyData(data);
    setIsUploaderOpen(false);
    setProcessingStatus("processing");

    // Simulate AI processing of company profile
    setTimeout(() => {
      setProcessingStatus("complete");
      setProfileUploaded(true);
    }, 3000);
  };

  const tabs = [
    { id: "tenders", label: "Available Tenders", icon: Search },
    { id: "eligibility", label: "Eligibility Checker", icon: CheckCircle },
    { id: "templates", label: "Application Templates", icon: FileCheck },
    { id: "proposals", label: "Active Proposals", icon: Send },
    { id: "profile", label: "Company Profile", icon: Building },
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl">Bid Proposal</h1>
            </div>
          </div>

          {profileUploaded && (
            <Badge
              variant="outline"
              className="border-green-500 text-green-400"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Profile Active
            </Badge>
          )}
        </motion.header>

        {/* Statistics Panel */}
        {profileUploaded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Send className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl text-white">{stats.applied}</p>
                <p className="text-gray-400 text-sm">Applied</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-2xl text-white">{stats.won}</p>
                <p className="text-gray-400 text-sm">Won</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-2xl text-white">{stats.lost}</p>
                <p className="text-gray-400 text-sm">Lost</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-2xl text-white">{stats.pending}</p>
                <p className="text-gray-400 text-sm">Pending</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl text-white">{stats.successRate}%</p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!profileUploaded ? (
            <motion.div
              key="upload-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
            >
              {processingStatus === "idle" && (
                <>
                  <div className="text-center space-y-4 max-w-lg">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-3xl">Upload Company Profile</h2>
                    <p className="text-gray-400 text-lg">
                      Upload your company profile document to unlock tender
                      opportunities and automated eligibility checking. Include
                      details about your services, team size, certifications,
                      and past projects.
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => setIsUploaderOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Profile
                  </Button>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl">
                    {tabs.map((tab, index) => (
                      <motion.div
                        key={tab.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                        className="text-center space-y-2"
                      >
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto opacity-50">
                          <tab.icon className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-500">{tab.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {processingStatus === "processing" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl">Processing Your Profile</h2>
                    <p className="text-gray-400">
                      Our AI is analyzing your company profile and matching you
                      with relevant opportunities...
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Extracting company information...",
                      "Analyzing capabilities and certifications...",
                      "Matching with tender opportunities...",
                    ].map((step, index) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.8, duration: 0.5 }}
                        className="flex items-center space-x-3 text-sm text-gray-300"
                      >
                        <Clock className="w-4 h-4" />
                        <span>{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Tabs defaultValue="tenders" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-gray-900 border-gray-800">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="tenders">
                  <AvailableTenders companyData={companyData} />
                </TabsContent>

                <TabsContent value="eligibility">
                  <EligibilityChecker companyData={companyData} />
                </TabsContent>

                <TabsContent value="templates">
                  <ApplicationTemplates companyData={companyData} />
                </TabsContent>

                <TabsContent value="proposals">
                  <ActiveProposals />
                </TabsContent>

                <TabsContent value="profile">
                  <CompanyProfile
                    companyData={companyData}
                    onUpdate={setCompanyData}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Company Profile Uploader Modal */}
      <CompanyProfileUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUpload={handleProfileUploaded}
      />
    </div>
  );
}
