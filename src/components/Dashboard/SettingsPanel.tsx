import { FC, useState, useEffect } from "react";
import { toast } from "sonner";
import { Settings, Coins, CreditCard, Save, Loader2 } from "lucide-react";
import adminService from "../../services/adminService";

interface SettingEntry {
  value: any;
  description: string;
}

type AllSettings = Record<string, SettingEntry>;

interface PlanData {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  priceINR: number;
  currency: string;
  creditsIncluded: number;
  durationInDays: number;
  isActive: boolean;
  isComingSoon: boolean;
  isPopular: boolean;
  highlighted: boolean;
  ctaText: string;
}

const CREDIT_COST_KEYS = [
  "creditCost_modelGeneration",
  "creditCost_virtualTryOn",
  "creditCost_tryOnBeta",
  "creditCost_poseVariants",
  "creditCost_productAdPrompt",
  "creditCost_productPreprocessing",
  "creditCost_createAdFromProduct",
  "creditCost_videoAdPrompt",
  "creditCost_generateAdVideo",
  "creditCost_productListingBanner",
  "creditCost_productListingLifestyle",
  "creditsPerImage",
];

const SPECIAL_KEYS = ["supportedCurrencies"];

const formatSettingLabel = (key: string): string => {
  return key
    .replace("creditCost_", "")
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
};

const SettingsPanel: FC = () => {
  const [settings, setSettings] = useState<AllSettings | null>(null);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [planEdits, setPlanEdits] = useState<Record<string, Partial<PlanData>>>({});
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, plansRes] = await Promise.all([
        adminService.getSettings(),
        adminService.getSubscriptionPlans(),
      ]);

      setSettings(settingsRes.settings);
      setPlans(plansRes.plans);

      const initVals: Record<string, string> = {};
      for (const [key, entry] of Object.entries(settingsRes.settings)) {
        if (!SPECIAL_KEYS.includes(key)) {
          initVals[key] = String(entry.value);
        }
      }
      setEditValues(initVals);
    } catch (error: any) {
      toast.error(error.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSetting = async (key: string) => {
    const raw = editValues[key];
    const numValue = Number(raw);
    if (isNaN(numValue) || numValue < 0) {
      toast.error("Value must be a non-negative number");
      return;
    }
    setSavingKey(key);
    try {
      await adminService.updateSetting(key, numValue);
      toast.success(`Updated: ${formatSettingLabel(key)}`);
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update setting");
    } finally {
      setSavingKey(null);
    }
  };

  const handlePlanFieldChange = (planId: string, field: string, value: any) => {
    setPlanEdits((prev) => ({
      ...prev,
      [planId]: { ...prev[planId], [field]: value },
    }));
  };

  const handleSavePlan = async (plan: PlanData) => {
    const edits = planEdits[plan._id];
    if (!edits || Object.keys(edits).length === 0) {
      toast.info("No changes to save");
      return;
    }
    setSavingPlanId(plan._id);
    try {
      await adminService.updateSubscriptionPlan(plan._id, edits);
      toast.success(`Plan "${plan.displayName}" updated`);
      setPlanEdits((prev) => {
        const copy = { ...prev };
        delete copy[plan._id];
        return copy;
      });
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update plan");
    } finally {
      setSavingPlanId(null);
    }
  };

  const getPlanValue = (plan: PlanData, field: keyof PlanData) => {
    const edits = planEdits[plan._id];
    if (edits && edits[field] !== undefined) return edits[field];
    return plan[field];
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E2DA] bg-white p-6 shadow-[0_1px_3px_rgba(28,25,23,0.06)]">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#0F62FE]" />
        </div>
      </div>
    );
  }

  const generalSettings = settings
    ? Object.entries(settings).filter(([key]) => !CREDIT_COST_KEYS.includes(key) && !SPECIAL_KEYS.includes(key))
    : [];

  const creditSettings = settings
    ? Object.entries(settings).filter(([key]) => CREDIT_COST_KEYS.includes(key))
    : [];

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden">
        <div className="px-6 py-[18px] border-b border-[#E5E2DA] flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#EEF3FF] flex items-center justify-center">
            <Settings className="h-[18px] w-[18px] text-[#0F62FE]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-stone-900">General Settings</h2>
            <p className="text-xs text-[#9E9893] mt-0.5">Platform-wide configuration</p>
          </div>
        </div>

        {generalSettings.map(([key, entry]) => (
          <div key={key} className="px-6 py-4 border-b border-[#E5E2DA] last:border-b-0">
            <h3 className="text-[13.5px] font-bold text-stone-900 mb-0.5">{formatSettingLabel(key)}</h3>
            <p className="text-[12px] text-[#6B6560] mb-2">{entry.description}</p>
            <div className="flex items-center gap-2.5 max-w-[360px]">
              <input
                type="number"
                min="0"
                value={editValues[key] ?? ""}
                onChange={(e) => setEditValues((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-[120px] h-9 px-3 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/10 transition-all"
                aria-label={`Edit ${formatSettingLabel(key)}`}
              />
              <button
                onClick={() => handleSaveSetting(key)}
                disabled={savingKey === key}
                className="h-9 px-4 rounded-lg bg-[#0F62FE] text-white text-[13px] font-semibold hover:bg-[#0047B3] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                aria-label={`Save ${formatSettingLabel(key)}`}
              >
                {savingKey === key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Credit Cost Settings */}
      <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden">
        <div className="px-6 py-[18px] border-b border-[#E5E2DA] flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#FFF4E5] flex items-center justify-center">
            <Coins className="h-[18px] w-[18px] text-orange-500" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-stone-900">Credit Cost per Service</h2>
            <p className="text-xs text-[#9E9893] mt-0.5">How many credits each service deducts per use</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5E2DA]">
          {creditSettings.map(([key, entry]) => (
            <div key={key} className="px-6 py-4 border-b border-[#E5E2DA]">
              <h3 className="text-[13px] font-semibold text-stone-900 mb-0.5">{formatSettingLabel(key)}</h3>
              <p className="text-[11.5px] text-[#6B6560] mb-2">{entry.description}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={editValues[key] ?? ""}
                  onChange={(e) => setEditValues((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-[80px] h-8 px-2.5 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/10 transition-all"
                  aria-label={`Edit ${formatSettingLabel(key)}`}
                />
                <button
                  onClick={() => handleSaveSetting(key)}
                  disabled={savingKey === key}
                  className="h-8 px-3 rounded-lg bg-[#0F62FE] text-white text-[12px] font-semibold hover:bg-[#0047B3] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  aria-label={`Save ${formatSettingLabel(key)}`}
                >
                  {savingKey === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden">
        <div className="px-6 py-[18px] border-b border-[#E5E2DA] flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[#E8F5E9] flex items-center justify-center">
            <CreditCard className="h-[18px] w-[18px] text-green-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-stone-900">Subscription Plans</h2>
            <p className="text-xs text-[#9E9893] mt-0.5">Manage pricing (USD & INR), credits, and plan visibility</p>
          </div>
        </div>

        <div className="divide-y divide-[#E5E2DA]">
          {plans.map((plan) => (
            <div key={plan._id} className="px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-stone-900 capitalize">{plan.displayName}</h3>
                <div className="flex items-center gap-2 text-xs">
                  {plan.isActive && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>}
                  {plan.isComingSoon && <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Coming Soon</span>}
                  {plan.isPopular && <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Popular</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-[#6B6560] uppercase tracking-wide">Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={getPlanValue(plan, "price") as number}
                    onChange={(e) => handlePlanFieldChange(plan._id, "price", Number(e.target.value))}
                    className="mt-1 w-full h-8 px-2.5 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] transition-all"
                    aria-label={`USD Price for ${plan.displayName}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#6B6560] uppercase tracking-wide">Price (₹ INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={getPlanValue(plan, "priceINR") as number}
                    onChange={(e) => handlePlanFieldChange(plan._id, "priceINR", Number(e.target.value))}
                    className="mt-1 w-full h-8 px-2.5 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] transition-all"
                    aria-label={`INR Price for ${plan.displayName}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#6B6560] uppercase tracking-wide">Credits Included</label>
                  <input
                    type="number"
                    min="0"
                    value={getPlanValue(plan, "creditsIncluded") as number}
                    onChange={(e) => handlePlanFieldChange(plan._id, "creditsIncluded", Number(e.target.value))}
                    className="mt-1 w-full h-8 px-2.5 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] transition-all"
                    aria-label={`Credits for ${plan.displayName}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#6B6560] uppercase tracking-wide">Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    value={getPlanValue(plan, "durationInDays") as number}
                    onChange={(e) => handlePlanFieldChange(plan._id, "durationInDays", Number(e.target.value))}
                    className="mt-1 w-full h-8 px-2.5 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] transition-all"
                    aria-label={`Duration for ${plan.displayName}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#6B6560] uppercase tracking-wide">CTA Text</label>
                  <input
                    type="text"
                    value={getPlanValue(plan, "ctaText") as string}
                    onChange={(e) => handlePlanFieldChange(plan._id, "ctaText", e.target.value)}
                    className="mt-1 w-full h-8 px-2.5 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 outline-none focus:border-[#0F62FE] transition-all"
                    aria-label={`CTA text for ${plan.displayName}`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <label className="flex items-center gap-1.5 text-[12px] text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!getPlanValue(plan, "isActive")}
                    onChange={(e) => handlePlanFieldChange(plan._id, "isActive", e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  Active
                </label>
                <label className="flex items-center gap-1.5 text-[12px] text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!getPlanValue(plan, "isComingSoon")}
                    onChange={(e) => handlePlanFieldChange(plan._id, "isComingSoon", e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  Coming Soon
                </label>
                <label className="flex items-center gap-1.5 text-[12px] text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!getPlanValue(plan, "isPopular")}
                    onChange={(e) => handlePlanFieldChange(plan._id, "isPopular", e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  Popular
                </label>
                <label className="flex items-center gap-1.5 text-[12px] text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!getPlanValue(plan, "highlighted")}
                    onChange={(e) => handlePlanFieldChange(plan._id, "highlighted", e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  Highlighted
                </label>

                <button
                  onClick={() => handleSavePlan(plan)}
                  disabled={savingPlanId === plan._id || !planEdits[plan._id]}
                  className="ml-auto h-8 px-4 rounded-lg bg-green-600 text-white text-[12px] font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                  aria-label={`Save ${plan.displayName} plan changes`}
                >
                  {savingPlanId === plan._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
