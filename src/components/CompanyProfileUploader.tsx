import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Trash2
} from 'lucide-react';

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

export function CompanyProfileUploader({ isOpen, onClose, onUpload }: CompanyProfileUploaderProps) {
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'form'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data for manual entry
  const [formData, setFormData] = useState<CompanyData>({
    name: '',
    description: '',
    size: '',
    founded: '',
    industry: '',
    services: [],
    certifications: [],
    pastProjects: [],
    capabilities: [],
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      website: ''
    }
  });

  const [newService, setNewService] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newCapability, setNewCapability] = useState('');

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    
    // Simulate file processing and data extraction
    setTimeout(() => {
      const mockCompanyData = {
        name: "TechStart Solutions",
        description: "A innovative startup specializing in AI-powered business solutions and digital transformation services.",
        size: "15-25 employees",
        founded: "2022",
        industry: "Technology Services",
        services: ["AI Development", "Web Development", "Digital Transformation", "Cloud Solutions"],
        certifications: ["ISO 27001", "AWS Partner", "Google Cloud Partner"],
        pastProjects: [
          {
            name: "Healthcare AI Platform",
            client: "MedTech Corp",
            value: "$125,000",
            year: "2023",
            description: "Developed AI-powered patient management system"
          },
          {
            name: "E-commerce Platform",
            client: "RetailPro Ltd",
            value: "$85,000",
            year: "2023",
            description: "Built scalable e-commerce solution with inventory management"
          }
        ],
        capabilities: ["Machine Learning", "React Development", "Node.js", "AWS", "Python"],
        contactInfo: {
          email: "contact@techstartsolutions.com",
          phone: "+1 (555) 123-4567",
          address: "123 Innovation Drive, Tech City, TC 12345",
          website: "www.techstartsolutions.com"
        }
      };

      setIsProcessing(false);
      onUpload(mockCompanyData);
    }, 2000);
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill in at least company name and description');
      return;
    }

    onUpload(formData);
  };

  const addArrayItem = (field: 'services' | 'certifications' | 'capabilities', value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));

    if (field === 'services') setNewService('');
    if (field === 'certifications') setNewCertification('');
    if (field === 'capabilities') setNewCapability('');
  };

  const removeArrayItem = (field: 'services' | 'certifications' | 'capabilities', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
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
          onClick={e => e.stopPropagation()}
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
              {/* Upload Method Selection */}
              <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'upload' | 'form')}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger value="upload">Upload Document</TabsTrigger>
                  <TabsTrigger value="form">Fill Form</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                  {isProcessing ? (
                    <div className="text-center space-y-4 py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto"
                      >
                        <FileText className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-white text-lg">Processing Document</h3>
                        <p className="text-gray-400">Extracting company information...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* File Upload Area */}
                      <div
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          handleFileUpload(e.dataTransfer.files);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                          isDragging 
                            ? 'border-purple-500 bg-purple-500/10' 
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-white">
                              Drop your company profile document here or{' '}
                              <span className="text-purple-400 underline">browse</span>
                            </p>
                            <p className="text-gray-400 text-sm">
                              Supports PDF, Word, or text files up to 10MB
                            </p>
                          </div>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                      </div>

                      {/* Upload Instructions */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-white mb-3">Your document should include:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Company name and description</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Team size and founding year</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Services and capabilities</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Certifications and compliance</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Past project experience</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Contact information</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="form" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-white">Basic Information</h3>
                      
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={formData.industry}
                          onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="e.g., Technology, Healthcare"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="size">Company Size</Label>
                          <Input
                            id="size"
                            value={formData.size}
                            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="e.g., 10-20 employees"
                          />
                        </div>
                        <div>
                          <Label htmlFor="founded">Founded</Label>
                          <Input
                            id="founded"
                            value={formData.founded}
                            onChange={(e) => setFormData(prev => ({ ...prev, founded: e.target.value }))}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="e.g., 2022"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-gray-800 border-gray-700 text-white h-24"
                          placeholder="Brief description of your company..."
                        />
                      </div>
                    </div>

                    {/* Services and Capabilities */}
                    <div className="space-y-4">
                      <h3 className="text-white">Services & Capabilities</h3>
                      
                      <div>
                        <Label>Services Offered</Label>
                        <div className="flex space-x-2 mb-2">
                          <Input
                            value={newService}
                            onChange={(e) => setNewService(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Add a service"
                          />
                          <Button
                            type="button"
                            onClick={() => addArrayItem('services', newService)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <span>{service}</span>
                              <button onClick={() => removeArrayItem('services', index)}>
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Certifications</Label>
                        <div className="flex space-x-2 mb-2">
                          <Input
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Add a certification"
                          />
                          <Button
                            type="button"
                            onClick={() => addArrayItem('certifications', newCertification)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <span>{cert}</span>
                              <button onClick={() => removeArrayItem('certifications', index)}>
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Technical Capabilities</Label>
                        <div className="flex space-x-2 mb-2">
                          <Input
                            value={newCapability}
                            onChange={(e) => setNewCapability(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Add a capability"
                          />
                          <Button
                            type="button"
                            onClick={() => addArrayItem('capabilities', newCapability)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.capabilities.map((capability, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <span>{capability}</span>
                              <button onClick={() => removeArrayItem('capabilities', index)}>
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                    <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleFormSubmit}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Create Profile
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}