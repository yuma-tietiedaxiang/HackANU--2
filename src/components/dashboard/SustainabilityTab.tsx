import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  Leaf, 
  Zap, 
  Car, 
  Building, 
  Plane, 
  Recycle,
  Target,
  TrendingDown,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const carbonFootprintData = [
  { month: 'Jul', emissions: 12.5, target: 10 },
  { month: 'Aug', emissions: 14.2, target: 10 },
  { month: 'Sep', emissions: 11.8, target: 10 },
  { month: 'Oct', emissions: 13.6, target: 10 },
  { month: 'Nov', emissions: 10.9, target: 10 },
  { month: 'Dec', emissions: 15.3, target: 10 }
];

const emissionSources = [
  { name: 'Travel', value: 35.2, color: '#EF4444', emissions: 5.4 },
  { name: 'Office Energy', value: 28.8, color: '#F59E0B', emissions: 4.4 },
  { name: 'Digital Services', value: 18.5, color: '#3B82F6', emissions: 2.8 },
  { name: 'Equipment', value: 10.3, color: '#8B5CF6', emissions: 1.6 },
  { name: 'Shipping', value: 7.2, color: '#10B981', emissions: 1.1 }
];

const sustainabilityMetrics = [
  { 
    name: 'Carbon Intensity', 
    value: 85, 
    target: 100, 
    unit: 'CO₂/revenue',
    status: 'good',
    trend: 'improving'
  },
  { 
    name: 'Energy Efficiency', 
    value: 72, 
    target: 80, 
    unit: 'kWh/employee',
    status: 'warning',
    trend: 'stable'
  },
  { 
    name: 'Waste Reduction', 
    value: 91, 
    target: 90, 
    unit: '% recycled',
    status: 'excellent',
    trend: 'improving'
  },
  { 
    name: 'Green Procurement', 
    value: 68, 
    target: 75, 
    unit: '% sustainable',
    status: 'warning',
    trend: 'improving'
  }
];

const recommendations = [
  {
    title: 'Switch to Green Energy Provider',
    description: 'Reduce office energy emissions by 40% with renewable energy',
    impact: '-1.8 tonnes CO₂',
    difficulty: 'Easy',
    cost: 'Low',
    priority: 'high',
    timeframe: '1 month'
  },
  {
    title: 'Implement Remote Work Policy',
    description: 'Reduce travel emissions with 2 days remote work per week',
    impact: '-2.2 tonnes CO₂',
    difficulty: 'Medium',
    cost: 'None',
    priority: 'high',
    timeframe: '2 weeks'
  },
  {
    title: 'Optimize Digital Infrastructure',
    description: 'Use green cloud providers and optimize server usage',
    impact: '-0.8 tonnes CO₂',
    difficulty: 'Medium',
    cost: 'Medium',
    priority: 'medium',
    timeframe: '3 months'
  },
  {
    title: 'Carbon Offset Program',
    description: 'Offset remaining emissions through verified carbon credits',
    impact: '-3.5 tonnes CO₂',
    difficulty: 'Easy',
    cost: 'Medium',
    priority: 'low',
    timeframe: '1 week'
  }
];

const industryComparison = [
  { metric: 'Carbon per Employee', company: 8.2, industry: 12.5, unit: 'tonnes CO₂' },
  { metric: 'Energy Efficiency', company: 72, industry: 65, unit: 'score' },
  { metric: 'Waste Diversion', company: 91, industry: 78, unit: '%' },
  { metric: 'Green Spending', company: 68, industry: 45, unit: '%' }
];

export function SustainabilityTab() {
  const totalEmissions = emissionSources.reduce((sum, source) => sum + source.emissions, 0);
  const currentEmissions = 15.3;
  const targetEmissions = 10;
  const emissionReduction = ((targetEmissions - currentEmissions) / currentEmissions * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Carbon Footprint</p>
                <p className="text-2xl text-white">{currentEmissions} <span className="text-sm text-gray-400">tonnes CO₂</span></p>
                <p className="text-sm text-red-400">Above target</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sustainability Score</p>
                <p className="text-2xl text-white">B+</p>
                <p className="text-sm text-green-400">Improving</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Potential Savings</p>
                <p className="text-2xl text-white">-5.8 <span className="text-sm text-gray-400">tonnes</span></p>
                <p className="text-sm text-green-400">38% reduction</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Green Spending</p>
                <p className="text-2xl text-white">68%</p>
                <p className="text-sm text-yellow-400">Below target</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carbon Footprint Trend */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Leaf className="w-5 h-5" />
              <span>Carbon Footprint Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={carbonFootprintData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${value}t`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} tonnes CO₂`,
                      name === 'emissions' ? 'Actual' : 'Target'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emission Sources */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Emission Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emissionSources}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {emissionSources.map((entry, index) => (
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
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-4">
              {emissionSources.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-gray-300 text-sm">{source.name}</span>
                  </div>
                  <span className="text-white text-sm">{source.emissions}t CO₂</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sustainability Metrics */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Sustainability Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sustainabilityMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-sm">{metric.name}</h3>
                  {metric.status === 'excellent' && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {metric.status === 'good' && <CheckCircle className="w-4 h-4 text-blue-400" />}
                  {metric.status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-white">{metric.value}</span>
                    <span className="text-gray-400 text-sm">{metric.unit}</span>
                  </div>
                  
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Target: {metric.target}</span>
                    <Badge 
                      variant={metric.trend === 'improving' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {metric.trend}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">AI Sustainability Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-green-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-white">{rec.title}</h3>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">{rec.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">{rec.impact}</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">Difficulty: {rec.difficulty}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">Cost: {rec.cost}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{rec.timeframe}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" className="ml-4 bg-green-600 hover:bg-green-700">
                    Implement
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Comparison */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Industry Benchmark</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {industryComparison.map((comparison, index) => (
              <motion.div
                key={comparison.metric}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <span className="text-white">{comparison.metric}</span>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-white">Your Company: {comparison.company} {comparison.unit}</p>
                    <p className="text-gray-400 text-sm">Industry Avg: {comparison.industry} {comparison.unit}</p>
                  </div>
                  
                  {comparison.company < comparison.industry ? (
                    <Badge className="bg-green-500/20 text-green-400">Better</Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400">Worse</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}