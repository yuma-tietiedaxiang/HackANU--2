import cv2
import pytesseract
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import re
import json
from datetime import datetime, timedelta
import os
import warnings
warnings.filterwarnings('ignore')

# -------------------- OCR Engine --------------------
class InvoiceOCR:
    def __init__(self):
        candidate_paths = [
            '/opt/homebrew/bin/tesseract',  
            '/usr/local/bin/tesseract',     
            '/usr/bin/tesseract'            
        ]
        for p in candidate_paths:
            if os.path.exists(p):
                pytesseract.pytesseract.tesseract_cmd = p
                break

    def preprocess_image(self, image_path):
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        denoised = cv2.fastNlMeansDenoising(gray)
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        kernel = np.ones((1,1), np.uint8)
        img_processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        return img_processed

    def extract_text_from_image(self, image_path):
        try:
            processed_img = self.preprocess_image(image_path)
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(processed_img, config=custom_config)
            return text
        except Exception as e:
            print(f"Error extracting text: {e}")
            return ""

    def parse_invoice_data(self, text):
        invoice_data = {}

        # Invoice no
        match = re.search(r'Invoice\s+no[:\s]+([A-Z0-9\-]+)', text, re.IGNORECASE)
        invoice_data['invoice_no'] = match.group(1) if match else "Unknown"

        # Date
        match = re.search(r'Date\s+of\s+issue[:\s]+(\d{2}/\d{2}/\d{4})', text, re.IGNORECASE)
        invoice_data['date'] = match.group(1) if match else "01/01/2000"

        # Client
        match = re.search(r'Client[:\s]+(.*?)(?=Tax Id:|IBAN:)', text, re.IGNORECASE | re.DOTALL)
        invoice_data['client'] = match.group(1).strip() if match else "Unknown"

        # Total amount
        match = re.search(r'Total\s+\$\s*([\d,]+\.?\d*)', text, re.IGNORECASE)
        total_amount = float(match.group(1).replace(',', '')) if match else 0.0
        invoice_data['total_amount'] = total_amount

        # Net = Total
        invoice_data['net_amount'] = total_amount

        # VAT = 10% of total
        invoice_data['vat'] = round(total_amount * 0.10, 2)

        return invoice_data

# -------------------- Analyzer --------------------
class ExpenditureAnalyzer:
    def __init__(self):
        self.invoices_data = []

    def add_invoice_data(self, invoice_data):
        self.invoices_data.append(invoice_data)

    # Process invoices from folder
    def process_invoices_from_folder(self, folder_path, ocr_engine):
        if not os.path.exists(folder_path):
            print(f"Folder '{folder_path}' not found.")
            return
        for file_name in os.listdir(folder_path):
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
                image_path = os.path.join(folder_path, file_name)
                print(f"Processing: {file_name}")
                text = ocr_engine.extract_text_from_image(image_path)
                invoice_data = ocr_engine.parse_invoice_data(text)
                self.add_invoice_data(invoice_data)

    # Analyze spending
    def analyze_spending_patterns(self):
        if not self.invoices_data:
            print("No invoice data available for analysis")
            return

        df_data = []
        for inv in self.invoices_data:
            df_data.append({
                'Invoice_No': inv['invoice_no'],
                'Date': pd.to_datetime(inv['date']),
                'Total_Amount': inv['total_amount'],
                'VAT': inv['vat'],
                'Net_Amount': inv['net_amount'],
                'Client': inv.get('client', 'Unknown')
            })

        df = pd.DataFrame(df_data)

        analysis = {}
        analysis['total_spent'] = df['Total_Amount'].sum()
        analysis['average_invoice_amount'] = df['Total_Amount'].mean()
        analysis['total_vat_paid'] = df['VAT'].sum()
        analysis['number_of_invoices'] = len(df)

        df['Month'] = df['Date'].dt.to_period('M')
        analysis['monthly_spending'] = df.groupby('Month')['Total_Amount'].sum()
        analysis['client_spending'] = df.groupby('Client')['Total_Amount'].sum()

        print("=== EXPENDITURE ANALYSIS ===\n")
        print(f"Total Amount Spent: ${analysis['total_spent']:.2f}")
        print(f"Average Invoice Amount: ${analysis['average_invoice_amount']:.2f}")
        print(f"Total VAT Paid: ${analysis['total_vat_paid']:.2f}")
        print(f"Number of Invoices: {analysis['number_of_invoices']}")
        print(f"Date Range: {df['Date'].min().strftime('%Y-%m-%d')} to {df['Date'].max().strftime('%Y-%m-%d')}\n")

        return analysis, df

    # Visualizations
    def create_visualizations(self, df):
        plt.style.use('default')
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Expenditure Analysis Dashboard', fontsize=16, fontweight='bold')

        # Monthly Spending
        df['Month'] = df['Date'].dt.to_period('M')
        monthly_data = df.groupby('Month')['Total_Amount'].sum()
        axes[0, 0].plot(range(len(monthly_data)), monthly_data.values, marker='o', linewidth=2, markersize=8)
        axes[0, 0].set_title('Monthly Spending Trend', fontweight='bold')
        axes[0, 0].set_xticks(range(len(monthly_data)))
        axes[0, 0].set_xticklabels([str(m) for m in monthly_data.index], rotation=45)

        # Client-wise bar chart
        client_data = df.groupby('Client')['Total_Amount'].sum()
        client_labels = [' '.join(c.split()[:2]) for c in client_data.index]  # First two words
        axes[0, 1].bar(client_labels, client_data.values, color='skyblue', edgecolor='black')
        axes[0, 1].set_title('Spending by Client', fontweight='bold')
        axes[0, 1].tick_params(axis='x', rotation=45)

        # Invoice amount distribution
        axes[1, 0].hist(df['Total_Amount'], bins=10, edgecolor='black', alpha=0.7, color='lightgreen')
        axes[1, 0].set_title('Invoice Amount Distribution', fontweight='bold')

        # VAT vs Net
        axes[1, 1].scatter(df['Net_Amount'], df['VAT'], s=100, alpha=0.6, color='coral')
        axes[1, 1].set_title('VAT vs Net Amount', fontweight='bold')
        axes[1, 1].set_xlabel('Net Amount')
        axes[1, 1].set_ylabel('VAT')

        plt.tight_layout()
        plt.show()

    # Future spending prediction
    def predict_future_spending(self, df, months_ahead=6):
        print("\n=== SPENDING PREDICTIONS ===\n")
        df['Month'] = df['Date'].dt.to_period('M')
        monthly_spending = df.groupby('Month')['Total_Amount'].sum()

        if len(monthly_spending) == 0:
            print("No data available for predictions")
            return []

        avg_spending = monthly_spending.mean()
        
        # 安全地计算趋势，避免数学错误
        try:
            if len(monthly_spending) > 1:
                trend = np.polyfit(range(len(monthly_spending)), monthly_spending.values, 1)[0]
            else:
                trend = 0
        except:
            trend = 0

        print(f"Average Monthly Spending: ${avg_spending:.2f}")
        print(f"Spending Trend: ${trend:.2f} per month")

        predictions = []
        last = monthly_spending.iloc[-1] if len(monthly_spending) > 0 else avg_spending
        total_predicted = 0

        for i in range(1, months_ahead + 1):
            predicted = last + (trend * i) + np.random.normal(0, 20)
            predicted = max(predicted, 0)
            predictions.append(predicted)
            total_predicted += predicted
            future_date = datetime.now() + timedelta(days=30 * i)
            print(f"Month {i} ({future_date.strftime('%B %Y')}): ${predicted:.2f}")

        print(f"\nTotal predicted spending: ${total_predicted:.2f}")
        print(f"Average predicted monthly spending: ${total_predicted/months_ahead:.2f}")

        return predictions

    def export_dashboard_json(self, analysis, df, predictions, out_path="public/invoice-dashboard.json"):
        # 聚合：月度
        df['Month'] = df['Date'].dt.to_period('M')
        monthly_spending_series = df.groupby('Month')['Total_Amount'].sum().sort_index()
        monthly_spending = [
            {"month": str(m), "amount": float(v)} for m, v in monthly_spending_series.items()
        ]

        # 聚合：按客户
        client_spending_series = df.groupby('Client')['Total_Amount'].sum().sort_values(ascending=False)
        client_spending = [
            {"client": str(c), "amount": float(v)} for c, v in client_spending_series.items()
        ]

        # 散点：VAT vs Net（逐发票）
        vat_vs_net = [
            {"net": float(row['Net_Amount']), "vat": float(row['VAT'])}
            for _, row in df.iterrows()
        ]

        # 直方：发票金额分布（与前端 InvoiceDistribution 兼容）
        amounts = df['Total_Amount'].values.tolist()
        if len(amounts) > 0:
            min_amt, max_amt = min(amounts), max(amounts)
            bin_count = 5
            if max_amt == min_amt:
                bins = [min_amt, min_amt + 1]
            else:
                step = (max_amt - min_amt) / bin_count
                bins = [min_amt + i * step for i in range(bin_count + 1)]
            # 初始化分桶
            ranges = []
            for i in range(len(bins) - 1):
                low, high = bins[i], bins[i + 1]
                ranges.append({
                    "range": f"${int(low)}-${int(high)}",
                    "count": 0,
                    "totalValue": 0.0
                })
            # 计数
            for val in amounts:
                # 找到所属桶
                idx = None
                for i in range(len(bins) - 1):
                    if (val >= bins[i] and (i == len(bins) - 2 or val < bins[i + 1])):
                        idx = i
                        break
                if idx is None:
                    idx = len(bins) - 2
                ranges[idx]["count"] += 1
                ranges[idx]["totalValue"] += float(val)
            total_cnt = sum(r["count"] for r in ranges) or 1
            for r in ranges:
                r["percentage"] = round(r["count"] * 100.0 / total_cnt, 1)
            invoice_amount_distribution = ranges
        else:
            invoice_amount_distribution = []

        # VAT 分析（总额）
        vat_analysis = [
            {"name": "Net Amount", "value": float(df['Net_Amount'].sum()), "color": "#3B82F6"},
            {"name": "VAT Amount", "value": float(df['VAT'].sum()), "color": "#EF4444"}
        ]

        # 预测结果
        prediction_list = []
        now = datetime.now()
        for i, p in enumerate(predictions, start=1):
            month_label = (now + timedelta(days=30 * i)).strftime('%b')
            prediction_list.append({"month": month_label, "forecast": float(p)})

        payload = {
            "summary": {
                "total_spent": float(analysis.get('total_spent', 0.0)),
                "average_invoice_amount": float(analysis.get('average_invoice_amount', 0.0)),
                "total_vat_paid": float(analysis.get('total_vat_paid', 0.0)),
                "number_of_invoices": int(analysis.get('number_of_invoices', 0)),
                "date_range": {
                    "min": df['Date'].min().strftime('%Y-%m-%d') if len(df) else None,
                    "max": df['Date'].max().strftime('%Y-%m-%d') if len(df) else None
                }
            },
            "monthly_spending": monthly_spending,
            "client_spending": client_spending,
            "vat_vs_net": vat_vs_net,
            "invoice_amount_distribution": invoice_amount_distribution,
            "vat_analysis": vat_analysis,
            "predictions": prediction_list,
            "invoices": [
                {
                    "invoice_no": str(row['Invoice_No']),
                    "date": pd.to_datetime(row['Date']).strftime('%Y-%m-%d'),
                    "total_amount": float(row['Total_Amount']),
                    "vat": float(row['VAT']),
                    "net_amount": float(row['Net_Amount']),
                    "client": str(row['Client'])
                }
                for _, row in df.iterrows()
            ]
        }

        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, 'w') as f:
            json.dump(payload, f, indent=2)
        print(f"\nExported dashboard JSON -> {out_path}")

# -------------------- Main --------------------
def main():
    ocr_engine = InvoiceOCR()
    analyzer = ExpenditureAnalyzer()

    folder_path = "src/assets/invoices"
    print("=== Processing Invoice Images ===\n")
    analyzer.process_invoices_from_folder(folder_path, ocr_engine)

    result = analyzer.analyze_spending_patterns()
    if result is not None:
        analysis_results, df = result
        analyzer.create_visualizations(df)
        predictions = analyzer.predict_future_spending(df, months_ahead=6)
        analyzer.export_dashboard_json(analysis_results, df, predictions)

    print("\n" + "="*50)
    print()

if __name__ == "__main__":
    main()
