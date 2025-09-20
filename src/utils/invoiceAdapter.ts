// Adapter: transform public/invoice-dashboard.json to frontend component data

export type DashboardJson = {
  summary: {
    total_spent: number;
    average_invoice_amount: number;
    total_vat_paid: number;
    number_of_invoices: number;
    date_range: { min: string | null; max: string | null };
  };
  monthly_spending: { month: string; amount: number }[]; // month: 'YYYY-MM'
  client_spending: { client: string; amount: number }[];
  vat_vs_net: { net: number; vat: number }[];
  invoice_amount_distribution: {
    range: string;
    count: number;
    totalValue: number;
    percentage: number;
  }[];
  vat_analysis: { name: string; value: number; color: string }[];
  predictions: { month: string; forecast: number }[]; // month: 'Oct' etc.
  invoices: Array<{
    invoice_no: string;
    date: string; // YYYY-MM-DD
    total_amount: number;
    vat: number;
    net_amount: number;
    client: string;
  }>;
};

// -------- InvoiceDistribution needs --------
export type InvoiceAmountDistribution =
  DashboardJson["invoice_amount_distribution"];
export type VatAnalysis = DashboardJson["vat_analysis"];
export type SupplierRow = {
  name: string;
  invoices: number;
  amount: number;
  avgAmount: number;
  lastInvoice: string;
};
export type MonthlyVolumeRow = {
  month: string;
  invoices: number;
  amount: number;
};

export function toInvoiceDistribution(json: DashboardJson): {
  invoiceAmountDistribution: InvoiceAmountDistribution;
  vatAnalysis: VatAnalysis;
  supplierData: SupplierRow[];
  monthlyVolume: MonthlyVolumeRow[];
} {
  // supplierData from invoices grouped by client
  const grouped = new Map<
    string,
    { invoices: number; amount: number; lastInvoice: string }
  >();
  for (const inv of json.invoices) {
    const g = grouped.get(inv.client) || {
      invoices: 0,
      amount: 0,
      lastInvoice: "1970-01-01",
    };
    g.invoices += 1;
    g.amount += inv.total_amount;
    if (!g.lastInvoice || g.lastInvoice < inv.date) g.lastInvoice = inv.date;
    grouped.set(inv.client, g);
  }
  const supplierData: SupplierRow[] = Array.from(grouped.entries())
    .map(([name, v]) => ({
      name,
      invoices: v.invoices,
      amount: Math.round(v.amount),
      avgAmount: v.invoices ? Math.round(v.amount / v.invoices) : 0,
      lastInvoice: v.lastInvoice,
    }))
    .sort((a, b) => b.amount - a.amount);

  // monthlyVolume: count and amount by month (MMM)
  const monthAgg = new Map<string, { invoices: number; amount: number }>();
  for (const inv of json.invoices) {
    const dt = new Date(inv.date);
    const month = dt.toLocaleString("en-US", { month: "short" });
    const g = monthAgg.get(month) || { invoices: 0, amount: 0 };
    g.invoices += 1;
    g.amount += inv.total_amount;
    monthAgg.set(month, g);
  }
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyVolume: MonthlyVolumeRow[] = Array.from(monthAgg.entries())
    .map(([month, v]) => ({
      month,
      invoices: v.invoices,
      amount: Math.round(v.amount),
    }))
    .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

  return {
    invoiceAmountDistribution: json.invoice_amount_distribution,
    vatAnalysis: json.vat_analysis,
    supplierData,
    monthlyVolume,
  };
}

// -------- SpendingTrends needs --------
export type MonthlyTrendRow = {
  month: string;
  amount: number;
  expenses: number;
  trend: "up" | "down";
};

export function toSpendingTrends(json: DashboardJson): {
  monthlyData: MonthlyTrendRow[];
} {
  // Map YYYY-MM to short month
  const monthlyData: MonthlyTrendRow[] = json.monthly_spending.map(
    (m, idx, arr) => {
      const ym = m.month; // e.g., '2021-02'
      const [year, mon] = ym.split("-").map(Number);
      const d = new Date(year, (mon || 1) - 1, 1);
      const label = d.toLocaleString("en-US", { month: "short" });
      const amount = Math.round(m.amount);
      const prev = idx > 0 ? Math.round(arr[idx - 1].amount) : amount;
      const trend: "up" | "down" = amount >= prev ? "up" : "down";
      // We do not have expenses; approximate as 95% of amount for UI filler
      const expenses = Math.round(amount * 0.95);
      return { month: label, amount, expenses, trend };
    }
  );
  return { monthlyData };
}

// -------- Forecasting needs --------
export type HistoricalRow = {
  month: string;
  actual: number;
  predicted: number | null;
};
export type ForecastRow = {
  month: string;
  actual: number | null;
  forecast: number | null;
  confidence: number;
};

export function toForecasting(json: DashboardJson): {
  historicalData: HistoricalRow[];
  forecastData: ForecastRow[];
  nextMonthForecast: number;
  currentMonthActual: number;
} {
  // Take last up-to 6 months as historical
  const hist = [...json.monthly_spending].slice(-6).map((m) => {
    const [year, mon] = m.month.split("-").map(Number);
    const d = new Date(year, (mon || 1) - 1, 1);
    const label = d.toLocaleString("en-US", { month: "short" });
    return { month: label, actual: Math.round(m.amount), predicted: null };
  });

  const forecastData: ForecastRow[] = [];
  // Last historical actual used as anchor
  if (hist.length > 0) {
    forecastData.push({
      month: hist[hist.length - 1].month,
      actual: hist[hist.length - 1].actual,
      forecast: null,
      confidence: 100,
    });
  }
  for (const p of json.predictions) {
    forecastData.push({
      month: p.month,
      actual: null,
      forecast: Math.round(p.forecast),
      confidence: 80,
    });
  }

  const currentMonthActual = hist.length ? hist[hist.length - 1].actual : 0;
  const nextMonthForecast = json.predictions.length
    ? Math.round(json.predictions[0].forecast)
    : 0;

  return {
    historicalData: hist,
    forecastData,
    nextMonthForecast,
    currentMonthActual,
  };
}

// -------- CategoryBreakdown approximation from client_spending --------
export type CategoryItem = {
  name: string;
  value: number;
  percentage: number;
  color: string;
};
export type MonthlyCategoryBreakdown = { month: string; [key: string]: number };

const palette = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#06B6D4",
  "#84CC16",
  "#E11D48",
  "#0EA5E9",
  "#14B8A6",
];

export function toCategoryBreakdownFromClients(
  json: DashboardJson,
  topN = 7
): {
  categoryData: CategoryItem[];
  monthlyBreakdown: MonthlyCategoryBreakdown[];
} {
  const total = json.client_spending.reduce((s, c) => s + c.amount, 0) || 1;
  const top = json.client_spending
    .slice(0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, topN);

  const categoryData: CategoryItem[] = top.map((c, i) => ({
    name: c.client,
    value: Math.round(c.amount),
    percentage: parseFloat(((c.amount * 100) / total).toFixed(1)),
    color: palette[i % palette.length],
  }));

  // Build monthly breakdown per top client (others grouped as 'Others')
  const monthKey = (iso: string) => iso.slice(0, 7); // YYYY-MM
  const topNames = new Set(top.map((c) => c.client));
  const months = new Map<string, Record<string, number>>();
  for (const inv of json.invoices) {
    const mk = monthKey(inv.date);
    const row = months.get(mk) || {};
    const key = topNames.has(inv.client) ? inv.client : "Others";
    row[key] = (row[key] || 0) + inv.total_amount;
    months.set(mk, row);
  }
  const ordered = Array.from(months.entries()).sort(([a], [b]) =>
    a < b ? -1 : 1
  );
  const monthlyBreakdown: MonthlyCategoryBreakdown[] = ordered.map(
    ([ym, row]) => {
      const [year, mon] = ym.split("-").map(Number);
      const label = new Date(year, (mon || 1) - 1, 1).toLocaleString("en-US", {
        month: "short",
      });
      return {
        month: label,
        ...Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k, Math.round(v as number)])
        ),
      } as MonthlyCategoryBreakdown;
    }
  );

  return { categoryData, monthlyBreakdown };
}

// -------- Fetch helper --------
export async function fetchDashboardJson(): Promise<DashboardJson> {
  const res = await fetch("/invoice-dashboard.json");
  if (!res.ok)
    throw new Error(`Failed to load invoice-dashboard.json: ${res.status}`);
  return res.json();
}

// Example composition for components (to be used inside useEffect or loaders):
// const json = await fetchDashboardJson();
// const dist = toInvoiceDistribution(json);
// const trends = toSpendingTrends(json);
// const fc = toForecasting(json);
// const cats = toCategoryBreakdownFromClients(json);
