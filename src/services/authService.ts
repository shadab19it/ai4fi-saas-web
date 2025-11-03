import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";

export interface Subscription {
  plan: string; // ID of the plan
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  points: number;
  status: "active" | "inactive" | "expired"; // Possible statuses
}
export interface IUser {
  _id: string;
  organizationName?: string;
  email: string;
  createdAt: string;
  firstName: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  phone: string;
  profileUrl?: string;
  role?: UserRole;
  username: string;
  subscription: Subscription;
}

export interface IResponse {
  success: boolean;
  message: string;
  error?: string;
  status?: number;
  info: boolean;
  // Add other properties as needed based on your API response
}

interface loginResponse extends IResponse {
  token: string;
  user: IUser;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export type UserRole = "admin" | "user";

export interface SignupData {
  userId?: string;
  username?: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

interface ForgotPasswordData {
  email: string;
}

type ApiResponse = IResponse;

class AuthService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<loginResponse> {
    try {
      const response = await this.axiosInstance.post<loginResponse>(`/auth/login`, credentials);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async signup(data: SignupData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/auth/register`, data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async getUserInfo(): Promise<loginResponse> {
    try {
      const response = await this.axiosInstance.get(`/auth/me`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async userVerifyOtp(otp: string, email: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/auth/verify/otp`, {
        otp,
        email,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }
  async userVerifyEmail(token: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/auth/verify/email/${token}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }
  async activateAccountByAdmin(token: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/auth/activate/account/${token}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async getAllStoreCustomer(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/all-users`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/auth/forgot-password", data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(appConstant.JWT_AUTH_TOKEN);
    if (!token) {
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem(appConstant.JWT_AUTH_TOKEN);
  }

  isAdmin(): boolean {
    return false;
  }
}

export default new AuthService(appConstant.BACKEND_API_URL);
