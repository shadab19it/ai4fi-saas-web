import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";

export interface PlanFeatures {
  brandSafeOutputs: boolean;
  aiPhotoshootWorkflows: boolean;
  modelLibrary: boolean;
  backgroundLibrary: boolean;
  templateLibrary: boolean;
  maxUploadFileSize: string;
  maxOutputResolution: string;
  bulkProductUploads: boolean;
  customModelCreation: boolean;
  customPhotoshootTemplates: boolean;
  bulkPhotoshootCreation: boolean;
  regenerationsPerImage: number;
  editsPerImage: number;
  photoshootEditTurnaround: string;
  fourKUpscale: boolean;
  platformReadyCrops: boolean;
  includedUsers: number;
  priorityProcessingQueue: boolean;
  earlyAccessToAIUpdates: boolean;
  emailSupportSLA: string;
  chatSupportSLA: string;
  dedicatedAccountManager: boolean;
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

export interface CreateOrderResponse {
  success: boolean;
  order: {
    orderId: string;
    amount: number;
    currency: string;
    keyId?: string;
    mode?: string;
  };
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
  message: string;
  subscription: {
    plan: SubscriptionPlan;
    startDate: string;
    endDate: string;
    status: string;
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

  async createOrder(planId: string, currency?: string): Promise<CreateOrderResponse> {
    try {
      const response = await this.axiosInstance.post("/subscriptions/create-order", { planId, currency });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async verifyPayment(data: {
    paymentId: string;
    providerPaymentId?: string;
    providerSignature?: string;
  }): Promise<VerifyPaymentResponse> {
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
}

export default new SubscriptionService(appConstant.BACKEND_API_URL);
