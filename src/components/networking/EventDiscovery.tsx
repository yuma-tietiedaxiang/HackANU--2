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
  MapPin, 
  Users, 
  DollarSign,
  ExternalLink,
  Star,
  TrendingUp,
  Award,
  Zap,
  Building,
  Clock,
  Target,
  BookmarkPlus,
  CheckCircle
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'conference' | 'accelerator' | 'competition' | 'networking' | 'webinar' | 'workshop';
  organizer: string;
  date: string;
  endDate?: string;
  location: string;
  isVirtual: boolean;
  price: string;
  description: string;
  attendees: number;
  relevanceScore: number;
  tags: string[];
  benefits: string[];
  registrationDeadline: string;
  website: string;
  featured: boolean;
  applicationRequired: boolean;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'TechCrunch Disrupt 2024',
    type: 'conference',
    organizer: 'TechCrunch',
    date: '2024-03-15',
    endDate: '2024-03-17',
    location: 'San Francisco, CA',
    isVirtual: false,
    price: '$2,995',
    description: 'The ultimate startup event featuring pitch competitions, networking, and insights from industry leaders.',
    attendees: 5000,
    relevanceScore: 95,
    tags: ['Startups', 'Pitch Competition', 'Investors', 'Technology'],
    benefits: ['Pitch to investors', 'Network with 5000+ attendees', 'Media exposure'],
    registrationDeadline: '2024-02-28',
    website: 'https://techcrunch.com/events/disrupt-2024',
    featured: true,
    applicationRequired: true
  },
  {
    id: '2',
    title: 'Y Combinator Startup School',
    type: 'accelerator',
    organizer: 'Y Combinator',
    date: '2024-02-01',
    endDate: '2024-05-01',
    location: 'Online',
    isVirtual: true,
    price: 'Free',
    description: '10-week online course for founders featuring weekly group office hours and access to YC alumni network.',
    attendees: 10000,
    relevanceScore: 92,
    tags: ['Accelerator', 'Education', 'Mentorship', 'Online'],
    benefits: ['Access to YC network', 'Weekly mentorship', 'Startup toolkit'],
    registrationDeadline: '2024-01-25',
    website: 'https://www.startupschool.org',
    featured: true,
    applicationRequired: true
  },
  {
    id: '3',
    title: 'AI Innovation Summit',
    type: 'conference',
    organizer: 'AI Society',
    date: '2024-02-20',
    location: 'Austin, TX',
    isVirtual: false,
    price: '$899',
    description: 'Explore the latest in AI technology and its applications across industries.',
    attendees: 1500,
    relevanceScore: 88,
    tags: ['AI', 'Technology', 'Innovation', 'Networking'],
    benefits: ['AI insights', 'Tech networking', 'Industry partnerships'],
    registrationDeadline: '2024-02-15',
    website: 'https://aiinnovationsummit.com',
    featured: false,
    applicationRequired: false
  },
  {
    id: '4',
    title: 'Global Startup Awards 2024',
    type: 'competition',
    organizer: 'Startup Awards Foundation',
    date: '2024-04-10',
    location: 'London, UK',
    isVirtual: false,
    price: '$299',
    description: 'International startup competition with categories for different industries and stages.',
    attendees: 800,
    relevanceScore: 85,
    tags: ['Competition', 'Awards', 'International', 'Recognition'],
    benefits: ['Global recognition', 'Prize money', 'Media coverage'],
    registrationDeadline: '2024-03-15',
    website: 'https://globalstartupawards.com',
    featured: false,
    applicationRequired: true
  },
  {
    id: '5',
    title: 'SaaS Growth Strategies Workshop',
    type: 'workshop',
    organizer: 'Growth Academy',
    date: '2024-02-10',
    location: 'Online',
    isVirtual: true,
    price: '$149',
    description: 'Intensive 4-hour workshop on scaling SaaS businesses with proven growth strategies.',
    attendees: 200,
    relevanceScore: 82,
    tags: ['SaaS', 'Growth', 'Workshop', 'Strategy'],
    benefits: ['Growth playbook', 'Expert guidance', 'Networking'],
    registrationDeadline: '2024-02-08',
    website: 'https://growthacademy.com/saas-workshop',
    featured: false,
    applicationRequired: false
  },
  {
    id: '6',
    title: 'Women in Tech Leadership Summit',
    type: 'networking',
    organizer: 'WomenTech Global',
    date: '2024-03-08',
    location: 'New York, NY',
    isVirtual: false,
    price: '$399',
    description: 'Empowering women leaders in technology with keynotes, panels, and networking opportunities.',
    attendees: 1200,
    relevanceScore: 78,
    tags: ['Women in Tech', 'Leadership', 'Diversity', 'Networking'],
    benefits: ['Leadership insights', 'Mentorship opportunities', 'Community building'],
    registrationDeadline: '2024-02-25',
    website: 'https://womentech.net/summit',
    featured: false,
    applicationRequired: false
  }
];

export function EventDiscovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const filteredEvents = mockEvents
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      const matchesLocation = locationFilter === 'all' || 
                             (locationFilter === 'virtual' && event.isVirtual) ||
                             (locationFilter === 'physical' && !event.isVirtual);
      const matchesPrice = priceFilter === 'all' ||
                          (priceFilter === 'free' && event.price === 'Free') ||
                          (priceFilter === 'paid' && event.price !== 'Free');
      
      return matchesSearch && matchesType && matchesLocation && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'attendees':
          return b.attendees - a.attendees;
        default:
          return 0;
      }
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conference':
        return <Users className="w-4 h-4" />;
      case 'accelerator':
        return <TrendingUp className="w-4 h-4" />;
      case 'competition':
        return <Award className="w-4 h-4" />;
      case 'networking':
        return <Target className="w-4 h-4" />;
      case 'webinar':
        return <Zap className="w-4 h-4" />;
      case 'workshop':
        return <Building className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conference':
        return 'bg-blue-500/20 text-blue-400';
      case 'accelerator':
        return 'bg-purple-500/20 text-purple-400';
      case 'competition':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'networking':
        return 'bg-green-500/20 text-green-400';
      case 'webinar':
        return 'bg-red-500/20 text-red-400';
      case 'workshop':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Search and Filters */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Discover Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events, topics, or organizers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="conference">Conferences</SelectItem>
                <SelectItem value="accelerator">Accelerators</SelectItem>
                <SelectItem value="competition">Competitions</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="webinar">Webinars</SelectItem>
                <SelectItem value="workshop">Workshops</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="virtual">Virtual Only</SelectItem>
                <SelectItem value="physical">In-Person Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="relevance">Sort by Relevance</SelectItem>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="attendees">Sort by Attendees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {filteredEvents.length} of {mockEvents.length} events
            </p>
            
            <div className="flex items-center space-x-2">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free Events</SelectItem>
                  <SelectItem value="paid">Paid Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Events */}
      {filteredEvents.some(e => e.featured) && (
        <div className="space-y-4">
          <h2 className="text-white text-xl flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Featured Opportunities</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.filter(e => e.featured).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-yellow-500/30 hover:border-yellow-500/50 transition-colors duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`${getTypeColor(event.type)} flex items-center space-x-1`}>
                            {getTypeIcon(event.type)}
                            <span className="capitalize">{event.type}</span>
                          </Badge>
                          <Badge className="bg-yellow-500/20 text-yellow-400">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            {event.relevanceScore}% match
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl text-white mb-2">{event.title}</h3>
                        <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{event.organizer}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.isVirtual ? 'Virtual' : event.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{event.price}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-white text-sm mb-2">Key Benefits:</h4>
                          <div className="flex flex-wrap gap-1">
                            {event.benefits.slice(0, 3).map((benefit, idx) => (
                              <Badge key={idx} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{event.attendees.toLocaleString()} attendees</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <BookmarkPlus className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          {event.applicationRequired ? 'Apply Now' : 'Register'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Events */}
      <div className="space-y-4">
        <h2 className="text-white text-xl">All Events</h2>
        
        <div className="space-y-4">
          {filteredEvents.filter(e => !e.featured).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`${getTypeColor(event.type)} flex items-center space-x-1`}>
                          {getTypeIcon(event.type)}
                          <span className="capitalize">{event.type}</span>
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                          {event.relevanceScore}% match
                        </Badge>
                        {event.applicationRequired && (
                          <Badge variant="outline" className="border-orange-400 text-orange-400 text-xs">
                            Application Required
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg text-white mb-1">{event.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{event.organizer}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.isVirtual ? 'Virtual' : event.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{event.price}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <BookmarkPlus className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      >
                        {event.applicationRequired ? 'Apply' : 'Register'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white mb-2">No events found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}