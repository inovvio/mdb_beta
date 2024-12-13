export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY'
] as const;

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'China', 
  'India', 'Brazil', 'Russia', 'South Africa', 'Canada', 'Australia',
  'Singapore', 'United Arab Emirates', 'Saudi Arabia'
] as const;

export type Currency = typeof CURRENCIES[number];
export type Country = typeof COUNTRIES[number];

export const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};