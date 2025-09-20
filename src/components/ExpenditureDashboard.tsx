import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { InvoiceUploader } from "./InvoiceUploader";
import { SpendingTrends } from "./dashboard/SpendingTrends";
import { CategoryBreakdown } from "./dashboard/CategoryBreakdown";
import { InvoiceDistribution } from "./dashboard/InvoiceDistribution";
import { Forecasting } from "./dashboard/Forecasting";
import { SustainabilityTab } from "./dashboard/SustainabilityTab";
import { 
  ArrowLeft, 
  Upload, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Brain, 
  Leaf,
  FileText,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ExpenditureDashboardProps {
  onBack: () => void;
}

export function ExpenditureDashboard({ onBack }: ExpenditureDashboardProps) {
  const [invoicesUploaded, setInvoicesUploaded] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleInvoicesUploaded = (files: string[]) => {
    setUploadedFiles(files);
    setIsUploaderOpen(false);
    setProcessingStatus('processing');
    
    // Simulate OCR and AI processing
    setTimeout(() => {
      setProcessingStatus('complete');
      setInvoicesUploaded(true);
    }, 3000);
  };

  const tabs = [
    { id: 'trends', label: 'Spending Trends', icon: TrendingUp },
    { id: 'breakdown', label: 'Category Breakdown', icon: PieChart },
    { id: 'distribution', label: 'Invoice Distribution', icon: BarChart3 },
    { id: 'forecasting', label: 'Forecasting', icon: Brain },
    { id: 'sustainability', label: 'Sustainability', icon: Leaf }
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl">Expenditure Dashboard</h1>
            </div>
          </div>

          {invoicesUploaded && (
            <Badge variant="outline" className="border-green-500 text-green-400">
              <CheckCircle className="w-3 h-3 mr-1" />
              {uploadedFiles.length} Invoice{uploadedFiles.length !== 1 ? 's' : ''} Processed
            </Badge>
          )}
        </motion.header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!invoicesUploaded ? (
            <motion.div
              key="upload-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
            >
              {processingStatus === 'idle' && (
                <>
                  <div className="text-center space-y-4 max-w-lg">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    
                    <h2 className="text-3xl">Upload Your Invoices</h2>
                    <p className="text-gray-400 text-lg">
                      Upload your company invoices to unlock powerful financial insights. 
                      Our AI will extract data and build your personalized dashboard.
                    </p>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => setIsUploaderOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Invoices
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

              {processingStatus === 'processing' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl">Processing Your Invoices</h2>
                    <p className="text-gray-400">
                      Our AI is extracting data and building your financial insights...
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      'Applying OCR to extract text...',
                      'Analyzing financial data...',
                      'Building intelligent insights...'
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
              <Tabs defaultValue="trends" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-gray-900 border-gray-800">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="trends">
                  <SpendingTrends />
                </TabsContent>

                <TabsContent value="breakdown">
                  <CategoryBreakdown />
                </TabsContent>

                <TabsContent value="distribution">
                  <InvoiceDistribution />
                </TabsContent>

                <TabsContent value="forecasting">
                  <Forecasting />
                </TabsContent>

                <TabsContent value="sustainability">
                  <SustainabilityTab />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Invoice Uploader Modal */}
      <InvoiceUploader 
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUpload={handleInvoicesUploaded}
      />
    </div>
  );
}