import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { planComparison } from "../../components/Pricing/pricingConfig";
import { PlanCard } from "../../components/Pricing/PlanCard";
import { CurrencySelector } from "../../components/Pricing/CurrencySelector";
import { CreditSlider, CREDIT_STEPS } from "../../components/Pricing/CreditSlider";
import PlanFeatureList, { PlanFeatureRow } from "../../components/Pricing/PlanFeatureList";
import subscriptionService, { SubscriptionPlan, PayUData } from "../../services/subscriptionService";
import { detectCurrency, formatPrice } from "../../components/Pricing/currencyConfig";
import { Loader2 } from "lucide-react";
import authService from "../../services/authService";

const getScaledPrice = (plan: SubscriptionPlan, currency: string, creditCount: number): number => {
  const basePrice = currency === "INR" ? plan.priceINR : plan.price;
  const baseCredits = plan.creditsIncluded || 10;
  return Math.round(basePrice * (creditCount / baseCredits) * 100) / 100;
};

const PricingPage = () => {
  const navigate = useNavigate();
  const payuFormRef = useRef<HTMLFormElement>(null);

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(detectCurrency);
  const [selectedCredits, setSelectedCredits] = useState(CREDIT_STEPS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingPlanId, setPurchasingPlanId] = useState<string | null>(null);
  const [payuData, setPayuData] = useState<PayUData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansData = await subscriptionService.getPlans();
        setPlans(plansData.plans);
      } catch {
        toast.error("Failed to load pricing plans");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (payuData && payuFormRef.current) {
      payuFormRef.current.submit();
    }
  }, [payuData]);

  const handlePurchase = async (plan: SubscriptionPlan) => {
    if (!authService.isAuthenticated()) {
      toast.info("Please login to purchase a plan");
      navigate("/login");
      return;
    }

    if (plan.isComingSoon) {
      toast.info("This plan is coming soon!");
      return;
    }

    if (selectedCurrency === "USD") {
      toast.info("USD payments are coming soon. Please use INR to complete your purchase.");
      return;
    }

    setPurchasingPlanId(plan._id);
    try {
      const orderData = await subscriptionService.createOrder(plan._id, selectedCurrency, selectedCredits);
      setPayuData(orderData.payuData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initiate payment");
      setPurchasingPlanId(null);
    }
  };

  const sortedPlans = [...plans].sort((a, b) => a.displayOrder - b.displayOrder);
  const [silverPlan, goldPlan, platinumPlan] = [
    sortedPlans.find((p) => p.name === "silver"),
    sortedPlans.find((p) => p.name === "gold"),
    sortedPlans.find((p) => p.name === "platinum"),
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="py-16 space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-center bg-gradient-to-r py-2 from-orange-500 to-purple-500 bg-clip-text text-transparent">
          Simple and Affordable <br /> Pricing Plans
        </h1>
        <p className="text-center text-gray-400 text-sm">Choose a plan that fits your business needs</p>
      </div>

      <div className="flex justify-center">
        <CurrencySelector selectedCurrency={selectedCurrency} onSelect={setSelectedCurrency} />
      </div>

      <div className="px-4">
        <CreditSlider value={selectedCredits} onChange={setSelectedCredits} />
      </div>

      <div className="flex flex-col items-center gap-16">
        <div className="flex justify-center gap-6 flex-wrap">
          {sortedPlans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              displayPrice={getScaledPrice(plan, selectedCurrency, selectedCredits)}
              displayCurrency={selectedCurrency}
              creditCount={selectedCredits}
              onPurchase={handlePurchase}
              isPurchasing={purchasingPlanId === plan._id}
            />
          ))}
        </div>

        {silverPlan && goldPlan && platinumPlan && (
          <>
            <h2 className="text-2xl font-semibold">Plan Comparison</h2>
            <div className="flex justify-center flex-wrap">
              <PlanFeatureRow
                label="Features"
                text1={silverPlan.displayName}
                text2={goldPlan.displayName}
                text3={platinumPlan.displayName}
                className="text-lg font-semibold"
                firstRowBorderRadius="rounded-tl-[8px]"
                lastRowBorderRadius="rounded-tr-[8px]"
              />
              <PlanFeatureRow
                label="Credits Included"
                text1={`${selectedCredits} credits`}
                text2={`${selectedCredits} credits`}
                text3={`${selectedCredits} credits`}
              />
              <PlanFeatureRow
                label="Price"
                text1={formatPrice(getScaledPrice(silverPlan, selectedCurrency, selectedCredits), selectedCurrency)}
                text2={formatPrice(getScaledPrice(goldPlan, selectedCurrency, selectedCredits), selectedCurrency)}
                text3={formatPrice(getScaledPrice(platinumPlan, selectedCurrency, selectedCredits), selectedCurrency)}
              />
              {planComparison.map((section, i) => (
                <PlanFeatureList
                  isLastItem={i === planComparison.length - 1}
                  key={section.id}
                  comparison={section}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {payuData && (
        <form ref={payuFormRef} method="POST" action={payuData.action} style={{ display: "none" }}>
          <input name="key" value={payuData.key} readOnly />
          <input name="txnid" value={payuData.txnid} readOnly />
          <input name="amount" value={payuData.amount} readOnly />
          <input name="productinfo" value={payuData.productinfo} readOnly />
          <input name="firstname" value={payuData.firstname} readOnly />
          <input name="email" value={payuData.email} readOnly />
          <input name="phone" value={payuData.phone} readOnly />
          <input name="udf1" value={payuData.udf1} readOnly />
          <input name="udf2" value={payuData.udf2} readOnly />
          <input name="udf3" value={payuData.udf3} readOnly />
          <input name="udf4" value={payuData.udf4} readOnly />
          <input name="udf5" value={payuData.udf5} readOnly />
          <input name="surl" value={payuData.surl} readOnly />
          <input name="furl" value={payuData.furl} readOnly />
          <input name="notify_url" value={payuData.notify_url} readOnly />
          <input name="hash" value={payuData.hash} readOnly />
        </form>
      )}
    </div>
  );
};

export default PricingPage;
