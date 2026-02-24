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
      {/* USD — Coming Soon */}
      <div className="relative">
        <button
          disabled
          role="radio"
          aria-checked={false}
          aria-disabled="true"
          aria-label="US Dollar (coming soon)"
          tabIndex={-1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-gray-400 cursor-not-allowed opacity-60"
        >
          <span>{usd.symbol} {usd.code}</span>
        </button>
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-gray-400 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap leading-none">
          Soon
        </span>
      </div>

      {/* INR — Active */}
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
