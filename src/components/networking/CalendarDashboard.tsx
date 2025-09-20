import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Bell,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Filter,
  Download,
  Share,
  Settings,
  Video,
  Plane,
  Building
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'conference' | 'webinar' | 'networking' | 'deadline' | 'meeting';
  date: string;
  time: string;
  endTime?: string;
  location: string;
  isVirtual: boolean;
  status: 'registered' | 'confirmed' | 'attended' | 'missed' | 'upcoming';
  description: string;
  organizer: string;
  attendees?: number;
  registrationId?: string;
  meetingLink?: string;
  reminderSet: boolean;
  priority: 'high' | 'medium' | 'low';
  preparation?: string[];
  contacts?: string[];
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'TechCrunch Disrupt 2024',
    type: 'conference',
    date: '2024-03-15',
    time: '09:00',
    endTime: '18:00',
    location: 'San Francisco, CA',
    isVirtual: false,
    status: 'confirmed',
    description: 'Startup conference with pitch competitions and networking opportunities',
    organizer: 'TechCrunch',
    attendees: 5000,
    registrationId: 'TC2024-789',
    reminderSet: true,
    priority: 'high',
    preparation: ['Prepare elevator pitch', 'Print business cards', 'Research attendee list'],
    contacts: ['Sarah Chen - Sequoia Capital', 'Mike Rodriguez - Andreessen Horowitz']
  },
  {
    id: '2',
    title: 'YC Startup School - Week 1',
    type: 'webinar',
    date: '2024-02-05',
    time: '18:00',
    endTime: '19:30',
    location: 'Online',
    isVirtual: true,
    status: 'upcoming',
    description: 'Introduction to startup fundamentals and goal setting',
    organizer: 'Y Combinator',
    meetingLink: 'https://yc.zoom.us/j/123456789',
    reminderSet: true,
    priority: 'high',
    preparation: ['Complete pre-work assignment', 'Prepare company metrics']
  },
  {
    id: '3',
    title: 'AI Innovation Summit',
    type: 'conference',
    date: '2024-02-20',
    time: '08:30',
    endTime: '17:00',
    location: 'Austin, TX',
    isVirtual: false,
    status: 'registered',
    description: 'Latest trends in AI technology and business applications',
    organizer: 'AI Society',
    attendees: 1500,
    registrationId: 'AIS2024-456',
    reminderSet: false,
    priority: 'medium',
    preparation: ['Book hotel', 'Prepare demo', 'Research speakers']
  },
  {
    id: '4',
    title: 'Series A Application Deadline',
    type: 'deadline',
    date: '2024-01-30',
    time: '23:59',
    location: 'Online Submission',
    isVirtual: true,
    status: 'upcoming',
    description: 'Final deadline for Series A funding application to Sequoia Capital',
    organizer: 'Sequoia Capital',
    reminderSet: true,
    priority: 'high',
    preparation: ['Finalize pitch deck', 'Update financial projections', 'Get legal review']
  },
  {
    id: '5',
    title: 'Monthly Founders Meetup',
    type: 'networking',
    date: '2024-02-08',
    time: '18:30',
    endTime: '21:00',
    location: 'TechHub Downtown',
    isVirtual: false,
    status: 'confirmed',
    description: 'Monthly networking event for startup founders and entrepreneurs',
    organizer: 'Founders Network',
    attendees: 80,
    reminderSet: true,
    priority: 'medium',
    contacts: ['James Park - FitBit Founder', 'Lisa Chen - Local VC']
  },
  {
    id: '6',
    title: 'Investor Coffee Chat',
    type: 'meeting',
    date: '2024-01-25',
    time: '10:00',
    endTime: '11:00',
    location: 'Blue Bottle Coffee, SOMA',
    isVirtual: false,
    status: 'attended',
    description: 'Informal chat with potential angel investor about our traction',
    organizer: 'David Wilson - Angel Investor',
    reminderSet: false,
    priority: 'high'
  }
];

export function CalendarDashboard() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'registered' | 'confirmed'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredEvents = mockEvents
    .filter(event => {
      if (filterStatus === 'all') return true;
      return event.status === filterStatus;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingEvents = mockEvents.filter(e => 
    new Date(e.date) >= new Date() && ['upcoming', 'registered', 'confirmed'].includes(e.status)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400';
      case 'registered':
        return 'bg-blue-500/20 text-blue-400';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'attended':
        return 'bg-purple-500/20 text-purple-400';
      case 'missed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conference':
        return <Users className="w-4 h-4" />;
      case 'webinar':
        return <Video className="w-4 h-4" />;
      case 'networking':
        return <Building className="w-4 h-4" />;
      case 'deadline':
        return <AlertCircle className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl text-white">{upcomingEvents.length}</p>
            <p className="text-gray-400 text-sm">Upcoming Events</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl text-white">{mockEvents.filter(e => e.status === 'confirmed').length}</p>
            <p className="text-gray-400 text-sm">Confirmed</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Bell className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-2xl text-white">{mockEvents.filter(e => e.reminderSet).length}</p>
            <p className="text-gray-400 text-sm">Reminders Set</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl text-white">
              {mockEvents.reduce((sum, e) => sum + (e.attendees || 0), 0).toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">Total Attendees</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-green-600 text-white' : 'border-gray-600 text-gray-300'}
                >
                  List View
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className={viewMode === 'calendar' ? 'bg-green-600 text-white' : 'border-gray-600 text-gray-300'}
                >
                  Calendar View
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-blue-600 text-white' : 'border-gray-600 text-gray-300'}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('upcoming')}
                  className={filterStatus === 'upcoming' ? 'bg-blue-600 text-white' : 'border-gray-600 text-gray-300'}
                >
                  Upcoming
                </Button>
                <Button
                  variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('confirmed')}
                  className={filterStatus === 'confirmed' ? 'bg-blue-600 text-white' : 'border-gray-600 text-gray-300'}
                >
                  Confirmed
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Upcoming */}
      {upcomingEvents.filter(e => e.priority === 'high').length > 0 && (
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span>High Priority Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.filter(e => e.priority === 'high').slice(0, 3).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      {getTypeIcon(event.type)}
                    </div>
                    <div>
                      <h4 className="text-white">{event.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>{event.time}</span>
                        <span>{event.isVirtual ? 'Virtual' : event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!event.reminderSet && (
                      <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-400">
                        <Bell className="w-3 h-3 mr-1" />
                        Set Reminder
                      </Button>
                    )}
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event List */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <Card className={`bg-gray-900/50 border-gray-800 border-l-4 ${getPriorityColor(event.priority)} hover:border-gray-700 transition-colors duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                        {getTypeIcon(event.type)}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg text-white">{event.title}</h3>
                        <p className="text-gray-400 text-sm">{event.organizer}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        
                        {event.priority === 'high' && (
                          <Badge className="bg-red-500/20 text-red-400">
                            High Priority
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}{event.endTime && ` - ${event.endTime}`}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {event.isVirtual ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        <span>{event.isVirtual ? 'Virtual' : event.location}</span>
                      </div>
                      
                      {event.attendees && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees.toLocaleString()} attendees</span>
                        </div>
                      )}
                    </div>

                    {/* Preparation Items */}
                    {event.preparation && event.preparation.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-white text-sm mb-2">Preparation Checklist:</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.preparation.map((item, idx) => (
                            <Badge key={idx} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Contacts */}
                    {event.contacts && event.contacts.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-white text-sm mb-2">Key Contacts:</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.contacts.map((contact, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
                              {contact}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    {event.registrationId && (
                      <span>Registration: {event.registrationId}</span>
                    )}
                    {event.reminderSet && (
                      <div className="flex items-center space-x-1 text-green-400">
                        <Bell className="w-3 h-3" />
                        <span>Reminder set</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {event.meetingLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Join Meeting
                      </Button>
                    )}
                    
                    {!event.reminderSet && ['upcoming', 'registered', 'confirmed'].includes(event.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Bell className="w-4 h-4 mr-1" />
                        Set Reminder
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white mb-2">No events found</h3>
            <p className="text-gray-400">No events match the selected filter</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}