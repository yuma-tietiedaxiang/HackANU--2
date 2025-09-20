import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calendar,
  DollarSign,
  Activity,
  Zap,
} from "lucide-react";
import { fetchDashboardJson, toForecasting } from "../../utils/invoiceAdapter";

const fallbackHistoricalData = [
  { month: "Jul", actual: 59000, predicted: 58500 },
  { month: "Aug", actual: 71000, predicted: 69800 },
  { month: "Sep", actual: 64000, predicted: 65200 },
  { month: "Oct", actual: 73000, predicted: 71500 },
  { month: "Nov", actual: 68000, predicted: 69000 },
  { month: "Dec", actual: 75000, predicted: 74200 },
];

const fallbackForecastData = [
  { month: "Dec", actual: 75000, forecast: null, confidence: 100 },
  { month: "Jan", actual: null, forecast: 78500, confidence: 85 },
  { month: "Feb", actual: null, forecast: 72300, confidence: 82 },
  { month: "Mar", actual: null, forecast: 81200, confidence: 78 },
  { month: "Apr", actual: null, forecast: 85600, confidence: 75 },
  { month: "May", actual: null, forecast: 88900, confidence: 70 },
  { month: "Jun", actual: null, forecast: 92400, confidence: 65 },
];

const categoryForecasts = [
  {
    category: "SaaS Tools",
    current: 15000,
    forecast: 16800,
    trend: "up",
    confidence: 92,
    riskLevel: "low",
    factors: ["Increasing team size", "New tool adoption"],
  },
  {
    category: "Marketing",
    current: 8500,
    forecast: 12200,
    trend: "up",
    confidence: 78,
    riskLevel: "medium",
    factors: ["Q1 campaign launch", "Market expansion"],
  },
  {
    category: "Office & Utilities",
    current: 7200,
    forecast: 7350,
    trend: "up",
    confidence: 95,
    riskLevel: "low",
    factors: ["Stable rent", "Energy price increase"],
  },
  {
    category: "Travel",
    current: 5600,
    forecast: 8900,
    trend: "up",
    confidence: 65,
    riskLevel: "high",
    factors: ["Conference season", "Client meetings"],
  },
];

const budgetScenarios = [
  {
    name: "Conservative",
    q1: 225000,
    q2: 240000,
    total: 920000,
    probability: 75,
  },
  {
    name: "Realistic",
    q1: 250000,
    q2: 275000,
    total: 1050000,
    probability: 60,
  },
  {
    name: "Optimistic",
    q1: 285000,
    q2: 320000,
    total: 1250000,
    probability: 25,
  },
];

const aiInsights = [
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "Cost Optimization Opportunity",
    description:
      "Marketing spend efficiency could improve by 15% with better targeting",
    impact: "$1,800",
    color: "text-green-400",
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Budget Risk Alert",
    description:
      "Travel expenses may exceed budget by 25% in Q1 due to conference season",
    impact: "+$2,200",
    color: "text-yellow-400",
  },
  {
    type: "trend",
    icon: Brain,
    title: "Seasonal Pattern Detected",
    description:
      "SaaS costs typically spike 8% in January due to annual renewals",
    impact: "+$1,200",
    color: "text-blue-400",
  },
];

export function Forecasting() {
  const [hist, setHist] = useState(fallbackHistoricalData);
  const [fc, setFc] = useState(fallbackForecastData);
  const [nextMonthForecast, setNextMonthForecast] = useState(78500);
  const [currentMonth, setCurrentMonth] = useState(75000);

  useEffect(() => {
    (async () => {
      try {
        const json = await fetchDashboardJson();
        const mapped = toForecasting(json);
        setHist(mapped.historicalData);
        setFc(mapped.forecastData);
        setNextMonthForecast(mapped.nextMonthForecast);
        setCurrentMonth(mapped.currentMonthActual);
      } catch (err) {
        console.error("Failed to load invoice-dashboard.json", err);
      }
    })();
  }, []);

  const totalForecast6Months = fc
    .filter((d) => d.forecast)
    .reduce((sum, d) => sum + (d.forecast || 0), 0);

  const avgMonthlyForecast = Math.round(totalForecast6Months / 6);
  const monthlyGrowth = currentMonth
    ? (((nextMonthForecast - currentMonth) / currentMonth) * 100).toFixed(1)
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
                <p className="text-gray-400 text-sm">6-Month Forecast</p>
                <p className="text-2xl text-white">
                  ${totalForecast6Months.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
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
                  ${avgMonthlyForecast.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Next Month</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl text-white">
                    ${nextMonthForecast.toLocaleString()}
                  </p>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-sm text-green-400">+{monthlyGrowth}%</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">
                85% Confidence
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Accuracy</p>
                <p className="text-2xl text-white">94.2%</p>
                <p className="text-sm text-gray-400">Last 6 months</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>6-Month Spending Forecast</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fc}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorForecast"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
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
                  formatter={(value: number, name: string) => [
                    `$${value?.toLocaleString() || "N/A"}`,
                    name === "actual" ? "Actual" : "Forecast",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorForecast)"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Forecasts */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Category Forecasts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryForecasts.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white">{category.category}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        category.riskLevel === "low"
                          ? "default"
                          : category.riskLevel === "medium"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {category.riskLevel} risk
                    </Badge>
                    {category.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Current Monthly</p>
                    <p className="text-xl text-white">
                      ${category.current.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Forecasted</p>
                    <p className="text-xl text-white">
                      ${category.forecast.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {(
                        ((category.forecast - category.current) /
                          category.current) *
                        100
                      ).toFixed(1)}
                      % change
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Confidence</p>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={category.confidence}
                        className="flex-1 h-2"
                      />
                      <span className="text-white text-sm">
                        {category.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-gray-400 text-xs">Key factors:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {category.factors.map((factor, factorIndex) => (
                      <Badge
                        key={factorIndex}
                        variant="outline"
                        className="text-xs border-gray-600 text-gray-300"
                      >
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Scenarios */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Budget Scenarios (2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {budgetScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`p-4 rounded-lg border-2 ${
                  scenario.name === "Realistic"
                    ? "bg-blue-500/10 border-blue-500"
                    : "bg-gray-800/50 border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white">{scenario.name}</h3>
                  <Badge
                    className={`${
                      scenario.name === "Realistic"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-600/20 text-gray-400"
                    }`}
                  >
                    {scenario.probability}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Q1 Projection</p>
                    <p className="text-xl text-white">
                      ${scenario.q1.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Q2 Projection</p>
                    <p className="text-xl text-white">
                      ${scenario.q2.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Annual Total</p>
                    <p className="text-2xl text-white">
                      ${scenario.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>AI-Powered Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      insight.type === "opportunity"
                        ? "bg-green-500/20"
                        : insight.type === "warning"
                        ? "bg-yellow-500/20"
                        : "bg-blue-500/20"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${insight.color}`} />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-white mb-1">{insight.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">
                      {insight.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Impact: {insight.impact}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
