export const CREDIT_DATA_SUMMARY = [
  { label: 'Total Rows', value: '15,000+' },
  { label: 'Key Features', value: '24' },
  { label: 'Missing Values', value: '1.2%' },
  { label: 'Target Variable', value: 'Loan Status' },
];

export const INCOME_DISTRIBUTION = [
  { range: '0-20k', count: 1200 },
  { range: '20-40k', count: 3400 },
  { range: '40-60k', count: 5600 },
  { range: '60-80k', count: 3100 },
  { range: '80k+', count: 1700 },
];

export const LOAN_STATUS_DATA = [
  { name: 'Approved', value: 72, color: '#10b981' },
  { name: 'Denied', value: 18, color: '#f59e0b' },
  { name: 'Defaulted', value: 10, color: '#ef4444' },
];

export const REPAYMENT_HISTORY_TREND = [
  { month: 'Jan', performance: 85 },
  { month: 'Feb', performance: 88 },
  { month: 'Mar', performance: 82 },
  { month: 'Apr', performance: 91 },
  { month: 'May', performance: 89 },
  { month: 'Jun', performance: 94 },
];

export const CORRELATION_MATRIX = {
  features: ['Income', 'Loan Amt', 'Score', 'Age', 'DTI'],
  data: [
    [1.00, 0.65, 0.42, 0.35, -0.45],
    [0.65, 1.00, 0.12, 0.08, 0.72],
    [0.42, 0.12, 1.00, 0.25, -0.68],
    [0.35, 0.08, 0.25, 1.00, -0.15],
    [-0.45, 0.72, -0.68, -0.15, 1.00],
  ]
};

export const BOXPLOT_DATA = [
  { feature: 'Income', min: 12000, q1: 42000, median: 54000, q3: 72000, max: 150000, unit: '$' },
  { feature: 'Loan Amount', min: 1000, q1: 8000, median: 15000, q3: 28000, max: 110000, unit: '$' },
];

export const SAMPLE_DATA = [
  { id: 1, age: 34, income: '$55,000', loan: '$12,000', score: 720, status: 'Approved' },
  { id: 2, age: 28, income: '$32,000', loan: '$8,000', score: 640, status: 'Approved' },
  { id: 3, age: 45, income: '$120,000', loan: '$50,000', score: 810, status: 'Approved' },
  { id: 4, age: 52, income: '$45,000', loan: '$25,000', score: 580, status: 'Denied' },
  { id: 5, age: 23, income: '$18,000', loan: '$5,000', score: 610, status: 'Defaulted' },
];
