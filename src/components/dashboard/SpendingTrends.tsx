import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import {
  fetchDashboardJson,
  toSpendingTrends,
} from "../../utils/invoiceAdapter";

const fallbackMonthlyData = [
  { month: "Jan", amount: 45000, expenses: 42000, trend: "up" },
  { month: "Feb", amount: 52000, expenses: 48000, trend: "up" },
  { month: "Mar", amount: 48000, expenses: 45000, trend: "down" },
  { month: "Apr", amount: 61000, expenses: 58000, trend: "up" },
  { month: "May", amount: 55000, expenses: 52000, trend: "down" },
  { month: "Jun", amount: 67000, expenses: 63000, trend: "up" },
  { month: "Jul", amount: 59000, expenses: 56000, trend: "down" },
  { month: "Aug", amount: 71000, expenses: 68000, trend: "up" },
  { month: "Sep", amount: 64000, expenses: 61000, trend: "down" },
  { month: "Oct", amount: 73000, expenses: 70000, trend: "up" },
  { month: "Nov", amount: 68000, expenses: 65000, trend: "down" },
  { month: "Dec", amount: 75000, expenses: 72000, trend: "up" },
];

const weeklyData = [
  { week: "Week 1", amount: 18000, target: 16000 },
  { week: "Week 2", amount: 22000, target: 16000 },
  { week: "Week 3", amount: 15000, target: 16000 },
  { week: "Week 4", amount: 13000, target: 16000 },
];

const categoryTrends = [
  { name: "SaaS Tools", current: 15000, previous: 13000, change: "+15.4%" },
  { name: "Marketing", current: 8500, previous: 12000, change: "-29.2%" },
  { name: "Office Supplies", current: 3200, previous: 2800, change: "+14.3%" },
  { name: "Travel", current: 5600, previous: 4200, change: "+33.3%" },
];

export function SpendingTrends() {
  const [data, setData] = useState(fallbackMonthlyData);

  useEffect(() => {
    (async () => {
      try {
        const json = await fetchDashboardJson();
        const mapped = toSpendingTrends(json);
        setData(mapped.monthlyData);
      } catch (err) {
        console.error("Failed to load invoice-dashboard.json", err);
      }
    })();
  }, []);

  const totalSpending = data.reduce((sum, month) => sum + month.amount, 0);
  const avgMonthly = Math.round(totalSpending / (data.length || 1));
  const lastMonthChange =
    data.length >= 2
      ? (
          ((data[data.length - 1].amount - data[data.length - 2].amount) /
            (data[data.length - 2].amount || 1)) *
          100
        ).toFixed(1)
      : "0.0";

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
                <p className="text-gray-400 text-sm">Total Spending</p>
                <p className="text-2xl text-white">
                  ${totalSpending.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Monthly Average</p>
                <p className="text-2xl text-white">
                  ${avgMonthly.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Last Month Change</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl text-white">{lastMonthChange}%</p>
                  {parseFloat(lastMonthChange) > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
              <Badge
                variant={
                  parseFloat(lastMonthChange) > 0 ? "destructive" : "default"
                }
                className="bg-opacity-20"
              >
                {parseFloat(lastMonthChange) > 0 ? "Increase" : "Decrease"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Peak Month</p>
                <p className="text-2xl text-white">December</p>
                <p className="text-sm text-gray-400">$75,000</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Line Chart */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Monthly Spending Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Breakdown Bar Chart */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>This Month's Weekly Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Bar dataKey="amount" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="target"
                    fill="#374151"
                    radius={[4, 4, 0, 0]}
                    opacity={0.5}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Trends */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">
            Category Spending Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryTrends.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="text-white">{category.name}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-2xl text-white">
                      ${category.current.toLocaleString()}
                    </span>
                    <span className="text-gray-400 line-through">
                      ${category.previous.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {category.change.startsWith("+") ? (
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-400" />
                  )}
                  <Badge
                    variant={
                      category.change.startsWith("+")
                        ? "destructive"
                        : "default"
                    }
                    className="bg-opacity-20"
                  >
                    {category.change}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
