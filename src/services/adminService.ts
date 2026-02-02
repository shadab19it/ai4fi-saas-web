import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";

export interface CreditHistoryEntry {
  amount: number;
  balance: number;
  reason: string;
  type: "grant" | "usage" | "adjustment";
  adminId?: string | null;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  username?: string;
  role?: "admin" | "user";
  credits: number;
  createdAt: string;
  creditHistory?: CreditHistoryEntry[];
}

export interface AdminUserListResponse {
  users: AdminUser[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface AdminUserResponse {
  success: boolean;
  user: AdminUser;
}

export interface AdminAdjustCreditsResponse {
  success: boolean;
  message: string;
  user: AdminUser;
}

class AdminService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  async getUsers(search = "", page = 1, limit = 20): Promise<AdminUserListResponse> {
    try {
      const response = await this.axiosInstance.get<AdminUserListResponse>("/admin/users", {
        params: { search, page, limit },
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getUser(userId: string): Promise<AdminUserResponse> {
    try {
      const response = await this.axiosInstance.get<AdminUserResponse>(`/admin/users/${userId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async adjustCredits(userId: string, amount: number, reason: string): Promise<AdminAdjustCreditsResponse> {
    try {
      const response = await this.axiosInstance.patch<AdminAdjustCreditsResponse>(`/admin/users/${userId}/credits`, {
        amount,
        reason,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new AdminService(appConstant.BACKEND_API_URL);
