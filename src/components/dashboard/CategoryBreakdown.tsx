import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
  Laptop, 
  Megaphone, 
  Coffee, 
  Plane, 
  Users, 
  Zap, 
  Building,
  Wrench,
  PieChart as PieChartIcon
} from 'lucide-react';

const categoryData = [
  { name: 'SaaS Tools', value: 180000, percentage: 28.5, color: '#3B82F6', icon: Laptop },
  { name: 'Marketing', value: 125000, percentage: 19.8, color: '#EF4444', icon: Megaphone },
  { name: 'Office & Utilities', value: 95000, percentage: 15.1, color: '#10B981', icon: Building },
  { name: 'Salaries', value: 85000, percentage: 13.5, color: '#8B5CF6', icon: Users },
  { name: 'Travel', value: 68000, percentage: 10.8, color: '#F59E0B', icon: Plane },
  { name: 'Equipment', value: 45000, percentage: 7.1, color: '#06B6D4', icon: Wrench },
  { name: 'Office Supplies', value: 32000, percentage: 5.1, color: '#84CC16', icon: Coffee }
];

const monthlyBreakdown = [
  { month: 'Oct', saas: 15000, marketing: 8500, office: 7200, salaries: 7800, travel: 5600, equipment: 3200, supplies: 2800 },
  { month: 'Nov', saas: 14500, marketing: 12000, office: 8100, salaries: 7600, travel: 4200, equipment: 4800, supplies: 2600 },
  { month: 'Dec', saas: 16200, marketing: 9800, office: 8400, salaries: 8200, travel: 6800, equipment: 2900, supplies: 3100 }
];

const subcategories = [
  { category: 'SaaS Tools', items: [
    { name: 'Slack', amount: 3200, percentage: 45 },
    { name: 'GitHub', amount: 2800, percentage: 38 },
    { name: 'Figma', amount: 1200, percentage: 17 }
  ]},
  { category: 'Marketing', items: [
    { name: 'Google Ads', amount: 4500, percentage: 52 },
    { name: 'Social Media', amount: 2800, percentage: 32 },
    { name: 'Content Creation', amount: 1400, percentage: 16 }
  ]},
  { category: 'Office & Utilities', items: [
    { name: 'Rent', amount: 5200, percentage: 65 },
    { name: 'Electricity', amount: 1800, percentage: 23 },
    { name: 'Internet', amount: 950, percentage: 12 }
  ]}
];

export function CategoryBreakdown() {
  const totalSpending = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="bg-gray-900/50 border-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5" />
              <span>Spending Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
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
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category List */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-center space-x-3"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <IconComponent className="w-4 h-4" style={{ color: category.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm">{category.name}</span>
                        <span className="text-gray-400 text-sm">{category.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">${category.value.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Monthly Category Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="saas" stackId="a" fill="#3B82F6" name="SaaS Tools" />
                <Bar dataKey="marketing" stackId="a" fill="#EF4444" name="Marketing" />
                <Bar dataKey="office" stackId="a" fill="#10B981" name="Office & Utilities" />
                <Bar dataKey="salaries" stackId="a" fill="#8B5CF6" name="Salaries" />
                <Bar dataKey="travel" stackId="a" fill="#F59E0B" name="Travel" />
                <Bar dataKey="equipment" stackId="a" fill="#06B6D4" name="Equipment" />
                <Bar dataKey="supplies" stackId="a" fill="#84CC16" name="Office Supplies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subcategories.map((category, index) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">{item.name}</span>
                        <div className="text-right">
                          <span className="text-white">${item.amount.toLocaleString()}</span>
                          <span className="text-gray-400 text-sm ml-2">({item.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 text-sm">Largest Category</p>
            <p className="text-xl text-white">SaaS Tools</p>
            <Badge className="mt-1 bg-blue-500/20 text-blue-400">28.5%</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 text-sm">Most Volatile</p>
            <p className="text-xl text-white">Marketing</p>
            <Badge className="mt-1 bg-red-500/20 text-red-400">±40%</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 text-sm">Total Categories</p>
            <p className="text-xl text-white">{categoryData.length}</p>
            <Badge className="mt-1 bg-green-500/20 text-green-400">Tracked</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 text-sm">Avg per Category</p>
            <p className="text-xl text-white">${Math.round(totalSpending / categoryData.length).toLocaleString()}</p>
            <Badge className="mt-1 bg-purple-500/20 text-purple-400">Monthly</Badge>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}