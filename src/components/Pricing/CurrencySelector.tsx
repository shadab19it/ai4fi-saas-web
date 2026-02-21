import { cn } from "../../services/utils";
import { CURRENCIES } from "./currencyConfig";

interface CurrencySelectorProps {
  selectedCurrency: string;
  onSelect: (code: string) => void;
}

export const CurrencySelector = ({ selectedCurrency, onSelect }: CurrencySelectorProps) => {
  const usd = CURRENCIES.USD;
  const inr = CURRENCIES.INR;

  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-sm" role="radiogroup" aria-label="Select currency">
      <button
        onClick={() => onSelect("USD")}
        role="radio"
        aria-checked={selectedCurrency === "USD"}
        tabIndex={0}
        aria-label="US Dollar"
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
          selectedCurrency === "USD"
            ? "bg-purple-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-50",
        )}
      >
        <span>{usd.symbol} {usd.code}</span>
      </button>
      <button
        onClick={() => onSelect("INR")}
        role="radio"
        aria-checked={selectedCurrency === "INR"}
        tabIndex={0}
        aria-label="Indian Rupee"
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
          selectedCurrency === "INR"
            ? "bg-purple-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-50",
        )}
      >
        <span>{inr.symbol} {inr.code}</span>
      </button>
    </div>
  );
};
