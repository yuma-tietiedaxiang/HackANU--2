import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  FileText, 
  CheckCircle, 
  Star,
  Clock,
  Building,
  Award,
  Target,
  DollarSign,
  Users,
  Zap,
  Globe
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'grant' | 'procurement' | 'accelerator';
  source: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  suitability: number;
  requirements: string[];
  outcomes: string[];
  featured: boolean;
  governmentApproved: boolean;
}

const templates: Template[] = [
  {
    id: 'aea-innovate',
    name: "Australia's Economic Accelerator - Innovate Project Plan",
    description: "Official template for R&D funding applications under Australia's Economic Accelerator program. Designed for high-impact innovation projects.",
    category: 'grant',
    source: 'Department of Education, Australia',
    complexity: 'advanced',
    estimatedTime: '2-3 hours',
    suitability: 95,
    requirements: [
      'Technology Readiness Level 5-7',
      'Clear commercial pathway',
      'Detailed budget allocation',
      'Risk management plan',
      'IP protection strategy'
    ],
    outcomes: [
      'Government funding eligibility',
      'Structured project milestones',
      'Comprehensive risk assessment',
      'Professional documentation'
    ],
    featured: true,
    governmentApproved: true
  },
  {
    id: 'gov-procurement',
    name: 'Government Procurement & Vendor Onboarding',
    description: 'Standardized template for government procurement processes and vendor registration. Ensures compliance with public sector requirements.',
    category: 'procurement',
    source: 'Digital Transformation Agency, Australia',
    complexity: 'intermediate',
    estimatedTime: '1-2 hours',
    suitability: 88,
    requirements: [
      'Company registration details',
      'Compliance certifications',
      'Financial statements',
      'Security clearances',
      'Previous project experience'
    ],
    outcomes: [
      'Government contract eligibility',
      'Vendor database registration',
      'Compliance verification',
      'Procurement readiness'
    ],
    featured: true,
    governmentApproved: true
  },
  {
    id: 'accelerator-generic',
    name: 'Accelerator Program Application',
    description: 'Generic template suitable for most accelerator and incubation program applications. Covers business model, traction, and growth plans.',
    category: 'accelerator',
    source: 'Industry Standard',
    complexity: 'beginner',
    estimatedTime: '1 hour',
    suitability: 75,
    requirements: [
      'Business model canvas',
      'Market analysis',
      'Financial projections',
      'Team information',
      'Growth strategy'
    ],
    outcomes: [
      'Accelerator program eligibility',
      'Investor pitch preparation',
      'Business plan structure',
      'Market validation'
    ],
    featured: false,
    governmentApproved: false
  }
];

interface TemplateSelectorProps {
  companyData: any;
  onTemplateSelected: (templateId: string) => void;
}

export function TemplateSelector({ companyData, onTemplateSelected }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'grant' | 'procurement' | 'accelerator'>('all');

  const filteredTemplates = templates.filter(template => 
    filter === 'all' || template.category === filter
  );

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grant':
        return <DollarSign className="w-4 h-4" />;
      case 'procurement':
        return <Building className="w-4 h-4" />;
      case 'accelerator':
        return <Target className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grant':
        return 'bg-blue-500/20 text-blue-400';
      case 'procurement':
        return 'bg-purple-500/20 text-purple-400';
      case 'accelerator':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl text-white">Choose Your Template</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Select from government-approved templates or industry standards. 
          Each template has been optimized for compliance and success rates.
        </p>
      </div>

      {/* Filter Buttons */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-4">
            {[
              { id: 'all', label: 'All Templates', count: templates.length },
              { id: 'grant', label: 'Grant Applications', count: templates.filter(t => t.category === 'grant').length },
              { id: 'procurement', label: 'Government Procurement', count: templates.filter(t => t.category === 'procurement').length },
              { id: 'accelerator', label: 'Accelerator Programs', count: templates.filter(t => t.category === 'accelerator').length }
            ].map((filterOption) => (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? 'default' : 'outline'}
                onClick={() => setFilter(filterOption.id as any)}
                className={filter === filterOption.id 
                  ? 'bg-purple-600 text-white' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }
              >
                {filterOption.label} ({filterOption.count})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className={`bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer h-full ${
              selectedTemplate === template.id ? 'ring-2 ring-purple-500/50 border-purple-500' : ''
            } ${template.featured ? 'border-l-4 border-l-yellow-500' : ''}`}
            onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`${getCategoryColor(template.category)} flex items-center space-x-1`}>
                        {getCategoryIcon(template.category)}
                        <span className="capitalize">{template.category}</span>
                      </Badge>
                      
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                      
                      {template.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      
                      {template.governmentApproved && (
                        <Badge className="bg-green-500/20 text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Official
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-white text-lg mb-2">
                      {template.name}
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {template.suitability}% match
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{template.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Globe className="w-4 h-4" />
                    <span>{template.source}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{template.estimatedTime}</span>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-white text-sm mb-2">Key Requirements:</h4>
                  <div className="space-y-1">
                    {template.requirements.slice(0, 3).map((req, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-gray-400">
                        <div className="w-1 h-1 bg-purple-400 rounded-full" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div>
                  <h4 className="text-white text-sm mb-2">Expected Outcomes:</h4>
                  <div className="space-y-1">
                    {template.outcomes.slice(0, 2).map((outcome, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-gray-400">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selection Button */}
                <div className="pt-4 border-t border-gray-700">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template.id);
                    }}
                    className={`w-full ${
                      selectedTemplate === template.id
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    } text-white`}
                  >
                    {selectedTemplate === template.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      'Select Template'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center pt-6"
        >
          <Button
            size="lg"
            onClick={() => onTemplateSelected(selectedTemplate)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Generate Project Plan
          </Button>
        </motion.div>
      )}

      {/* Help Text */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white text-sm mb-1">Need Help Choosing?</h4>
              <p className="text-gray-400 text-sm">
                Our AI has analyzed your company profile "{companyData?.name}" and recommends templates with high suitability scores. 
                Government-approved templates have the highest success rates for official applications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}