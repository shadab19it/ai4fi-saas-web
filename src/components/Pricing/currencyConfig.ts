export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  country: string;
  flag: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", country: "United States", flag: "🇺🇸", locale: "en-US", decimals: 2 },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India", flag: "🇮🇳", locale: "en-IN", decimals: 0 },
};

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = Object.values(CURRENCIES);

export const DEFAULT_CURRENCY = "USD";

export const getCurrencyInfo = (code: string): CurrencyInfo =>
  CURRENCIES[code] || CURRENCIES.USD;

export const formatPrice = (amount: number, currencyCode: string): string => {
  const info = getCurrencyInfo(currencyCode);
  return new Intl.NumberFormat(info.locale, {
    style: "currency",
    currency: info.code,
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  }).format(amount);
};

export const detectCurrency = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const tzLower = tz.toLowerCase();
    if (tzLower.startsWith("asia/kolkata") || tzLower.startsWith("asia/calcutta") || tzLower.startsWith("asia/mumbai")) {
      return "INR";
    }
  } catch {
    // fallback
  }
  return "USD";
};
