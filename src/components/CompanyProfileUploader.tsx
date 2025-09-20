import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  Building,
  Users,
  Award,
  Briefcase,
  Plus,
  Trash2,
} from "lucide-react";

interface CompanyProfileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

interface CompanyData {
  name: string;
  description: string;
  size: string;
  founded: string;
  industry: string;
  services: string[];
  certifications: string[];
  pastProjects: Array<{
    name: string;
    client: string;
    value: string;
    year: string;
    description: string;
  }>;
  capabilities: string[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    website: string;
  };
}

export function CompanyProfileUploader({
  isOpen,
  onClose,
  onUpload,
}: CompanyProfileUploaderProps) {
  const [selectedPdf, setSelectedPdf] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Available PDF options from plan_generator/pdfs folder
  const availablePdfs = [
    {
      id: "asteria",
      name: "Asteria Overview",
      filename: "Asteria_Overview.pdf",
      description: "Asteria company profile and project overview",
    },
    {
      id: "greengrid",
      name: "GreenGrid Overview",
      filename: "GreenGrid_Overview.pdf",
      description: "GreenGrid company profile and project overview",
    },
    {
      id: "buildright",
      name: "BuildRight Overview",
      filename: "BuildRight_Overview.pdf",
      description: "BuildRight company profile and project overview",
    },
  ];

  // Form data for manual entry
  const [formData, setFormData] = useState<CompanyData>({
    name: "",
    description: "",
    size: "",
    founded: "",
    industry: "",
    services: [],
    certifications: [],
    pastProjects: [],
    capabilities: [],
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      website: "",
    },
  });

  const [newService, setNewService] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newCapability, setNewCapability] = useState("");

  const handlePdfSelection = (pdfId: string) => {
    setSelectedPdf(pdfId);
  };

  const handleProcessPdf = () => {
    if (!selectedPdf) return;

    setIsProcessing(true);
    
    // Simulate PDF processing using the selected PDF
    setTimeout(() => {
      const selectedPdfData = availablePdfs.find(
        (pdf) => pdf.id === selectedPdf
      );
      const mockCompanyData = {
        name: selectedPdfData?.name || "Selected Company",
        description:
          selectedPdfData?.description || "Company profile from uploaded PDF",
        size: "15-25 employees",
        founded: "2022",
        industry: "Technology Services",
        services: [
          "AI Development",
          "Web Development",
          "Digital Transformation",
          "Cloud Solutions",
        ],
        certifications: ["ISO 27001", "AWS Partner", "Google Cloud Partner"],
        pastProjects: [
          {
            name: "Healthcare AI Platform",
            client: "MedTech Corp",
            value: "$125,000",
            year: "2023",
            description: "Developed AI-powered patient management system",
          },
          {
            name: "E-commerce Platform",
            client: "RetailPro Ltd",
            value: "$85,000",
            year: "2023",
            description:
              "Built scalable e-commerce solution with inventory management",
          },
        ],
        capabilities: [
          "Machine Learning",
          "React Development",
          "Node.js",
          "AWS",
          "Python",
        ],
        contactInfo: {
          email: "contact@techstartsolutions.com",
          phone: "+1 (555) 123-4567",
          address: "123 Innovation Drive, Tech City, TC 12345",
          website: "www.techstartsolutions.com",
        },
        selectedPdf: selectedPdfData?.filename,
      };

      setIsProcessing(false);
      onUpload(mockCompanyData);
    }, 2000);
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.description) {
      alert("Please fill in at least company name and description");
      return;
    }

    onUpload(formData);
  };

  const addArrayItem = (
    field: "services" | "certifications" | "capabilities",
    value: string
  ) => {
    if (!value.trim()) return;
    
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));

    if (field === "services") setNewService("");
    if (field === "certifications") setNewCertification("");
    if (field === "capabilities") setNewCapability("");
  };

  const removeArrayItem = (
    field: "services" | "certifications" | "capabilities",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-gray-900/95 border-gray-700 shadow-2xl backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-white flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Company Profile</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
                  {isProcessing ? (
                    <div className="text-center space-y-4 py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto"
                      >
                        <FileText className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                    <h3 className="text-white text-lg">
                      Processing PDF Document
                    </h3>
                    <p className="text-gray-400">
                      Extracting company information using AI...
                    </p>
                      </div>
                    </div>
                  ) : (
                    <>
                  {/* PDF Selection */}
                        <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-white text-xl">
                        Select Company Profile PDF
                      </h3>
                      <p className="text-gray-400">
                        Choose from the available company overview documents to
                        generate your project plan
                      </p>
                          </div>
                          
                    <div className="grid grid-cols-1 gap-4">
                      {availablePdfs.map((pdf) => (
                        <motion.div
                          key={pdf.id}
                          whileHover={{ scale: 1.02 }}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                            selectedPdf === pdf.id
                              ? "border-purple-500 bg-purple-500/10"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                          onClick={() => handlePdfSelection(pdf.id)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white text-lg font-medium">
                                {pdf.name}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {pdf.description}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                File: {pdf.filename}
                            </p>
                          </div>
                            <div className="flex items-center">
                              {selectedPdf === pdf.id ? (
                                <CheckCircle className="w-6 h-6 text-purple-400" />
                              ) : (
                                <div className="w-6 h-6 border-2 border-gray-400 rounded-full" />
                              )}
                      </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {selectedPdf && (
                      <div className="flex justify-center pt-4">
                          <Button
                          onClick={handleProcessPdf}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
                        >
                          <FileText className="w-5 h-5 mr-2" />
                          Process Selected PDF
                          </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
