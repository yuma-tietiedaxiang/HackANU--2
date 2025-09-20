import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  User,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  TrendingUp
} from 'lucide-react';

interface Proposal {
  id: string;
  tenderId: string;
  tenderTitle: string;
  client: string;
  status: 'draft' | 'submitted' | 'under-review' | 'shortlisted' | 'won' | 'lost';
  submittedDate?: string;
  deadline: string;
  proposedValue: string;
  completionScore: number;
  lastActivity: string;
  nextMilestone?: string;
  notes?: string;
  winProbability?: number;
}

const mockProposals: Proposal[] = [
  {
    id: 'P001',
    tenderId: 'T001',
    tenderTitle: 'Digital Transformation Platform Development',
    client: 'City Government of TechCity',
    status: 'shortlisted',
    submittedDate: '2024-01-16',
    deadline: '2024-02-15',
    proposedValue: '$175,000',
    completionScore: 100,
    lastActivity: '2024-01-18T14:30:00Z',
    nextMilestone: 'Presentation scheduled for Jan 25',
    winProbability: 75,
    notes: 'Client requested additional security documentation. Follow-up meeting scheduled.'
  },
  {
    id: 'P002',
    tenderId: 'T002',
    tenderTitle: 'AI-Powered Customer Service Bot',
    client: 'MegaRetail Corporation',
    status: 'submitted',
    submittedDate: '2024-01-14',
    deadline: '2024-01-28',
    proposedValue: '$85,000',
    completionScore: 100,
    lastActivity: '2024-01-14T09:15:00Z',
    nextMilestone: 'Awaiting client response',
    winProbability: 60,
    notes: 'Proposal submitted on time. Competitive landscape with 5 other bidders.'
  },
  {
    id: 'P003',
    tenderId: 'T005',
    tenderTitle: 'Mobile App for Educational Platform',
    client: 'EduTech Solutions',
    status: 'draft',
    deadline: '2024-02-05',
    proposedValue: '$65,000',
    completionScore: 75,
    lastActivity: '2024-01-17T16:45:00Z',
    nextMilestone: 'Complete technical specifications section',
    notes: 'Need to finalize pricing model and timeline details.'
  },
  {
    id: 'P004',
    tenderId: 'T006',
    tenderTitle: 'E-commerce Platform Upgrade',
    client: 'Fashion Forward Ltd',
    status: 'won',
    submittedDate: '2023-12-10',
    deadline: '2024-01-15',
    proposedValue: '$120,000',
    completionScore: 100,
    lastActivity: '2024-01-15T11:00:00Z',
    nextMilestone: 'Project kickoff meeting Jan 22',
    winProbability: 100,
    notes: 'Contract signed! Project to begin next week.'
  },
  {
    id: 'P005',
    tenderId: 'T007',
    tenderTitle: 'Data Migration Service',
    client: 'Legacy Systems Inc',
    status: 'lost',
    submittedDate: '2023-12-20',
    deadline: '2024-01-10',
    proposedValue: '$45,000',
    completionScore: 100,
    lastActivity: '2024-01-12T08:30:00Z',
    notes: 'Lost to competitor with lower bid. Feedback: Price too high for scope.'
  }
];

export function ActiveProposals() {
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'text-green-400 bg-green-400/10';
      case 'shortlisted':
        return 'text-blue-400 bg-blue-400/10';
      case 'submitted':
        return 'text-purple-400 bg-purple-400/10';
      case 'under-review':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'draft':
        return 'text-gray-400 bg-gray-400/10';
      case 'lost':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-4 h-4" />;
      case 'shortlisted':
        return <TrendingUp className="w-4 h-4" />;
      case 'submitted':
        return <Send className="w-4 h-4" />;
      case 'under-review':
        return <Eye className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      case 'lost':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filterProposals = (status: string) => {
    if (status === 'all') return mockProposals;
    if (status === 'active') return mockProposals.filter(p => ['submitted', 'under-review', 'shortlisted'].includes(p.status));
    return mockProposals.filter(p => p.status === status);
  };

  const getTabCounts = () => {
    return {
      all: mockProposals.length,
      active: mockProposals.filter(p => ['submitted', 'under-review', 'shortlisted'].includes(p.status)).length,
      draft: mockProposals.filter(p => p.status === 'draft').length,
      won: mockProposals.filter(p => p.status === 'won').length,
      lost: mockProposals.filter(p => p.status === 'lost').length
    };
  };

  const counts = getTabCounts();
  const filteredProposals = filterProposals(activeTab);

  // Summary stats
  const totalValue = mockProposals
    .filter(p => p.status === 'won')
    .reduce((sum, p) => sum + parseInt(p.proposedValue.replace(/[^0-9]/g, '')), 0);

  const avgWinRate = mockProposals.filter(p => ['won', 'lost'].includes(p.status)).length > 0 
    ? (mockProposals.filter(p => p.status === 'won').length / mockProposals.filter(p => ['won', 'lost'].includes(p.status)).length * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <Send className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-2xl text-white">{counts.all}</p>
            <p className="text-gray-400 text-sm">Total Proposals</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-2xl text-white">{counts.active}</p>
            <p className="text-gray-400 text-sm">Active</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-2xl text-white">${totalValue.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Won Value</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-2xl text-white">{avgWinRate.toFixed(0)}%</p>
            <p className="text-gray-400 text-sm">Win Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Proposals Tabs */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Proposal Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                All ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-purple-600">
                Active ({counts.active})
              </TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:bg-purple-600">
                Drafts ({counts.draft})
              </TabsTrigger>
              <TabsTrigger value="won" className="data-[state=active]:bg-purple-600">
                Won ({counts.won})
              </TabsTrigger>
              <TabsTrigger value="lost" className="data-[state=active]:bg-purple-600">
                Lost ({counts.lost})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredProposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl text-white pr-4">{proposal.tenderTitle}</h3>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <Badge className={`${getStatusColor(proposal.status)} flex items-center space-x-1`}>
                                  {getStatusIcon(proposal.status)}
                                  <span className="capitalize">{proposal.status.replace('-', ' ')}</span>
                                </Badge>
                                {proposal.winProbability && (
                                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                    {proposal.winProbability}% win chance
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{proposal.client}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{proposal.proposedValue}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(proposal.deadline).toLocaleDateString()}</span>
                              </div>
                              {proposal.submittedDate && (
                                <div className="flex items-center space-x-1">
                                  <Send className="w-4 h-4" />
                                  <span>Submitted: {new Date(proposal.submittedDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar for Drafts */}
                        {proposal.status === 'draft' && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-400 text-sm">Completion Progress</span>
                              <span className="text-white text-sm">{proposal.completionScore}%</span>
                            </div>
                            <Progress value={proposal.completionScore} className="h-2" />
                          </div>
                        )}

                        {/* Next Milestone */}
                        {proposal.nextMilestone && (
                          <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 text-sm font-medium">Next Milestone:</span>
                            </div>
                            <p className="text-gray-300 text-sm mt-1">{proposal.nextMilestone}</p>
                          </div>
                        )}

                        {/* Notes */}
                        {proposal.notes && (
                          <div className="mb-4">
                            <p className="text-gray-300 text-sm italic">"{proposal.notes}"</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            Last activity: {new Date(proposal.lastActivity).toLocaleDateString()}
                          </div>

                          <div className="flex items-center space-x-2">
                            {proposal.status === 'draft' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                                >
                                  <Send className="w-4 h-4 mr-1" />
                                  Submit
                                </Button>
                              </>
                            )}
                            
                            {['submitted', 'under-review', 'shortlisted'].includes(proposal.status) && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Status
                              </Button>
                            )}

                            {proposal.status === 'won' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                View Contract
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredProposals.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-white mb-2">No proposals found</h3>
                  <p className="text-gray-400">No proposals match the selected filter</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}