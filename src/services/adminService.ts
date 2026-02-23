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
  teamId?: string | null;
  teamRole?: "owner" | "admin" | "member" | null;
  creditHistory?: CreditHistoryEntry[];
  isActive?: boolean;
  isVerified?: boolean;
  teamMemberLimit?: number;
  teamMemberLimitSource?: "override" | "plan" | "global";
  effectiveCredits?: number;
  effectiveCreditHistory?: CreditHistoryEntry[];
  walletType?: "user" | "team";
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

export interface TeamMemberDetails {
  userId: {
    _id: string;
    email: string;
    username?: string;
    credits: number;
    creditHistory?: CreditHistoryEntry[];
    teamRole?: "owner" | "admin" | "member";
  };
  role: "owner" | "admin" | "member";
  joinedAt?: string;
}

export interface AdminTeam {
  _id: string;
  name: string;
  ownerId: { _id: string; email: string; username?: string } | string;
  members?: TeamMemberDetails[];
  credits: number;
  createdAt: string;
  creditHistory?: CreditHistoryEntry[];
}

export interface AdminTeamListResponse {
  teams: AdminTeam[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface AdminTeamResponse {
  success: boolean;
  team: AdminTeam;
}

export interface AdminAdjustTeamCreditsResponse {
  success: boolean;
  message: string;
  team: AdminTeam;
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

  async updateUserRole(userId: string, role: "admin" | "user"): Promise<{ success: boolean; message: string; user: AdminUser }> {
    try {
      const response = await this.axiosInstance.patch<{ success: boolean; message: string; user: AdminUser }>(`/admin/users/${userId}/role`, { role });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async toggleUserStatus(userId: string, isActive: boolean): Promise<{ success: boolean; message: string; user: AdminUser }> {
    try {
      const response = await this.axiosInstance.patch<{ success: boolean; message: string; user: AdminUser }>(`/admin/users/${userId}/status`, { isActive });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateUserTeamMemberLimit(
    userId: string,
    limit: number | null
  ): Promise<{
    success: boolean;
    message: string;
    teamMemberLimit: number;
    teamMemberLimitSource: "override" | "plan" | "global";
    overrideValue: number | null;
  }> {
    try {
      const response = await this.axiosInstance.patch(`/admin/users/${userId}/team-member-limit`, { limit });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getTeams(search = "", page = 1, limit = 20): Promise<AdminTeamListResponse> {
    try {
      const response = await this.axiosInstance.get<AdminTeamListResponse>("/admin/teams", {
        params: { search, page, limit },
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getTeam(teamId: string): Promise<AdminTeamResponse> {
    try {
      const response = await this.axiosInstance.get<AdminTeamResponse>(`/admin/teams/${teamId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async adjustTeamCredits(teamId: string, amount: number, reason: string): Promise<AdminAdjustTeamCreditsResponse> {
    try {
      const response = await this.axiosInstance.patch<AdminAdjustTeamCreditsResponse>(`/admin/teams/${teamId}/credits`, {
        amount,
        reason,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  // System Settings
  async getSettings(): Promise<{ settings: Record<string, { value: any; description: string }>; success: boolean }> {
    try {
      const response = await this.axiosInstance.get<{ settings: Record<string, { value: any; description: string }>; success: boolean }>("/admin/settings");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateSetting(key: string, value: any): Promise<{ success: boolean; message: string; setting: any }> {
    try {
      const response = await this.axiosInstance.patch<{ success: boolean; message: string; setting: any }>("/admin/settings", {
        key,
        value,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  // Analytics
  async getAnalyticsOverview(): Promise<any> {
    try {
      const response = await this.axiosInstance.get("/analytics/overview");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getAnalyticsUsers(days: number = 30): Promise<any> {
    try {
      const response = await this.axiosInstance.get("/analytics/users", { params: { days } });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getAnalyticsTeams(): Promise<any> {
    try {
      const response = await this.axiosInstance.get("/analytics/teams");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getAnalyticsUsage(days: number = 30): Promise<any> {
    try {
      const response = await this.axiosInstance.get("/analytics/usage", { params: { days } });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getActivityLog(page: number = 1, limit: number = 20): Promise<any> {
    try {
      const response = await this.axiosInstance.get("/analytics/activity", { params: { page, limit } });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<{ success: boolean; plans: any[] }> {
    try {
      const response = await this.axiosInstance.get("/admin/subscription-plans");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateSubscriptionPlan(planId: string, updates: Record<string, any>): Promise<{ success: boolean; plan: any; message: string }> {
    try {
      const response = await this.axiosInstance.put(`/admin/subscription-plans/${planId}`, updates);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  // Subscription Analytics
  async getSubscriptionAnalytics(): Promise<any> {
    try {
      const response = await this.axiosInstance.get("/admin/analytics/subscriptions");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new AdminService(appConstant.BACKEND_API_URL);
