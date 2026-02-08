import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";

export interface TeamMember {
  userId: { _id: string; email: string; username?: string } | string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

export interface TeamCreditHistoryEntry {
  amount: number;
  balance: number;
  reason: string;
  type: "grant" | "usage" | "adjustment";
  adminId?: string | null;
  userId?: string | null;
  createdAt: string;
}

export interface Team {
  _id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  credits: number;
  creditHistory: TeamCreditHistoryEntry[];
}

export interface TeamInvite {
  _id: string;
  email: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: string;
  createdAt: string;
}

export interface TeamResponse {
  team: Team | null;
  invites: TeamInvite[];
}

class TeamService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  async getTeam(): Promise<TeamResponse> {
    try {
      const response = await this.axiosInstance.get<TeamResponse>("/team");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async inviteMember(email: string): Promise<{ message: string; success: boolean }> {
    try {
      const response = await this.axiosInstance.post("/team/invite", { email });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async resendInvite(inviteId: string): Promise<{ message: string; success: boolean }> {
    try {
      const response = await this.axiosInstance.post("/team/invite/resend", { inviteId });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async cancelInvite(inviteId: string): Promise<{ message: string; success: boolean }> {
    try {
      const response = await this.axiosInstance.post("/team/invite/cancel", { inviteId });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async acceptInvite(token: string, password?: string, username?: string): Promise<{ message: string; success: boolean }> {
    try {
      const response = await this.axiosInstance.post("/team/invite/accept", { token, password, username });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async removeMember(memberId: string): Promise<{ message: string; success: boolean }> {
    try {
      const response = await this.axiosInstance.post("/team/remove-member", { memberId });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateMemberRole(memberId: string, role: "admin" | "member"): Promise<{ message: string; success: boolean }> {
    try {
      const response = await this.axiosInstance.post("/team/member/role", { memberId, role });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async leaveTeam(): Promise<{ message: string; success: boolean }> {
    try {
      const response = await this.axiosInstance.post("/team/leave");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new TeamService(appConstant.BACKEND_API_URL);
