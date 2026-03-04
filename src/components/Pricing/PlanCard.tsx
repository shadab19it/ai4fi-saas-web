import { cn } from "../../services/utils";
import { SubscriptionPlan } from "../../services/subscriptionService";
import { Loader2, PhoneCall } from "lucide-react";
import { formatPrice } from "./currencyConfig";
import { Link } from "react-router-dom";

interface PlanCardProps {
  plan: SubscriptionPlan;
  displayPrice: number;
  displayCurrency: string;
  creditCount: number;
  onPurchase: (plan: SubscriptionPlan) => void;
  isPurchasing?: boolean;
  isCustomMode?: boolean;
}

export const PlanCard = ({ plan, displayPrice, displayCurrency, creditCount, onPurchase, isPurchasing, isCustomMode }: PlanCardProps) => {
  const isDisabled = plan.isComingSoon || isPurchasing;

  const handlePurchase = () => {
    if (isDisabled) return;
    onPurchase(plan);
  };

  const contactParams = new URLSearchParams({
    plan: plan.name,
    credits: creditCount.toString(),
    displayName: plan.displayName,
  }).toString();

  return (
    <div
      className={cn(
        "rounded-[30px] relative border p-6 w-80 h-[280px] text-left transition",
        plan.highlighted && "border-purple-500 scale-105 bg-gradient-to-r from-orange-500 to-purple-500 text-white",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-xl m-0 font-semibold">{plan.displayName}</div>
        {plan.isPopular && (
          <div className="bg-[#000] text-white text-[14px] w-fit p-[5px_10px] rounded-[30px]">Most Popular</div>
        )}
        {plan.isComingSoon && (
          <div className="bg-gray-500 text-white text-[12px] w-fit p-[4px_10px] rounded-[30px]">Coming Soon</div>
        )}
      </div>

      <p className={cn("text-sm mt-3", plan.highlighted ? "text-white/80" : "text-muted-foreground")}>{plan.description}</p>

      {isCustomMode ? (
        <div className="mt-3">
          <p className="text-2xl font-bold">Custom Pricing</p>
          <p className="text-xs mt-1 opacity-80">Tailored for your needs</p>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-1 mt-3">
            <p className="text-4xl font-bold">{formatPrice(displayPrice, displayCurrency)}</p>
          </div>
          <p className="text-xs mt-1 opacity-80">{creditCount} credits included</p>
        </>
      )}

      {isCustomMode ? (
        <Link
          to={`/contact?${contactParams}`}
          aria-label={`Contact sales for ${plan.displayName} plan`}
          className={cn(
            "mt-4 w-full rounded-full py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            plan.highlighted
              ? "bg-white text-purple-600 hover:bg-gray-100"
              : "border border-purple-400 text-purple-600 hover:bg-purple-50",
          )}
        >
          <PhoneCall className="w-4 h-4" />
          Contact Sales
        </Link>
      ) : (
        <button
          onClick={handlePurchase}
          disabled={isDisabled}
          aria-label={`Purchase ${plan.displayName} plan`}
          tabIndex={0}
          className={cn(
            "mt-4 w-full rounded-full py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2",
            plan.highlighted
              ? "bg-white text-purple-600 hover:bg-gray-100"
              : "border border-purple-400 text-purple-600 hover:bg-purple-50",
            isDisabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {isPurchasing && <Loader2 className="w-4 h-4 animate-spin" />}
          {plan.ctaText}
        </button>
      )}
    </div>
  );
};
