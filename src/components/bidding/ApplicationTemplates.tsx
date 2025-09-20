import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  FileText, 
  Download, 
  Edit, 
  Send, 
  Eye,
  Sparkles,
  Copy,
  RefreshCw,
  CheckCircle,
  Clock,
  User,
  Building
} from 'lucide-react';

interface Template {
  id: string;
  tenderId: string;
  tenderTitle: string;
  sections: Array<{
    title: string;
    content: string;
    isEditable: boolean;
    wordCount: number;
  }>;
  completionScore: number;
  lastModified: string;
  status: 'draft' | 'review' | 'ready';
}

const mockTemplates: Template[] = [
  {
    id: 'TPL001',
    tenderId: 'T001',
    tenderTitle: 'Digital Transformation Platform Development',
    sections: [
      {
        title: 'Executive Summary',
        content: `TechStart Solutions is pleased to submit our proposal for the Digital Transformation Platform Development project. With our proven expertise in cloud architecture, React/Node.js development, and successful track record in delivering innovative digital solutions, we are uniquely positioned to transform your citizen services platform.

Our approach combines cutting-edge technology with user-centered design principles to create a comprehensive platform that will streamline government operations while enhancing citizen experience. We propose a phased implementation approach that minimizes disruption while delivering measurable value at each stage.`,
        isEditable: true,
        wordCount: 87
      },
      {
        title: 'Company Overview',
        content: `TechStart Solutions is an innovative technology startup founded in 2022, specializing in AI-powered business solutions and digital transformation services. Our team of 20 skilled professionals brings together expertise in cloud architecture, full-stack development, and emerging technologies.

Key differentiators:
• AWS Partnership and cloud migration expertise
• ISO 27001 certification ensuring security compliance
• Proven track record with similar digital transformation projects
• Agile development methodology with continuous client collaboration
• Strong focus on scalable, maintainable solutions

Recent achievements include successful delivery of healthcare AI platforms and e-commerce solutions, demonstrating our ability to handle complex, regulated environments.`,
        isEditable: true,
        wordCount: 128
      },
      {
        title: 'Technical Approach',
        content: `Our technical approach leverages modern cloud-native architecture to ensure scalability, security, and maintainability:

**Architecture Overview:**
- Microservices architecture on AWS infrastructure
- React-based frontend for optimal user experience
- Node.js backend services with RESTful APIs
- PostgreSQL database with automated backup and recovery
- Redis caching layer for performance optimization

**Security Implementation:**
- ISO 27001 compliant security framework
- End-to-end encryption for all data transmission
- Multi-factor authentication and role-based access control
- Regular security audits and penetration testing

**Development Process:**
- Agile/Scrum methodology with 2-week sprints
- Continuous integration/deployment (CI/CD) pipeline
- Automated testing with 90%+ code coverage
- Regular stakeholder demos and feedback sessions`,
        isEditable: true,
        wordCount: 145
      },
      {
        title: 'Project Timeline',
        content: `**Phase 1: Discovery & Planning (Weeks 1-4)**
- Stakeholder interviews and requirements gathering
- Technical architecture design and documentation
- User experience research and wireframing
- Project kickoff and team alignment

**Phase 2: Core Development (Weeks 5-20)**
- Backend API development and testing
- Frontend component development
- Database design and implementation
- Security framework integration

**Phase 3: Integration & Testing (Weeks 21-24)**
- System integration testing
- User acceptance testing
- Performance optimization
- Security testing and compliance verification

**Phase 4: Deployment & Launch (Weeks 25-28)**
- Production deployment and configuration
- Staff training and documentation
- Go-live support and monitoring
- Post-launch optimization`,
        isEditable: true,
        wordCount: 132
      },
      {
        title: 'Budget & Pricing',
        content: `**Total Project Investment: $175,000**

**Breakdown by Phase:**
- Phase 1 (Discovery): $25,000
- Phase 2 (Development): $95,000
- Phase 3 (Testing): $30,000
- Phase 4 (Deployment): $25,000

**What's Included:**
✓ Complete platform development and deployment
✓ 6 months of post-launch support and maintenance
✓ Staff training and documentation
✓ Security compliance certification
✓ Performance monitoring and optimization

**Payment Schedule:**
- 30% upon contract signing
- 40% at completion of development phase
- 20% at successful testing completion
- 10% upon final deployment and acceptance

This investment represents exceptional value given the comprehensive scope and long-term benefits of the platform.`,
        isEditable: true,
        wordCount: 118
      }
    ],
    completionScore: 95,
    lastModified: '2024-01-15T10:30:00Z',
    status: 'ready'
  }
];

interface ApplicationTemplatesProps {
  companyData: any;
}

export function ApplicationTemplates({ companyData }: ApplicationTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('TPL001');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<string>('');

  const currentTemplate = mockTemplates.find(t => t.id === selectedTemplate) || mockTemplates[0];

  const handleEditSection = (sectionTitle: string, currentContent: string) => {
    setEditingSection(sectionTitle);
    setSectionContent(currentContent);
  };

  const handleSaveSection = () => {
    // In a real implementation, this would update the template
    setEditingSection(null);
    setSectionContent('');
  };

  const handleRegenerateSection = (sectionTitle: string) => {
    // Simulate AI regeneration
    console.log(`Regenerating section: ${sectionTitle}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-400 bg-green-400/10';
      case 'review':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'draft':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'review':
        return <Eye className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Template Header */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>{currentTemplate.tenderTitle}</span>
            </CardTitle>
            
            <div className="flex items-center space-x-3">
              <Badge className={`${getStatusColor(currentTemplate.status)} flex items-center space-x-1`}>
                {getStatusIcon(currentTemplate.status)}
                <span className="capitalize">{currentTemplate.status}</span>
              </Badge>
              
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {currentTemplate.completionScore}% Complete
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">Auto-generated from your profile</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">
                Last updated: {new Date(currentTemplate.lastModified).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">Tender ID: {currentTemplate.tenderId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate All
          </Button>
          
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate Template
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Send className="w-4 h-4 mr-2" />
            Submit Proposal
          </Button>
        </div>
      </div>

      {/* Template Sections */}
      <div className="space-y-6">
        {currentTemplate.sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                      {section.wordCount} words
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerateSection(section.title)}
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSection(section.title, section.content)}
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {editingSection === section.title ? (
                  <div className="space-y-4">
                    <Textarea
                      value={sectionContent}
                      onChange={(e) => setSectionContent(e.target.value)}
                      className="min-h-[200px] bg-gray-800 border-gray-700 text-white"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        {sectionContent.split(' ').length} words
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSection(null)}
                          className="border-gray-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveSection}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Enhancement Suggestions */}
      <Card className="bg-gray-900/50 border-gray-800 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>AI Enhancement Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Add more specific metrics and KPIs</p>
                <p className="text-gray-400 text-xs">Include quantifiable success metrics to strengthen your value proposition</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Emphasize your AWS partnership more prominently</p>
                <p className="text-gray-400 text-xs">This certification aligns well with the cloud architecture requirements</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Consider adding a risk mitigation section</p>
                <p className="text-gray-400 text-xs">Government projects often require detailed risk management plans</p>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            Apply Suggestions
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}