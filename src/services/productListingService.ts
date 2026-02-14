import BaseService from "./BaseService";
import appConstant from "./appConstant";

export interface BannerRequest {
  product_image: File;
  model_image?: File;
  product_name: string;
  category: string;
  short_description: string;
  tagline?: string;
  aspect_ratio?: string;
  resolution?: string;
  requiredCredits?: number;
}

export interface LifestyleListingRequest {
  product_image: File;
  model_image?: File;
  product_name: string;
  category: string;
  short_description: string;
  tagline?: string;
  count?: number;
  model_image_count?: number;
  tier?: "basic" | "professional";
  target_marketplace?: "amazon" | "flipkart" | "myntra";
  aspect_ratio?: string;
  resolution?: string;
  requiredCredits?: number;
}

export interface BannerResponse {
  image_urls: string[];
  tagline: string;
  generation_time_seconds: number;
}

export interface LifestyleListingResponse {
  image_urls: string[];
  listing_data: {
    title?: string;
    bullets?: string[];
    description?: string;
    specifications?: Record<string, string>;
    keywords?: string;
    raw_text?: string;
  };
  tagline: string;
  generation_time_seconds: number;
}

class ProductListingService extends BaseService {
  constructor() {
    super(`${appConstant.BACKEND_API_URL}/product-listing`);
  }

  async generateBanner(data: BannerRequest): Promise<BannerResponse> {
    const formData = new FormData();
    formData.append("product_image", data.product_image);
    if (data.model_image) formData.append("model_image", data.model_image);
    formData.append("product_name", data.product_name);
    formData.append("category", data.category);
    formData.append("short_description", data.short_description);
    if (data.tagline) formData.append("tagline", data.tagline);
    if (data.aspect_ratio) formData.append("aspect_ratio", data.aspect_ratio);
    if (data.resolution) formData.append("resolution", data.resolution);
    if (data.requiredCredits) formData.append("requiredCredits", String(data.requiredCredits));

    const res = await this.axiosInstance.post("/generate-banner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });
    return res.data;
  }

  async generateLifestyleListing(data: LifestyleListingRequest): Promise<LifestyleListingResponse> {
    const formData = new FormData();
    formData.append("product_image", data.product_image);
    if (data.model_image) formData.append("model_image", data.model_image);
    formData.append("product_name", data.product_name);
    formData.append("category", data.category);
    formData.append("short_description", data.short_description);
    if (data.tagline) formData.append("tagline", data.tagline);
    if (data.count) formData.append("count", String(data.count));
    if (data.model_image_count !== undefined) formData.append("model_image_count", String(data.model_image_count));
    if (data.tier) formData.append("tier", data.tier);
    if (data.target_marketplace) formData.append("target_marketplace", data.target_marketplace);
    if (data.aspect_ratio) formData.append("aspect_ratio", data.aspect_ratio);
    if (data.resolution) formData.append("resolution", data.resolution);
    if (data.requiredCredits) formData.append("requiredCredits", String(data.requiredCredits));

    const res = await this.axiosInstance.post("/generate-lifestyle-listing", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 300000,
    });
    return res.data;
  }
}

const productListingService = new ProductListingService();
export default productListingService;
