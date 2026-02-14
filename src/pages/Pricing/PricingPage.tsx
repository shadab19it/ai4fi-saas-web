import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setUserRefresh } from "../../store/userReducer";
import { planComparison } from "../../components/Pricing/pricingConfig";
import { PlanCard } from "../../components/Pricing/PlanCard";
import { CurrencySelector } from "../../components/Pricing/CurrencySelector";
import { PaymentCheckoutModal } from "../../components/Pricing/PaymentCheckoutModal";
import PlanFeatureList, { PlanFeatureRow } from "../../components/Pricing/PlanFeatureList";
import subscriptionService, { SubscriptionPlan, CreateOrderResponse } from "../../services/subscriptionService";
import { detectCurrency, formatPrice } from "../../components/Pricing/currencyConfig";
import { Loader2 } from "lucide-react";
import authService from "../../services/authService";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const getPlanPrice = (plan: SubscriptionPlan, currency: string): number =>
  currency === "INR" ? plan.priceINR : plan.price;

interface CheckoutState {
  plan: SubscriptionPlan;
  orderData: CreateOrderResponse;
  displayPrice: number;
}

const PricingPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(detectCurrency);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingPlanId, setPurchasingPlanId] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);

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

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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

    setPurchasingPlanId(plan._id);
    try {
      const orderData = await subscriptionService.createOrder(plan._id, selectedCurrency);

      if (orderData.order.mode === "manual") {
        setCheckout({
          plan,
          orderData,
          displayPrice: getPlanPrice(plan, selectedCurrency),
        });
        return;
      }

      // Razorpay flow
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment provider");
        return;
      }

      const options = {
        key: orderData.order.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "AI4FI",
        description: `${plan.displayName} Plan - ${plan.creditsIncluded} credits`,
        order_id: orderData.order.orderId,
        prefill: {
          email: user?.email || "",
          name: user?.username || "",
        },
        theme: { color: "#7C3AED" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const result = await subscriptionService.verifyPayment({
              paymentId: orderData.paymentId,
              providerPaymentId: response.razorpay_payment_id,
              providerSignature: response.razorpay_signature,
            });
            toast.success(result.message);
            dispatch(setUserRefresh());
          } catch {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => toast.info("Payment cancelled"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initiate payment");
    } finally {
      setPurchasingPlanId(null);
    }
  };

  const handleCheckoutConfirm = async () => {
    if (!checkout) return;
    const result = await subscriptionService.verifyPayment({
      paymentId: checkout.orderData.paymentId,
    });
    toast.success(result.message);
    dispatch(setUserRefresh());
  };

  const handleCheckoutClose = () => {
    setCheckout(null);
    setPurchasingPlanId(null);
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

      <div className="flex flex-col items-center gap-16">
        <div className="flex justify-center gap-6 flex-wrap">
          {sortedPlans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              displayPrice={getPlanPrice(plan, selectedCurrency)}
              displayCurrency={selectedCurrency}
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
                text1={`${silverPlan.creditsIncluded} credits`}
                text2={`${goldPlan.creditsIncluded} credits`}
                text3={`${platinumPlan.creditsIncluded} credits`}
              />
              <PlanFeatureRow
                label="Price"
                text1={formatPrice(getPlanPrice(silverPlan, selectedCurrency), selectedCurrency)}
                text2={formatPrice(getPlanPrice(goldPlan, selectedCurrency), selectedCurrency)}
                text3={formatPrice(getPlanPrice(platinumPlan, selectedCurrency), selectedCurrency)}
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

      {checkout && (
        <PaymentCheckoutModal
          isOpen={!!checkout}
          onClose={handleCheckoutClose}
          onConfirm={handleCheckoutConfirm}
          planName={checkout.plan.displayName}
          price={checkout.displayPrice}
          currency={selectedCurrency}
          creditsIncluded={checkout.plan.creditsIncluded}
        />
      )}
    </div>
  );
};

export default PricingPage;
