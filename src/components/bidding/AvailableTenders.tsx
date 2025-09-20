import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Search, 
  Calendar, 
  DollarSign, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  ExternalLink,
  Clock,
  Building
} from 'lucide-react';

interface Tender {
  id: string;
  title: string;
  client: string;
  description: string;
  value: string;
  deadline: string;
  location: string;
  category: string;
  requirements: string[];
  eligibility: 'eligible' | 'partial' | 'not-eligible';
  matchScore: number;
  publishedDate: string;
  source: string;
}

const mockTenders: Tender[] = [
  {
    id: 'T001',
    title: 'Digital Transformation Platform Development',
    client: 'City Government of TechCity',
    description: 'Development of a comprehensive digital platform to streamline citizen services and improve government efficiency.',
    value: '$150,000 - $200,000',
    deadline: '2024-02-15',
    location: 'TechCity, TC',
    category: 'Technology Services',
    requirements: ['Cloud Architecture', 'React/Node.js', 'Security Compliance', 'Government Experience'],
    eligibility: 'eligible',
    matchScore: 92,
    publishedDate: '2024-01-10',
    source: 'Government Tenders Portal'
  },
  {
    id: 'T002',
    title: 'AI-Powered Customer Service Bot',
    client: 'MegaRetail Corporation',
    description: 'Design and implement an AI chatbot system to handle customer inquiries and support tickets.',
    value: '$75,000 - $100,000',
    deadline: '2024-01-28',
    location: 'Remote',
    category: 'AI Development',
    requirements: ['Natural Language Processing', 'Machine Learning', 'API Integration', 'Scalable Architecture'],
    eligibility: 'eligible',
    matchScore: 88,
    publishedDate: '2024-01-08',
    source: 'Private Sector RFP'
  },
  {
    id: 'T003',
    title: 'Healthcare Data Analytics Platform',
    client: 'Regional Healthcare Network',
    description: 'Build a HIPAA-compliant analytics platform for patient data insights and reporting.',
    value: '$250,000 - $350,000',
    deadline: '2024-03-01',
    location: 'HealthCity, HC',
    category: 'Healthcare Technology',
    requirements: ['HIPAA Compliance', 'Data Analytics', 'Healthcare Experience', 'Large Team (20+)'],
    eligibility: 'partial',
    matchScore: 65,
    publishedDate: '2024-01-12',
    source: 'Healthcare Procurement'
  },
  {
    id: 'T004',
    title: 'Blockchain Supply Chain Solution',
    client: 'Global Logistics Inc.',
    description: 'Develop a blockchain-based supply chain tracking system for international shipments.',
    value: '$180,000 - $220,000',
    deadline: '2024-02-20',
    location: 'Multiple Locations',
    category: 'Blockchain',
    requirements: ['Blockchain Development', 'Supply Chain Knowledge', 'Global Scale Experience'],
    eligibility: 'not-eligible',
    matchScore: 35,
    publishedDate: '2024-01-09',
    source: 'Industry Portal'
  },
  {
    id: 'T005',
    title: 'Mobile App for Educational Platform',
    client: 'EduTech Solutions',
    description: 'Create cross-platform mobile application for online learning with interactive features.',
    value: '$50,000 - $80,000',
    deadline: '2024-02-05',
    location: 'Remote',
    category: 'Mobile Development',
    requirements: ['React Native/Flutter', 'Educational Technology', 'User Experience Design'],
    eligibility: 'eligible',
    matchScore: 85,
    publishedDate: '2024-01-11',
    source: 'Education Sector'
  }
];

interface AvailableTendersProps {
  companyData: any;
}

export function AvailableTenders({ companyData }: AvailableTendersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [eligibilityFilter, setEligibilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match-score');

  const filteredTenders = mockTenders
    .filter(tender => {
      const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tender.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tender.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || tender.category === categoryFilter;
      const matchesEligibility = eligibilityFilter === 'all' || tender.eligibility === eligibilityFilter;
      
      return matchesSearch && matchesCategory && matchesEligibility;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'match-score':
          return b.matchScore - a.matchScore;
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'value':
          const aValue = parseInt(a.value.replace(/[^0-9]/g, ''));
          const bValue = parseInt(b.value.replace(/[^0-9]/g, ''));
          return bValue - aValue;
        default:
          return 0;
      }
    });

  const getEligibilityColor = (eligibility: string) => {
    switch (eligibility) {
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

  const getEligibilityIcon = (eligibility: string) => {
    switch (eligibility) {
      case 'eligible':
        return <CheckCircle className="w-4 h-4" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4" />;
      case 'not-eligible':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const categories = [...new Set(mockTenders.map(t => t.category))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Filters and Search */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter Tenders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={eligibilityFilter} onValueChange={setEligibilityFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Eligibility" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="eligible">Eligible</SelectItem>
                <SelectItem value="partial">Partially Eligible</SelectItem>
                <SelectItem value="not-eligible">Not Eligible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-gray-400 text-sm">
              Showing {filteredTenders.length} of {mockTenders.length} tenders
            </p>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="match-score">Sort by Match Score</SelectItem>
                <SelectItem value="deadline">Sort by Deadline</SelectItem>
                <SelectItem value="value">Sort by Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tender List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTenders.map((tender, index) => (
          <motion.div
            key={tender.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl text-white pr-4">{tender.title}</h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge className={`${getEligibilityColor(tender.eligibility)} flex items-center space-x-1`}>
                          {getEligibilityIcon(tender.eligibility)}
                          <span className="capitalize">{tender.eligibility.replace('-', ' ')}</span>
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                          {tender.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>{tender.client}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{tender.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{tender.value}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(tender.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{tender.description}</p>

                <div className="mb-4">
                  <h4 className="text-white text-sm mb-2">Key Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tender.requirements.map((req, reqIndex) => (
                      <Badge key={reqIndex} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Published: {new Date(tender.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <span>•</span>
                    <span>Source: {tender.source}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    {tender.eligibility === 'eligible' && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        Apply Now
                      </Button>
                    )}
                    
                    {tender.eligibility === 'partial' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      >
                        Check Eligibility
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTenders.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white mb-2">No tenders found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}