import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CompanyProfileUploader } from "./CompanyProfileUploader";
import { TemplateSelector } from "./project-plan/TemplateSelector";
import { PlanGenerator } from "./project-plan/PlanGenerator";
import { PlanEditor } from "./project-plan/PlanEditor";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  FileCheck,
  Download,
  Building,
  Target,
  Zap,
} from "lucide-react";

interface ProjectPlanGeneratorProps {
  onBack: () => void;
}

export function ProjectPlanGenerator({ onBack }: ProjectPlanGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<
    "profile" | "template" | "generate" | "edit"
  >("profile");
  const [profileUploaded, setProfileUploaded] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "complete"
  >("idle");
  const [companyData, setCompanyData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleProfileUploaded = (data: any) => {
    setCompanyData(data);
    setIsUploaderOpen(false);
    setProcessingStatus("processing");

    // Simulate AI processing of company profile
    setTimeout(() => {
      setProcessingStatus("complete");
      setProfileUploaded(true);
      setCurrentStep("template"); // Go to template selection step
    }, 3000);
  };

  const handleTemplateSelected = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep("generate");
  };

  const handlePlanGenerated = (plan: any) => {
    setGeneratedPlan(plan);
    setCurrentStep("edit");
  };

  const steps = [
    {
      id: "profile",
      label: "Company Profile",
      icon: Building,
      completed: profileUploaded,
    },
    {
      id: "template",
      label: "Select Template",
      icon: FileText,
      completed: !!selectedTemplate,
    },
    {
      id: "generate",
      label: "Generate Plan",
      icon: Zap,
      completed: !!generatedPlan,
    },
    { id: "edit", label: "Review & Edit", icon: FileCheck, completed: false },
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
                <FileText className="w-5 h-5 text-white" />
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

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : currentStep === step.id
                            ? "bg-purple-500 text-white"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="hidden sm:block">
                        <p
                          className={`text-sm ${
                            step.completed || currentStep === step.id
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-px mx-4 ${
                          step.completed ? "bg-green-500" : "bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === "profile" && (
            <motion.div
              key="profile-step"
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
                      Upload your company profile to generate compliant project
                      documentation. Include your vision, team size, sector,
                      expertise, certifications, and achievements.
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto opacity-50">
                        <FileText className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500">Choose Template</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto opacity-50">
                        <Zap className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500">Generate Plan</p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto opacity-50">
                        <Download className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500">Download</p>
                    </div>
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
                      Our AI is analyzing your company profile and preparing
                      template options...
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Extracting company information...",
                      "Analyzing capabilities and expertise...",
                      "Matching with template requirements...",
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
          )}

          {currentStep === "template" && (
            <motion.div
              key="template-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <TemplateSelector
                companyData={companyData}
                onTemplateSelected={handleTemplateSelected}
              />
            </motion.div>
          )}

          {currentStep === "generate" && (
            <motion.div
              key="generate-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <PlanGenerator
                companyData={companyData}
                selectedTemplate={selectedTemplate}
                onPlanGenerated={handlePlanGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </motion.div>
          )}

          {currentStep === "edit" && generatedPlan && (
            <motion.div
              key="edit-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <PlanEditor
                generatedPlan={generatedPlan}
                companyData={companyData}
                selectedTemplate={selectedTemplate}
                onBack={() => setCurrentStep("generate")}
              />
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
