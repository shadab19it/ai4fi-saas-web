import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";

export interface PlanFeatures {
  // Core Platform Capabilities
  maxOutputResolution: string;
  fourKUpscale: boolean;
  regenerationsPerImage: number;
  brandSafeOutputs: boolean;
  maxUploadFileSize: string;

  // AI Photoshoot & Virtual Try-On
  aiPhotoshootWorkflows: boolean;
  unstitchedVirtualTryOn: boolean;
  poseCreationLimit: number;
  poseLibrary: string;
  preBuiltModelSupport: string;
  nationalityDiversity: string;
  specialCategoriesSupport: boolean;
  backgroundLibrary: string;
  jewellerySupport: string;
  accessoriesSupport: boolean;
  customModelCreation: boolean;

  // Lifestyle Photography & Content
  eCommerceImages: boolean;
  bannerCreation: boolean;
  eCommerceContentSupport: boolean;
  platformReadyCrops: boolean;

  // Ad Studio
  staticAdCreatives: boolean;
  videoAdCreation: string;

  // Refinement & Delivery
  photoshootEditTurnaround: string;
  priorityProcessingQueue: boolean;

  // Data Access & Storage Policy
  dataRetentionDays: number;
  maxGalleryImages: number;
  autoRemovalDays: number;
  storageLimitNotification: boolean;
  manualStorageCleanup: boolean;

  // Team & Support
  includedUsers: number;
  earlyAccessToAIUpdates: boolean;
  dedicatedSupportNumber: boolean;
  dedicatedAccountManager: boolean;
  emailSupportSLA: string;
  chatSupportSLA: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: "silver" | "gold" | "platinum";
  displayName: string;
  description: string;
  price: number;
  priceINR: number;
  currency: string;
  creditsIncluded: number;
  durationInDays: number;
  features: PlanFeatures;
  isPopular: boolean;
  isActive: boolean;
  isComingSoon: boolean;
  displayOrder: number;
  ctaText: string;
  highlighted: boolean;
}

export interface PayUData {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
  surl: string;
  furl: string;
  notify_url: string;
  hash: string;
  action: string;
}

export interface CreateOrderResponse {
  success: boolean;
  payuData: PayUData;
  paymentId: string;
  plan: {
    name: string;
    price: number;
    currency: string;
    creditsIncluded: number;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  payment: {
    status: string;
    amount: number;
    currency: string;
    creditsGranted: number;
    provider: string;
  };
  subscription: {
    plan: SubscriptionPlan | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  };
  credits: number;
}

export interface MySubscriptionResponse {
  success: boolean;
  subscription: {
    plan: SubscriptionPlan | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  };
  credits: number;
}

export interface PaymentRecord {
  _id: string;
  planId: {
    displayName: string;
    name: string;
    price: number;
    priceINR: number;
    currency: string;
    creditsIncluded: number;
  };
  amount: number;
  currency: string;
  provider: string;
  status: string;
  creditsGranted: number;
  createdAt: string;
}

export interface BillingOverview {
  success: boolean;
  subscription: {
    plan: {
      _id: string;
      name: string;
      displayName: string;
      features: PlanFeatures;
    } | null;
    status: string | null;
    startDate: string | null;
    endDate: string | null;
  };
  credits: number;
  storage: {
    galleryCount: number;
    adFlowCount: number;
    maxGalleryImages: number;
    dataRetentionDays: number;
    usagePercent: number;
  };
  recentPayments: PaymentRecord[];
  creditHistory: {
    amount: number;
    balance: number;
    reason: string;
    type: string;
    createdAt: string;
  }[];
}

class SubscriptionService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  async getPlans(): Promise<{ success: boolean; plans: SubscriptionPlan[]; supportedCurrencies: string[] }> {
    try {
      const response = await this.axiosInstance.get("/subscriptions/plans");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getMySubscription(): Promise<MySubscriptionResponse> {
    try {
      const response = await this.axiosInstance.get("/subscriptions/my-subscription");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async createOrder(planId: string, currency?: string, creditCount?: number): Promise<CreateOrderResponse> {
    try {
      const response = await this.axiosInstance.post("/subscriptions/create-order", { planId, currency, creditCount });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async verifyPayment(data: { paymentId: string }): Promise<VerifyPaymentResponse> {
    try {
      const response = await this.axiosInstance.post("/subscriptions/verify-payment", data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getPaymentHistory(page = 1, limit = 10): Promise<{
    success: boolean;
    payments: PaymentRecord[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const response = await this.axiosInstance.get("/subscriptions/payment-history", {
        params: { page, limit },
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getBillingOverview(): Promise<BillingOverview> {
    try {
      const response = await this.axiosInstance.get("/billing/overview");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getStorageUsage(): Promise<{
    success: boolean;
    galleryCount: number;
    maxGalleryImages: number;
    usagePercent: number;
    dataRetentionDays: number;
    oldestGenerationDate: string | null;
    expiringSoonCount: number;
  }> {
    try {
      const response = await this.axiosInstance.get("/billing/storage/usage");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async cleanupStorage(params: { olderThanDays?: number; generationIds?: string[] }): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
    remainingCount: number;
  }> {
    try {
      const response = await this.axiosInstance.delete("/billing/storage/cleanup", { data: params });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new SubscriptionService(appConstant.BACKEND_API_URL);
