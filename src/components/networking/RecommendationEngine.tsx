import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Bot, 
  Sparkles, 
  Target, 
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';

interface Recommendation {
  id: string;
  eventId: string;
  eventTitle: string;
  type: 'high-priority' | 'strategic' | 'growth' | 'networking';
  score: number;
  reasoning: string[];
  benefits: string[];
  potentialConnections: string[];
  recommendedAction: string;
  urgency: 'high' | 'medium' | 'low';
  investmentLevel: 'low' | 'medium' | 'high';
  expectedROI: string;
  timeCommitment: string;
  event: {
    date: string;
    location: string;
    price: string;
    attendees: number;
    registrationDeadline: string;
  };
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    eventId: 'disrupt-2024',
    eventTitle: 'TechCrunch Disrupt 2024',
    type: 'high-priority',
    score: 95,
    reasoning: [
      'Perfect match for your AI-powered business solutions',
      'High concentration of Series A/B investors (47% of attendees)',
      'Previous TechStart attendees secured $2.3M average funding',
      'Strong alignment with your target market and industry'
    ],
    benefits: [
      'Direct access to 200+ active VCs',
      'Pitch competition with $100K prize',
      'Media exposure to 500K+ tech professionals',
      'Networking with 5000+ startup founders'
    ],
    potentialConnections: [
      'Sequoia Capital Partners',
      'Andreessen Horowitz Team',
      'Google Ventures Associates',
      '150+ SaaS founders in similar stage'
    ],
    recommendedAction: 'Apply for Battlefield pitch competition + attend networking sessions',
    urgency: 'high',
    investmentLevel: 'high',
    expectedROI: '300-500% based on similar startups',
    timeCommitment: '3 days + 2 weeks prep',
    event: {
      date: '2024-03-15',
      location: 'San Francisco, CA',
      price: '$2,995',
      attendees: 5000,
      registrationDeadline: '2024-02-28'
    }
  },
  {
    id: '2',
    eventId: 'yc-startup-school',
    eventTitle: 'Y Combinator Startup School',
    type: 'strategic',
    score: 92,
    reasoning: [
      'YC alumni network provides long-term value (90% report ongoing benefits)',
      'Curriculum specifically addresses your current growth challenges',
      'Free program with high-quality mentorship access',
      'Strong track record for companies in your industry and stage'
    ],
    benefits: [
      'Access to YC partner office hours',
      'Connection to 50,000+ founder alumni network',
      'Structured curriculum for scaling startups',
      'Potential pathway to YC accelerator program'
    ],
    potentialConnections: [
      'YC Partners and Alumni',
      '500+ AI/SaaS founders in cohort',
      'Weekly mentor sessions',
      'Industry-specific working groups'
    ],
    recommendedAction: 'Enroll immediately and commit to full 10-week program',
    urgency: 'high',
    investmentLevel: 'low',
    expectedROI: '200-400% in network value alone',
    timeCommitment: '10 weeks, 5 hours/week',
    event: {
      date: '2024-02-01',
      location: 'Online',
      price: 'Free',
      attendees: 10000,
      registrationDeadline: '2024-01-25'
    }
  },
  {
    id: '3',
    eventId: 'ai-summit-austin',
    eventTitle: 'AI Innovation Summit',
    type: 'growth',
    score: 88,
    reasoning: [
      'Technical content aligns with your AI development roadmap',
      'Austin emerging as major AI hub with growing investor presence',
      'Moderate investment with focused networking opportunities',
      'Opportunity to establish thought leadership in AI space'
    ],
    benefits: [
      'Latest AI technology insights',
      'Partnership opportunities with AI companies',
      'Speaking opportunity for company visibility',
      'Access to AI-focused investor group'
    ],
    potentialConnections: [
      'AI-focused VCs and angels',
      'Technical co-founders for partnerships',
      'Enterprise clients in AI adoption',
      'Research institutions and labs'
    ],
    recommendedAction: 'Attend + apply for speaking slot on AI applications',
    urgency: 'medium',
    investmentLevel: 'medium',
    expectedROI: '150-250% through partnerships',
    timeCommitment: '2 days + travel',
    event: {
      date: '2024-02-20',
      location: 'Austin, TX',
      price: '$899',
      attendees: 1500,
      registrationDeadline: '2024-02-15'
    }
  },
  {
    id: '4',
    eventId: 'saas-growth-workshop',
    eventTitle: 'SaaS Growth Strategies Workshop',
    type: 'growth',
    score: 82,
    reasoning: [
      'Addresses your current revenue scaling challenges',
      'Proven methodologies from successful SaaS companies',
      'Low time investment with high practical value',
      'Opportunity to implement strategies immediately'
    ],
    benefits: [
      'Actionable growth playbook',
      'Access to growth hacking tools',
      'Small group mentoring session',
      'Follow-up implementation support'
    ],
    potentialConnections: [
      'Growth experts and consultants',
      'SaaS founders in scaling phase',
      'Marketing and sales specialists',
      'Tool and platform partners'
    ],
    recommendedAction: 'Register and prepare specific growth challenges to discuss',
    urgency: 'medium',
    investmentLevel: 'low',
    expectedROI: '100-200% through improved metrics',
    timeCommitment: '4 hours online',
    event: {
      date: '2024-02-10',
      location: 'Online',
      price: '$149',
      attendees: 200,
      registrationDeadline: '2024-02-08'
    }
  }
];

export function RecommendationEngine() {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'high-priority':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'strategic':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'growth':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'networking':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getInvestmentColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>AI-Powered Event Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-300 mb-2">
                Our AI has analyzed your company profile, growth stage, and industry trends to recommend 
                the most valuable networking opportunities for your startup.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>• Based on 10,000+ successful startup outcomes</span>
                <span>• Updated every 24 hours</span>
                <span>• Personalized to your specific needs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Recommendations */}
      <div className="space-y-4">
        {mockRecommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className={`bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 ${
              selectedRecommendation === rec.id ? 'ring-2 ring-purple-500/50' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={`${getTypeColor(rec.type)} border flex items-center space-x-1`}>
                        <Target className="w-3 h-3" />
                        <span className="capitalize">{rec.type.replace('-', ' ')}</span>
                      </Badge>
                      
                      <div className="flex items-center space-x-1">
                        {getUrgencyIcon(rec.urgency)}
                        <span className="text-gray-400 text-sm capitalize">{rec.urgency} urgency</span>
                      </div>
                      
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        <Star className="w-3 h-3 mr-1" />
                        {rec.score}% match
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl text-white mb-2">{rec.eventTitle}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(rec.event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{rec.event.location}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <DollarSign className="w-4 h-4" />
                          <span>{rec.event.price}</span>
                          <span className={`ml-2 ${getInvestmentColor(rec.investmentLevel)}`}>
                            ({rec.investmentLevel} investment)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{rec.event.attendees.toLocaleString()} attendees</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    <div className="mb-4">
                      <h4 className="text-white text-sm mb-2 flex items-center space-x-1">
                        <Lightbulb className="w-4 h-4" />
                        <span>Why we recommend this:</span>
                      </h4>
                      <ul className="space-y-1">
                        {rec.reasoning.slice(0, 2).map((reason, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start space-x-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expected Outcomes */}
                    <div className="mb-4">
                      <h4 className="text-white text-sm mb-2">Expected outcomes:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">ROI: {rec.expectedROI}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">{rec.timeCommitment}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-sm">Recommendation Confidence</span>
                        <span className="text-white text-sm">{rec.score}%</span>
                      </div>
                      <Progress value={rec.score} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm mb-1">Recommended Action:</p>
                      <p className="text-gray-300 text-sm">{rec.recommendedAction}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant={selectedRecommendation === rec.id ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRecommendation(
                          selectedRecommendation === rec.id ? null : rec.id
                        )}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        {selectedRecommendation === rec.id ? 'Hide Details' : 'View Details'}
                      </Button>
                      
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                      >
                        Take Action
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                {selectedRecommendation === rec.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700 pt-6 mt-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white mb-3">Key Benefits</h4>
                        <ul className="space-y-2">
                          {rec.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-gray-300 text-sm flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white mb-3">Potential Connections</h4>
                        <ul className="space-y-2">
                          {rec.potentialConnections.map((connection, idx) => (
                            <li key={idx} className="text-gray-300 text-sm flex items-start space-x-2">
                              <Users className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              <span>{connection}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">Registration Deadline</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Register by {new Date(rec.event.registrationDeadline).toLocaleDateString()} to secure your spot.
                        {rec.urgency === 'high' && ' This is a high-priority opportunity with limited availability.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recommendation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-xl text-white">{mockRecommendations.filter(r => r.urgency === 'high').length}</p>
              <p className="text-gray-400 text-sm">High Priority</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-xl text-white">
                {Math.round(mockRecommendations.reduce((sum, r) => sum + r.score, 0) / mockRecommendations.length)}%
              </p>
              <p className="text-gray-400 text-sm">Avg Match Score</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-xl text-white">{mockRecommendations.filter(r => r.investmentLevel === 'low').length}</p>
              <p className="text-gray-400 text-sm">Low Investment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}