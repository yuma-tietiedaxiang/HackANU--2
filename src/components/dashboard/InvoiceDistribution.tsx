import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Receipt,
  CreditCard,
  Building,
  AlertTriangle
} from 'lucide-react';

const invoiceAmountDistribution = [
  { range: '$0-500', count: 45, totalValue: 12500, percentage: 18.2 },
  { range: '$500-1K', count: 32, totalValue: 24000, percentage: 25.8 },
  { range: '$1K-5K', count: 28, totalValue: 68000, percentage: 31.4 },
  { range: '$5K-10K', count: 12, totalValue: 84000, percentage: 15.6 },
  { range: '$10K+', count: 8, totalValue: 95000, percentage: 8.9 }
];

const vatAnalysis = [
  { name: 'Net Amount', value: 240000, color: '#3B82F6' },
  { name: 'VAT Amount', value: 48000, color: '#EF4444' }
];

const paymentMethodData = [
  { method: 'Bank Transfer', count: 78, amount: 185000, color: '#10B981' },
  { method: 'Credit Card', count: 32, amount: 45000, color: '#F59E0B' },
  { method: 'Check', count: 15, amount: 58000, color: '#8B5CF6' }
];

const supplierData = [
  { name: 'TechCorp Solutions', invoices: 24, amount: 85000, avgAmount: 3541, lastInvoice: '2024-12-15' },
  { name: 'Marketing Pro Agency', invoices: 18, amount: 54000, avgAmount: 3000, lastInvoice: '2024-12-10' },
  { name: 'Office Supplies Co', invoices: 32, amount: 28000, avgAmount: 875, lastInvoice: '2024-12-12' },
  { name: 'CloudServices Inc', invoices: 12, amount: 48000, avgAmount: 4000, lastInvoice: '2024-12-08' },
  { name: 'Travel Solutions', invoices: 8, amount: 24000, avgAmount: 3000, lastInvoice: '2024-12-05' }
];

const monthlyVolume = [
  { month: 'Jan', invoices: 15, amount: 45000 },
  { month: 'Feb', invoices: 18, amount: 52000 },
  { month: 'Mar', invoices: 16, amount: 48000 },
  { month: 'Apr', invoices: 22, amount: 61000 },
  { month: 'May', invoices: 19, amount: 55000 },
  { month: 'Jun', invoices: 25, amount: 67000 },
  { month: 'Jul', invoices: 21, amount: 59000 },
  { month: 'Aug', invoices: 28, amount: 71000 },
  { month: 'Sep', invoices: 23, amount: 64000 },
  { month: 'Oct', invoices: 26, amount: 73000 },
  { month: 'Nov', invoices: 24, amount: 68000 },
  { month: 'Dec', invoices: 27, amount: 75000 }
];

export function InvoiceDistribution() {
  const totalInvoices = invoiceAmountDistribution.reduce((sum, range) => sum + range.count, 0);
  const totalValue = invoiceAmountDistribution.reduce((sum, range) => sum + range.totalValue, 0);
  const avgInvoiceValue = Math.round(totalValue / totalInvoices);

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
                <p className="text-gray-400 text-sm">Total Invoices</p>
                <p className="text-2xl text-white">{totalInvoices}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Value</p>
                <p className="text-2xl text-white">${avgInvoiceValue}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Largest Invoice</p>
                <p className="text-2xl text-white">$15,200</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-2xl text-white">27</p>
                <p className="text-sm text-gray-400">+12.5%</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Amount Distribution */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Invoice Amount Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={invoiceAmountDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'count' ? `${value} invoices` : `$${value.toLocaleString()}`,
                      name === 'count' ? 'Count' : 'Total Value'
                    ]}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* VAT vs Net Analysis */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>VAT vs Net Amount</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vatAnalysis}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vatAnalysis.map((entry, index) => (
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
            <div className="mt-4 space-y-2">
              {vatAnalysis.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-white">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Method Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethodData.map((method, index) => (
              <motion.div
                key={method.method}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: method.color + '20' }}
                  >
                    <CreditCard className="w-4 h-4" style={{ color: method.color }} />
                  </div>
                  <h3 className="text-white">{method.method}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Count:</span>
                    <span className="text-white">{method.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">${method.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg:</span>
                    <span className="text-white">${Math.round(method.amount / method.count).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Suppliers */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Top Suppliers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Supplier</TableHead>
                <TableHead className="text-gray-400">Invoices</TableHead>
                <TableHead className="text-gray-400">Total Amount</TableHead>
                <TableHead className="text-gray-400">Avg Amount</TableHead>
                <TableHead className="text-gray-400">Last Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierData.map((supplier, index) => (
                <motion.tr
                  key={supplier.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="border-gray-700 hover:bg-gray-800/50"
                >
                  <TableCell className="text-white">{supplier.name}</TableCell>
                  <TableCell className="text-gray-300">{supplier.invoices}</TableCell>
                  <TableCell className="text-gray-300">${supplier.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">${supplier.avgAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{supplier.lastInvoice}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Volume Trend */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Monthly Invoice Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVolume}>
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
                  formatter={(value: number, name: string) => [
                    name === 'invoices' ? `${value} invoices` : `$${value.toLocaleString()}`,
                    name === 'invoices' ? 'Invoice Count' : 'Total Amount'
                  ]}
                />
                <Bar dataKey="invoices" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}