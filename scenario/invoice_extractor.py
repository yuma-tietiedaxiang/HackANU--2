# Invoice OCR and Expenditure Analysis
# Google Colab Implementation

# Install required packages
!pip install pytesseract pillow pandas matplotlib seaborn numpy opencv-python
!apt update
!apt install tesseract-ocr

import cv2
import pytesseract
from PIL import Image
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re
from datetime import datetime, timedelta
from collections import defaultdict
import warnings
warnings.filterwarnings('ignore')

class InvoiceOCR:
    def __init__(self):
        # Configure tesseract path for Colab
        pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
        
    def preprocess_image(self, image_path):
        """Preprocess image for better OCR results"""
        # Read image
        img = cv2.imread(image_path)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply denoising
        denoised = cv2.fastNlMeansDenoising(gray)
        
        # Apply threshold to get binary image
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Dilation and erosion to remove noise
        kernel = np.ones((1,1), np.uint8)
        img_processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        
        return img_processed
    
    def extract_text_from_image(self, image_path):
        """Extract text from image using OCR"""
        try:
            # Preprocess image
            processed_img = self.preprocess_image(image_path)
            
            # Perform OCR
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(processed_img, config=custom_config)
            
            return text
        except Exception as e:
            print(f"Error extracting text: {e}")
            return ""
    
    def parse_invoice_data(self, text):
        """Parse invoice data from extracted text"""
        invoice_data = {}
        items = []
        
        # Extract invoice number
        invoice_pattern = r'Invoice\s+no[:\s]+([A-Z0-9\-]+)'
        match = re.search(invoice_pattern, text, re.IGNORECASE)
        invoice_data['invoice_no'] = match.group(1) if match else "Not found"
        
        # Extract date
        date_pattern = r'Date\s+of\s+issue[:\s]+(\d{2}/\d{2}/\d{4})'
        match = re.search(date_pattern, text, re.IGNORECASE)
        invoice_data['date'] = match.group(1) if match else "Not found"
        
        # Extract seller info
        seller_pattern = r'Seller[:\s]+(.*?)(?=Client:|Tax Id:)'
        match = re.search(seller_pattern, text, re.IGNORECASE | re.DOTALL)
        invoice_data['seller'] = match.group(1).strip() if match else "Not found"
        
        # Extract client info
        client_pattern = r'Client[:\s]+(.*?)(?=Tax Id:|IBAN:)'
        match = re.search(client_pattern, text, re.IGNORECASE | re.DOTALL)
        invoice_data['client'] = match.group(1).strip() if match else "Not found"
        
        # Extract total amount
        total_pattern = r'Total\s+\$\s*([\d,]+\.?\d*)'
        match = re.search(total_pattern, text, re.IGNORECASE)
        invoice_data['total_amount'] = float(match.group(1).replace(',', '')) if match else 0.0
        
        # Extract VAT
        vat_pattern = r'VAT\s+\$\s*([\d,]+\.?\d*)'
        match = re.search(vat_pattern, text, re.IGNORECASE)
        invoice_data['vat'] = float(match.group(1).replace(',', '')) if match else 0.0
        
        # Extract net amount
        net_pattern = r'Net worth\s+\$\s*([\d,]+\.?\d*)'
        match = re.search(net_pattern, text, re.IGNORECASE)
        invoice_data['net_amount'] = float(match.group(1).replace(',', '')) if match else 0.0
        
        # Extract items (simplified approach)
        # This is a basic implementation - you might need to adjust based on actual image structure
        item_lines = re.findall(r'(\d+\.?\d*)\s+each\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)\s+10%\s+([\d,]+\.?\d*)', text)
        
        for i, item_line in enumerate(item_lines):
            items.append({
                'item_no': i + 1,
                'description': f"Item {i + 1}",  # Would need better parsing for actual description
                'quantity': float(item_line[0]),
                'unit_price': float(item_line[1].replace(',', '')),
                'net_worth': float(item_line[2].replace(',', '')),
                'gross_worth': float(item_line[3].replace(',', ''))
            })
        
        invoice_data['items'] = items
        return invoice_data

class ExpenditureAnalyzer:
    def __init__(self):
        self.invoices_data = []
        
    def add_invoice_data(self, invoice_data):
        """Add invoice data to the analyzer"""
        self.invoices_data.append(invoice_data)
    
    def create_sample_data(self):
        """Create sample data based on the provided invoice"""
        sample_invoices = [
            {
                'invoice_no': '84652373',
                'date': '02/23/2021',
                'total_amount': 232.95,
                'vat': 21.18,
                'net_amount': 211.77,
                'category': 'Kitchen & Dining',
                'items': [
                    {'description': 'Stemware Rack Display Kitchen', 'amount': 46.55},
                    {'description': 'Wine Glass Holder', 'amount': 15.40},
                    {'description': 'Milk Bottle Wine Carafe', 'amount': 39.00},
                    {'description': 'Ikea Wine Rack', 'amount': 110.00},
                    {'description': 'Lolita Wine Glass', 'amount': 22.00}
                ]
            },
            # Generate additional sample data for better analysis
            {
                'invoice_no': '84652374',
                'date': '03/15/2021',
                'total_amount': 156.50,
                'vat': 15.65,
                'net_amount': 140.85,
                'category': 'Kitchen & Dining',
                'items': [
                    {'description': 'Coffee Maker', 'amount': 89.50},
                    {'description': 'Kitchen Utensils Set', 'amount': 67.00}
                ]
            },
            {
                'invoice_no': '84652375',
                'date': '04/10/2021',
                'total_amount': 445.20,
                'vat': 44.52,
                'net_amount': 400.68,
                'category': 'Electronics',
                'items': [
                    {'description': 'Bluetooth Speaker', 'amount': 245.20},
                    {'description': 'Wireless Headphones', 'amount': 200.00}
                ]
            }
        ]
        
        self.invoices_data = sample_invoices
        return sample_invoices
    
    def analyze_spending_patterns(self):
        """Analyze spending patterns from invoice data"""
        if not self.invoices_data:
            print("No invoice data available for analysis")
            return
        
        # Create DataFrame
        df_data = []
        for invoice in self.invoices_data:
            df_data.append({
                'Invoice_No': invoice['invoice_no'],
                'Date': pd.to_datetime(invoice['date']),
                'Total_Amount': invoice['total_amount'],
                'VAT': invoice['vat'],
                'Net_Amount': invoice['net_amount'],
                'Category': invoice.get('category', 'General')
            })
        
        df = pd.DataFrame(df_data)
        
        # Analysis results
        analysis = {}
        
        # Basic statistics
        analysis['total_spent'] = df['Total_Amount'].sum()
        analysis['average_invoice_amount'] = df['Total_Amount'].mean()
        analysis['total_vat_paid'] = df['VAT'].sum()
        analysis['number_of_invoices'] = len(df)
        
        # Monthly spending
        df['Month'] = df['Date'].dt.to_period('M')
        monthly_spending = df.groupby('Month')['Total_Amount'].sum()
        analysis['monthly_spending'] = monthly_spending
        
        # Category analysis
        category_spending = df.groupby('Category')['Total_Amount'].sum()
        analysis['category_spending'] = category_spending
        
        # Display results
        print("=== EXPENDITURE ANALYSIS ===\n")
        print(f"Total Amount Spent: ${analysis['total_spent']:.2f}")
        print(f"Average Invoice Amount: ${analysis['average_invoice_amount']:.2f}")
        print(f"Total VAT Paid: ${analysis['total_vat_paid']:.2f}")
        print(f"Number of Invoices: {analysis['number_of_invoices']}")
        print(f"Date Range: {df['Date'].min().strftime('%Y-%m-%d')} to {df['Date'].max().strftime('%Y-%m-%d')}")
        
        return analysis, df
    
    def create_visualizations(self, df):
        """Create visualizations for expenditure analysis"""
        plt.style.use('default')
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Expenditure Analysis Dashboard', fontsize=16, fontweight='bold')
        
        # 1. Monthly spending trend
        df['Month'] = df['Date'].dt.to_period('M')
        monthly_data = df.groupby('Month')['Total_Amount'].sum()
        axes[0, 0].plot(range(len(monthly_data)), monthly_data.values, marker='o', linewidth=2, markersize=8)
        axes[0, 0].set_title('Monthly Spending Trend', fontweight='bold')
        axes[0, 0].set_xlabel('Month')
        axes[0, 0].set_ylabel('Amount ($)')
        axes[0, 0].grid(True, alpha=0.3)
        axes[0, 0].set_xticks(range(len(monthly_data)))
        axes[0, 0].set_xticklabels([str(m) for m in monthly_data.index], rotation=45)
        
        # 2. Category spending pie chart
        category_data = df.groupby('Category')['Total_Amount'].sum()
        axes[0, 1].pie(category_data.values, labels=category_data.index, autopct='%1.1f%%', startangle=90)
        axes[0, 1].set_title('Spending by Category', fontweight='bold')
        
        # 3. Invoice amounts distribution
        axes[1, 0].hist(df['Total_Amount'], bins=10, edgecolor='black', alpha=0.7, color='skyblue')
        axes[1, 0].set_title('Invoice Amount Distribution', fontweight='bold')
        axes[1, 0].set_xlabel('Invoice Amount ($)')
        axes[1, 0].set_ylabel('Frequency')
        axes[1, 0].grid(True, alpha=0.3)
        
        # 4. VAT vs Net Amount
        axes[1, 1].scatter(df['Net_Amount'], df['VAT'], s=100, alpha=0.6, color='coral')
        axes[1, 1].set_title('VAT vs Net Amount', fontweight='bold')
        axes[1, 1].set_xlabel('Net Amount ($)')
        axes[1, 1].set_ylabel('VAT ($)')
        axes[1, 1].grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.show()
    
    def predict_future_spending(self, df, months_ahead=6):
        """Predict future spending based on historical data"""
        print("\n=== SPENDING PREDICTIONS ===\n")
        
        # Calculate monthly averages
        df['Month'] = df['Date'].dt.to_period('M')
        monthly_spending = df.groupby('Month')['Total_Amount'].sum()
        
        # Simple trend analysis
        average_monthly_spending = monthly_spending.mean()
        spending_trend = np.polyfit(range(len(monthly_spending)), monthly_spending.values, 1)[0]
        
        print(f"Average Monthly Spending: ${average_monthly_spending:.2f}")
        print(f"Spending Trend: ${spending_trend:.2f} per month")
        
        # Generate predictions
        predictions = []
        last_month_spending = monthly_spending.iloc[-1] if len(monthly_spending) > 0 else average_monthly_spending
        
        print(f"\nPredicted spending for next {months_ahead} months:")
        print("-" * 40)
        
        total_predicted = 0
        for i in range(1, months_ahead + 1):
            # Simple linear prediction with some randomness
            predicted_amount = last_month_spending + (spending_trend * i) + np.random.normal(0, 20)
            predicted_amount = max(predicted_amount, 0)  # Ensure non-negative
            predictions.append(predicted_amount)
            total_predicted += predicted_amount
            
            future_date = datetime.now() + timedelta(days=30 * i)
            print(f"Month {i} ({future_date.strftime('%B %Y')}): ${predicted_amount:.2f}")
        
        print(f"\nTotal predicted spending: ${total_predicted:.2f}")
        print(f"Average predicted monthly spending: ${total_predicted/months_ahead:.2f}")
        
        # Spending recommendations
        print("\n=== SPENDING RECOMMENDATIONS ===\n")
        if spending_trend > 0:
            print("📈 Your spending is trending upward.")
            print("💡 Consider setting a monthly budget cap")
            print("💡 Review recurring expenses and subscriptions")
        else:
            print("📉 Your spending is stable or decreasing.")
            print("💡 Good job maintaining spending control!")
        
        print(f"💡 Based on current trends, budget approximately ${total_predicted/months_ahead:.2f} per month")
        
        return predictions

# Main execution function
def main():
    # Initialize classes
    ocr_engine = InvoiceOCR()
    analyzer = ExpenditureAnalyzer()
    
    print("=== INVOICE OCR AND EXPENDITURE ANALYSIS SYSTEM ===\n")
    
    # For demonstration, we'll use sample data
    # In practice, you would use: text = ocr_engine.extract_text_from_image('path_to_your_image.jpg')
    
    print("Creating sample data based on provided invoice...")
    sample_data = analyzer.create_sample_data()
    
    # Perform analysis
    analysis_results, df = analyzer.analyze_spending_patterns()
    
    # Create visualizations
    analyzer.create_visualizations(df)
    
    # Generate predictions
    predictions = analyzer.predict_future_spending(df, months_ahead=6)
    
    print("\n" + "="*50)
    print("Analysis complete! 📊")
    print("="*50)

# Function to process your own image
def process_invoice_image(image_path):
    """Process a real invoice image"""
    ocr_engine = InvoiceOCR()
    analyzer = ExpenditureAnalyzer()
    
    print(f"Processing image: {image_path}")
    
    # Extract text from image
    extracted_text = ocr_engine.extract_text_from_image(image_path)
    print("Extracted Text:")
    print("-" * 50)
    print(extracted_text)
    print("-" * 50)
    
    # Parse invoice data
    invoice_data = ocr_engine.parse_invoice_data(extracted_text)
    print("\nParsed Invoice Data:")
    for key, value in invoice_data.items():
        if key != 'items':
            print(f"{key}: {value}")
    
    # Add to analyzer and perform analysis
    analyzer.add_invoice_data(invoice_data)
    # You would add more invoices here for comprehensive analysis
    
    return invoice_data

# Run the main analysis
if __name__ == "__main__":
    main()

# To process your own image, uncomment and use:
# invoice_data = process_invoice_image('path_to_your_invoice_image.jpg')