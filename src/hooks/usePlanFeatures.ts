import { useState, useEffect, useCallback, useMemo } from "react";
import subscriptionService, { PlanFeatures } from "../services/subscriptionService";

const CACHE_KEY = "ai4fi_plan_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedPlan {
  planName: string | null;
  features: PlanFeatures | null;
  ts: number;
}

const readCache = (): CachedPlan | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: CachedPlan = JSON.parse(raw);
    if (Date.now() - data.ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const writeCache = (planName: string | null, features: PlanFeatures | null) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ planName, features, ts: Date.now() }));
  } catch { /* ignore quota errors */ }
};

export const invalidatePlanCache = () => sessionStorage.removeItem(CACHE_KEY);

const RESOLUTION_RANK: Record<string, number> = { "1K": 1, "2K": 2, "4K": 3 };

export function usePlanFeatures() {
  const [planName, setPlanName] = useState<string | null>(null);
  const [features, setFeatures] = useState<PlanFeatures | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setPlanName(cached.planName);
      setFeatures(cached.features);
      setLoading(false);
      return;
    }

    let cancelled = false;
    subscriptionService
      .getMySubscription()
      .then((res) => {
        if (cancelled) return;
        const plan = res.subscription?.plan;
        const name = plan?.name ?? null;
        const feat = plan?.features ?? null;
        setPlanName(name);
        setFeatures(feat);
        writeCache(name, feat);
      })
      .catch(() => {
        if (!cancelled) {
          setPlanName(null);
          setFeatures(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const isResolutionAllowed = useCallback(
    (resolution: string): boolean => {
      if (!resolution) return true;
      const upper = resolution.toUpperCase();
      // No plan = free tier (Silver-level): HD only
      if (!features) return upper !== "2K" && upper !== "4K";
      if (upper === "4K" && !features.fourKUpscale) return false;
      const name = planName?.toLowerCase();
      if (name === "silver" && (upper === "2K" || upper === "4K")) return false;
      return true;
    },
    [features, planName],
  );

  const maxUploadSizeMB = useMemo(() => {
    if (!features?.maxUploadFileSize) return 15;
    const match = features.maxUploadFileSize.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 15;
  }, [features]);

  const allowedResolutions = useMemo(() => {
    if (!features) return ["1K", "2K", "4K"];
    return ["1K", "2K", "4K"].filter((r) => isResolutionAllowed(r));
  }, [features, isResolutionAllowed]);

  const isFeatureAllowed = useCallback(
    (key: keyof PlanFeatures): boolean => {
      // No plan = free tier: premium features disabled
      if (!features) return false;
      const val = features[key];
      return val !== false && val !== "" && val !== null && val !== undefined && val !== 0;
    },
    [features],
  );

  const poseLimit = useMemo(() => features?.poseCreationLimit ?? 8, [features]);

  return {
    planName,
    features,
    loading,
    isResolutionAllowed,
    isFeatureAllowed,
    maxUploadSizeMB,
    maxUploadSizeBytes: maxUploadSizeMB * 1024 * 1024,
    allowedResolutions,
    poseLimit,
    hasPlan: !!planName,
  };
}
