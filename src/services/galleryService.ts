import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";

export type GallerySource = "model_faces" | "visual_portfolio" | "model_gallery";
export type GalleryGender = "baby" | "boy" | "female" | "girl" | "male";

export interface GallerySourceInfo {
  id: GallerySource;
  description: string;
  hasGender: boolean;
}

export interface GalleryImageDetail {
  url: string;
  filename: string;
  key: string;
  lastModified: string;
  size: number;
}

export interface GalleryPagination {
  page: number;
  limit: number;
  totalImages: number;
  totalPages: number;
  hasMore: boolean;
}

export interface GalleryFilters {
  category: string | null;
  gender: GalleryGender | null;
  search: string | null;
}

export interface GallerySourcesResponse {
  success: boolean;
  sources: GallerySourceInfo[];
}

export interface GalleryCategoriesResponse {
  success: boolean;
  source: GallerySource;
  categories: string[];
  hasGender: boolean;
}

export interface GalleryImagesResponse {
  success: boolean;
  source: GallerySource;
  images: string[];
  imageDetails?: GalleryImageDetail[];
  pagination: GalleryPagination;
  filters: GalleryFilters;
}

export interface GalleryGroupedResponse {
  success: boolean;
  source: GallerySource;
  categories: Record<string, string[]>;
}

export interface GetImagesParams {
  source: GallerySource;
  category?: string;
  gender?: GalleryGender;
  page?: number;
  limit?: number;
  search?: string;
}

class GalleryService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  async getSources(): Promise<GallerySourcesResponse> {
    try {
      const response = await this.axiosInstance.get<GallerySourcesResponse>("/gallery/sources");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getCategories(source: GallerySource): Promise<GalleryCategoriesResponse> {
    try {
      const response = await this.axiosInstance.get<GalleryCategoriesResponse>("/gallery/categories", {
        params: { source },
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getImages(params: GetImagesParams): Promise<GalleryImagesResponse> {
    try {
      const response = await this.axiosInstance.get<GalleryImagesResponse>("/gallery/images", {
        params: {
          source: params.source,
          category: params.category,
          gender: params.gender,
          page: params.page || 1,
          limit: params.limit || 20,
          search: params.search,
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getGroupedImages(source: GallerySource, limit?: number): Promise<GalleryGroupedResponse> {
    try {
      const response = await this.axiosInstance.get<GalleryGroupedResponse>("/gallery/images/grouped", {
        params: { source, limit: limit || 50 },
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

const galleryService = new GalleryService(appConstant.BACKEND_API_URL);

export default galleryService;
