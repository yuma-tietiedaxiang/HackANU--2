import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Award,
  Calendar,
  DollarSign,
  Zap,
  Star,
  Activity,
  Network,
  Brain,
  Trophy,
  Clock,
  MapPin
} from 'lucide-react';

const monthlyNetworkingData = [
  { month: 'Jul', events: 2, connections: 8, leads: 3, deals: 0, score: 65 },
  { month: 'Aug', events: 3, connections: 15, leads: 6, deals: 1, score: 72 },
  { month: 'Sep', events: 4, connections: 22, leads: 8, deals: 1, score: 78 },
  { month: 'Oct', events: 5, connections: 35, leads: 12, deals: 2, score: 85 },
  { month: 'Nov', events: 3, connections: 18, leads: 7, deals: 1, score: 80 },
  { month: 'Dec', events: 6, connections: 45, leads: 15, deals: 3, score: 92 }
];

const eventTypeData = [
  { name: 'Conferences', value: 35, events: 8, leads: 25, color: '#3B82F6' },
  { name: 'Webinars', value: 25, events: 12, leads: 18, color: '#10B981' },
  { name: 'Networking', value: 20, events: 6, leads: 12, color: '#F59E0B' },
  { name: 'Competitions', value: 12, events: 3, leads: 8, color: '#8B5CF6' },
  { name: 'Workshops', value: 8, events: 4, leads: 5, color: '#EF4444' }
];

const networkingROIData = [
  { category: 'Event Costs', amount: 8500, percentage: 15 },
  { category: 'Travel & Accommodation', amount: 12000, percentage: 21 },
  { category: 'Time Investment', amount: 25000, percentage: 44 },
  { category: 'Opportunity Cost', amount: 11500, percentage: 20 }
];

const connectionQualityData = [
  { type: 'Investors', count: 18, quality: 92, deals: 5 },
  { type: 'Customers', count: 32, quality: 78, deals: 12 },
  { type: 'Partners', count: 24, quality: 85, deals: 8 },
  { type: 'Mentors', count: 12, quality: 95, deals: 3 },
  { type: 'Peers', count: 45, quality: 68, deals: 6 }
];

const topEvents = [
  {
    name: 'TechCrunch Disrupt',
    attendees: 5000,
    connections: 15,
    leads: 8,
    deals: 2,
    roi: '320%',
    score: 95
  },
  {
    name: 'Y Combinator Demo Day',
    attendees: 2000,
    connections: 12,
    leads: 6,
    deals: 3,
    roi: '450%',
    score: 92
  },
  {
    name: 'AI Innovation Summit',
    attendees: 1500,
    connections: 8,
    leads: 4,
    deals: 1,
    roi: '180%',
    score: 78
  },
  {
    name: 'Startup Grind Global',
    attendees: 3000,
    connections: 10,
    leads: 5,
    deals: 1,
    roi: '210%',
    score: 82
  }
];

const networkingGoals = [
  { goal: 'Connect with 50 investors', current: 32, target: 50, percentage: 64 },
  { goal: 'Attend 20 events this year', current: 16, target: 20, percentage: 80 },
  { goal: 'Generate 100 qualified leads', current: 78, target: 100, percentage: 78 },
  { goal: 'Close 10 partnership deals', current: 7, target: 10, percentage: 70 }
];

export function NetworkingAnalytics() {
  const [timeframe, setTimeframe] = useState<'3m' | '6m' | '1y'>('6m');
  const [selectedMetric, setSelectedMetric] = useState<'connections' | 'leads' | 'deals' | 'score'>('score');

  const totalConnections = connectionQualityData.reduce((sum, item) => sum + item.count, 0);
  const totalLeads = monthlyNetworkingData.reduce((sum, month) => sum + month.leads, 0);
  const totalDeals = monthlyNetworkingData.reduce((sum, month) => sum + month.deals, 0);
  const avgNetworkingScore = Math.round(monthlyNetworkingData.reduce((sum, month) => sum + month.score, 0) / monthlyNetworkingData.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl text-white">{totalConnections}</p>
            <p className="text-gray-400 text-sm">Total Connections</p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs">+23% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl text-white">{totalLeads}</p>
            <p className="text-gray-400 text-sm">Qualified Leads</p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs">+18% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl text-white">{totalDeals}</p>
            <p className="text-gray-400 text-sm">Closed Deals</p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400 text-xs">+50% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-2xl text-white">{avgNetworkingScore}</p>
            <p className="text-gray-400 text-sm">Networking Score</p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-xs">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Networking Performance Trends</span>
              </div>
              <div className="flex space-x-1">
                {['3m', '6m', '1y'].map((period) => (
                  <Button
                    key={period}
                    variant={timeframe === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeframe(period as '3m' | '6m' | '1y')}
                    className={timeframe === period ? 'bg-blue-600 text-white' : 'border-gray-600 text-gray-300'}
                  >
                    {period.toUpperCase()}
                  </Button>
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyNetworkingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="connections" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="leads" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Network className="w-5 h-5" />
              <span>Event Type Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-4">
              {eventTypeData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white text-sm">{item.leads} leads</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Quality Analysis */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Connection Quality Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectionQualityData.map((connection, index) => (
              <motion.div
                key={connection.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-white">{connection.type}</h4>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {connection.count} connections
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-white text-sm">Quality Score</p>
                      <p className="text-2xl text-white">{connection.quality}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Deals Closed</p>
                      <p className="text-xl text-green-400">{connection.deals}</p>
                    </div>
                  </div>
                </div>
                
                <Progress value={connection.quality} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Events */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Top Performing Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <motion.div
                key={event.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-white mb-2">{event.name}</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees.toLocaleString()} attendees</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Network className="w-4 h-4" />
                        <span>{event.connections} connections</span>
                      </div>
                      <div className="flex items-center space-x-2 text-green-400">
                        <Target className="w-4 h-4" />
                        <span>{event.leads} leads</span>
                      </div>
                      <div className="flex items-center space-x-2 text-purple-400">
                        <Trophy className="w-4 h-4" />
                        <span>{event.deals} deals</span>
                      </div>
                      <div className="flex items-center space-x-2 text-orange-400">
                        <DollarSign className="w-4 h-4" />
                        <span>{event.roi} ROI</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-white text-sm">Event Score</p>
                      <p className="text-2xl text-white">{event.score}</p>
                    </div>
                    
                    <div className="w-16 h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: event.score }]}>
                          <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals Progress */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Networking Goals Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {networkingGoals.map((goal, index) => (
              <motion.div
                key={goal.goal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white text-sm">{goal.goal}</h4>
                  <Badge 
                    className={`${
                      goal.percentage >= 80 
                        ? 'bg-green-500/20 text-green-400' 
                        : goal.percentage >= 60 
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {goal.percentage}%
                  </Badge>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{goal.current} / {goal.target}</span>
                  </div>
                  <Progress value={goal.percentage} className="h-3 mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>AI-Powered Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Strong Performance Trend</p>
                <p className="text-gray-400 text-xs">Your networking score has increased by 27% over the past 6 months, indicating excellent relationship building.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Optimal Event Mix</p>
                <p className="text-gray-400 text-xs">Conferences generate 60% more qualified leads than other event types. Consider increasing conference attendance.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-white text-sm">Investor Connection Opportunity</p>
                <p className="text-gray-400 text-xs">You're 32% below your investor connection goal. Focus on seed/Series A events in Q1.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}