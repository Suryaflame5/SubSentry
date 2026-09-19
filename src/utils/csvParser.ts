import { Transaction } from '../types';
import { normalizeMerchant } from './recurrenceEngine';

export interface CSVParseResult {
  success: boolean;
  transactions: Transaction[];
  error?: string;
  rowCount: number;
}

/**
 * Parses raw CSV text into Transaction records with validation.
 */
export function parseTransactionCSV(csvText: string): CSVParseResult {
  const cleanText = csvText.trim();
  if (!cleanText) {
    return {
      success: false,
      transactions: [],
      error: 'The uploaded file is empty. Please select a CSV containing transaction records.',
      rowCount: 0,
    };
  }

  // Split lines accounting for \r\n and \n
  const rawLines = cleanText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (rawLines.length < 2) {
    return {
      success: false,
      transactions: [],
      error: 'CSV must contain a header row and at least one transaction row.',
      rowCount: 0,
    };
  }

  // Helper to parse a CSV line considering quotes
  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const headers = parseLine(rawLines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  // Detect column indices
  let dateIdx = -1;
  let descIdx = -1;
  let amountIdx = -1;
  let categoryIdx = -1;

  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if (dateIdx === -1 && (h.includes('date') || h.includes('time') || h === 'dt')) {
      dateIdx = i;
    } else if (
      descIdx === -1 &&
      (h.includes('desc') ||
        h.includes('merchant') ||
        h.includes('narr') ||
        h.includes('detail') ||
        h.includes('particular') ||
        h.includes('payee') ||
        h.includes('name'))
    ) {
      descIdx = i;
    } else if (
      amountIdx === -1 &&
      (h.includes('amount') || h.includes('debit') || h.includes('cost') || h.includes('price') || h === 'amt')
    ) {
      amountIdx = i;
    } else if (categoryIdx === -1 && (h.includes('cat') || h.includes('type') || h.includes('group'))) {
      categoryIdx = i;
    }
  }

  const missingCols: string[] = [];
  if (dateIdx === -1) missingCols.push('Date');
  if (descIdx === -1) missingCols.push('Description/Merchant');
  if (amountIdx === -1) missingCols.push('Amount/Debit');

  if (missingCols.length > 0) {
    return {
      success: false,
      transactions: [],
      error: `Missing required column(s): ${missingCols.join(
        ', '
      )}. Required headers: Date, Description, Amount.`,
      rowCount: 0,
    };
  }

  const transactions: Transaction[] = [];

  for (let r = 1; r < rawLines.length; r++) {
    const rowValues = parseLine(rawLines[r]);
    if (rowValues.length < 3) continue;

    const rawDate = rowValues[dateIdx] || '';
    const rawDesc = rowValues[descIdx] || '';
    const rawAmount = rowValues[amountIdx] || '';
    const rawCategory = categoryIdx !== -1 ? rowValues[categoryIdx] : undefined;

    if (!rawDate || !rawDesc || !rawAmount) continue;

    // Parse date (support YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY)
    let parsedDate = '';
    const isoMatch = rawDate.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    const dmyMatch = rawDate.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);

    if (isoMatch) {
      const [, y, m, d] = isoMatch;
      parsedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    } else if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      parsedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    } else {
      const timestamp = Date.parse(rawDate);
      if (!isNaN(timestamp)) {
        parsedDate = new Date(timestamp).toISOString().split('T')[0];
      }
    }

    if (!parsedDate) {
      parsedDate = new Date().toISOString().split('T')[0];
    }

    // Clean amount (remove currency symbols, commas)
    const cleanedAmountStr = rawAmount.replace(/[₹$€£,\s]/g, '').replace(/[()]/g, '');
    const parsedAmount = Math.abs(parseFloat(cleanedAmountStr));

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      continue;
    }

    const { normalized, category: detectedCategory } = normalizeMerchant(rawDesc);

    transactions.push({
      id: `tx-imp-${r.toString().padStart(3, '0')}`,
      date: parsedDate,
      merchantRaw: rawDesc,
      merchantNormalized: normalized,
      description: rawDesc,
      amount: parsedAmount,
      category: rawCategory || detectedCategory,
      isRecurring: false,
      recurrenceConfidence: 0,
      status: 'active',
      paymentMethod: 'Imported Record',
    });
  }

  if (transactions.length === 0) {
    return {
      success: false,
      transactions: [],
      error: 'No valid transaction records could be parsed. Check column formats and numbers.',
      rowCount: 0,
    };
  }

  return {
    success: true,
    transactions,
    rowCount: transactions.length,
  };
}

/**
 * Generates a downloadable CSV template containing realistic benchmark transactions.
 */
export function generateCSVTemplate(): string {
  return `Date,Description,Amount,Category
2026-01-04,ADOBE *CREATIVE CLOUD 800-833-6687 US,1675,Software
2026-02-03,ADOBE *CREATIVE CLOUD 800-833-6687 US,1675,Software
2026-03-05,ADOBE *CREATIVE CLOUD 800-833-6687 US,1675,Software
2026-04-04,ADOBE *CREATIVE CLOUD 800-833-6687 US,1675,Software
2026-05-04,ADOBE *CREATIVE CLOUD 800-833-6687 US,1675,Software
2026-01-14,NETFLIX.COM PAYMENT MUMBAI IN,649,Entertainment
2026-02-14,NETFLIX.COM PAYMENT MUMBAI IN,649,Entertainment
2026-03-14,NETFLIX.COM PAYMENT MUMBAI IN,649,Entertainment
2026-04-14,NETFLIX.COM PAYMENT MUMBAI IN,649,Entertainment
2026-05-14,NETFLIX.COM PAYMENT MUMBAI IN,649,Entertainment
2026-01-20,SPOTIFY INDIA SERVICES PVT LTD,119,Entertainment
2026-02-19,SPOTIFY INDIA SERVICES PVT LTD,119,Entertainment
2026-03-21,SPOTIFY INDIA SERVICES PVT LTD,119,Entertainment
2026-04-20,SPOTIFY INDIA SERVICES PVT LTD,119,Entertainment
2026-05-20,SPOTIFY INDIA SERVICES PVT LTD,119,Entertainment
2026-02-01,AMAZON WEB SERVICES AWS.AMAZON.CO WA,1240,Cloud Services
2026-03-03,AMAZON WEB SERVICES AWS.AMAZON.CO WA,1240,Cloud Services
2026-04-02,AMAZON WEB SERVICES AWS.AMAZON.CO WA,1240,Cloud Services
2026-05-03,AMAZON WEB SERVICES AWS.AMAZON.CO WA,1240,Cloud Services
2026-01-10,GOOGLE *GOOGLE STORAGE G.CO/HELPPAY,130,Cloud Services
2026-02-10,GOOGLE *GOOGLE STORAGE G.CO/HELPPAY,130,Cloud Services
2026-03-10,GOOGLE *GOOGLE STORAGE G.CO/HELPPAY,130,Cloud Services
2026-04-10,GOOGLE *GOOGLE STORAGE G.CO/HELPPAY,130,Cloud Services
2026-05-10,GOOGLE *GOOGLE STORAGE G.CO/HELPPAY,130,Cloud Services
2026-01-08,NOTION LABS INC SAN FRANCISCO CA,800,Software
2026-02-08,NOTION LABS INC SAN FRANCISCO CA,800,Software
2026-03-08,NOTION LABS INC SAN FRANCISCO CA,800,Software
2026-04-08,NOTION LABS INC SAN FRANCISCO CA,800,Software
2026-05-08,NOTION LABS INC SAN FRANCISCO CA,800,Software
2026-02-18,GITHUB INC GITHUB.COM SAN FRANCISCO,627,Software
2026-03-18,GITHUB INC GITHUB.COM SAN FRANCISCO,627,Software
2026-04-18,GITHUB INC GITHUB.COM SAN FRANCISCO,627,Software
2026-05-18,GITHUB INC GITHUB.COM SAN FRANCISCO,627,Software
2026-04-15,SWIGGY INSTAMART BANGALORE IN,430,Groceries
2026-04-22,ZEPTO QUICK COMMERCE MUMBAI IN,380,Groceries
2026-05-01,BESCOM ELECTRICITY BANGALORE IN,1850,Utilities
2026-05-02,HPCL FUEL STATION KORAMANGALA,2400,Transport
2026-04-19,THIRD WAVE COFFEE ROASTERS,280,Food & Dining
2026-03-12,KEYCHRON WIRELESS KEYBOARD ONLINE,8999,Electronics
2026-04-02,AMAZON REFUND AMZN.IN/RETURNS,-1299,Refunds`;
}
