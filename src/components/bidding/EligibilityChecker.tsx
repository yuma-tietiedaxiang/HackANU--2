import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  Award,
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface EligibilityAnalysis {
  tenderId: string;
  tenderTitle: string;
  overallScore: number;
  status: 'eligible' | 'partial' | 'not-eligible';
  criteria: Array<{
    name: string;
    required: boolean;
    met: boolean;
    score: number;
    details: string;
    recommendation?: string;
  }>;
  recommendations: Array<{
    type: 'improvement' | 'warning' | 'opportunity';
    title: string;
    description: string;
    impact: string;
    timeline: string;
  }>;
  estimatedEffort: string;
  winProbability: number;
}

const mockAnalyses: EligibilityAnalysis[] = [
  {
    tenderId: 'T001',
    tenderTitle: 'Digital Transformation Platform Development',
    overallScore: 92,
    status: 'eligible',
    criteria: [
      {
        name: 'Cloud Architecture Experience',
        required: true,
        met: true,
        score: 95,
        details: 'Strong experience with AWS and cloud solutions mentioned in profile'
      },
      {
        name: 'React/Node.js Expertise',
        required: true,
        met: true,
        score: 90,
        details: 'React and Node.js listed as core capabilities'
      },
      {
        name: 'Security Compliance',
        required: true,
        met: true,
        score: 85,
        details: 'ISO 27001 certification meets security requirements'
      },
      {
        name: 'Government Experience',
        required: false,
        met: false,
        score: 60,
        details: 'No direct government projects in portfolio',
        recommendation: 'Partner with a company that has government experience'
      },
      {
        name: 'Team Size (15+ developers)',
        required: true,
        met: true,
        score: 80,
        details: 'Current team size of 15-25 meets minimum requirements'
      }
    ],
    recommendations: [
      {
        type: 'opportunity',
        title: 'Highlight Cloud Expertise',
        description: 'Emphasize your AWS partnership and cloud migration projects',
        impact: 'High',
        timeline: 'Immediate'
      },
      {
        type: 'improvement',
        title: 'Seek Government Partner',
        description: 'Partner with a company that has government project experience',
        impact: 'Medium',
        timeline: '2-3 weeks'
      }
    ],
    estimatedEffort: '6-8 months',
    winProbability: 75
  },
  {
    tenderId: 'T003',
    tenderTitle: 'Healthcare Data Analytics Platform',
    overallScore: 65,
    status: 'partial',
    criteria: [
      {
        name: 'HIPAA Compliance Knowledge',
        required: true,
        met: false,
        score: 40,
        details: 'No HIPAA compliance certification or experience mentioned',
        recommendation: 'Obtain HIPAA compliance training and certification'
      },
      {
        name: 'Data Analytics Expertise',
        required: true,
        met: true,
        score: 85,
        details: 'Strong data analytics capabilities with Python and ML'
      },
      {
        name: 'Healthcare Industry Experience',
        required: true,
        met: true,
        score: 70,
        details: 'Healthcare AI Platform project shows relevant experience'
      },
      {
        name: 'Large Team Requirement (20+)',
        required: true,
        met: false,
        score: 50,
        details: 'Current team size of 15-25 may not meet minimum requirements',
        recommendation: 'Consider hiring additional developers or partnering'
      }
    ],
    recommendations: [
      {
        type: 'warning',
        title: 'HIPAA Compliance Critical',
        description: 'This is a mandatory requirement that must be addressed',
        impact: 'Critical',
        timeline: '4-6 weeks'
      },
      {
        type: 'improvement',
        title: 'Expand Development Team',
        description: 'Hire 5-10 additional developers or partner with another firm',
        impact: 'High',
        timeline: '2-3 months'
      },
      {
        type: 'opportunity',
        title: 'Leverage Healthcare Project',
        description: 'Emphasize your successful Healthcare AI Platform project',
        impact: 'Medium',
        timeline: 'Immediate'
      }
    ],
    estimatedEffort: '12-18 months',
    winProbability: 45
  }
];

interface EligibilityCheckerProps {
  companyData: any;
}

export function EligibilityChecker({ companyData }: EligibilityCheckerProps) {
  const [selectedTender, setSelectedTender] = useState<string>('T001');
  
  const currentAnalysis = mockAnalyses.find(a => a.tenderId === selectedTender) || mockAnalyses[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible':
        return 'text-green-400 bg-green-400/10';
      case 'partial':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'not-eligible':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'opportunity':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'warning':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'opportunity':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Tender Selection */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Select Tender for Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTender} onValueChange={setSelectedTender}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {mockAnalyses.map(analysis => (
                <SelectItem key={analysis.tenderId} value={analysis.tenderId}>
                  {analysis.tenderTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Overall Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl text-white mb-1">{currentAnalysis.overallScore}%</p>
            <p className="text-gray-400 text-sm">Overall Score</p>
            <Badge className={`mt-2 ${getStatusColor(currentAnalysis.status)}`}>
              {currentAnalysis.status.replace('-', ' ')}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-xl text-white mb-1">{currentAnalysis.estimatedEffort}</p>
            <p className="text-gray-400 text-sm">Estimated Duration</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-xl text-white mb-1">{currentAnalysis.winProbability}%</p>
            <p className="text-gray-400 text-sm">Win Probability</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-xl text-white mb-1">
              {currentAnalysis.criteria.filter(c => c.met).length}/{currentAnalysis.criteria.length}
            </p>
            <p className="text-gray-400 text-sm">Criteria Met</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Criteria Analysis */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Eligibility Criteria Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentAnalysis.criteria.map((criterion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white">{criterion.name}</h4>
                      {criterion.required && (
                        <Badge variant="outline" className="text-xs border-red-400 text-red-400">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{criterion.details}</p>
                    {criterion.recommendation && (
                      <p className="text-yellow-400 text-sm italic">
                        💡 {criterion.recommendation}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-white font-medium">{criterion.score}%</p>
                      <Progress value={criterion.score} className="w-20 h-2" />
                    </div>
                    
                    {criterion.met ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentAnalysis.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`p-4 rounded-lg border ${getRecommendationColor(rec.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getRecommendationIcon(rec.type)}
                    <div>
                      <h4 className="text-white mb-1">{rec.title}</h4>
                      <p className="text-gray-300 text-sm mb-2">{rec.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400">Impact:</span>
                          <Badge variant="outline" className="text-xs border-gray-600">
                            {rec.impact}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400">Timeline:</span>
                          <Badge variant="outline" className="text-xs border-gray-600">
                            {rec.timeline}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Take Action
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
          Generate Improvement Plan
        </Button>
        
        <div className="flex space-x-3">
          {currentAnalysis.status === 'eligible' && (
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
              Generate Proposal
            </Button>
          )}
          
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            Save Analysis
          </Button>
        </div>
      </div>
    </motion.div>
  );
}