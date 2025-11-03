import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IEmailConfig } from "../pages/ContactUs";
import { GeneratedModel } from "../store/modelSlice";

export interface IResponse {
  success: boolean;
  message: string;
  error?: string;
  status?: number;
  info: boolean;
}

export interface Stats {
  modelData: GeneratedModel[];
  tryonData: GeneratedModel[];
}

export interface dashboardStats extends IResponse {
  modelData: GeneratedModel[];
  tryonData: GeneratedModel[];
}

type ApiResponse = IResponse;

class CommonService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<any>): ApiResponse {
    return response.data;
  }

  async sendEmail(config: IEmailConfig): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<ApiResponse>(`/email/contact-us`, config);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async downloadFileFromAPI(urls: string[], imageType: string, filename: string = "files.zip") {
    try {
      const response = await this.axiosInstance.post(
        "/download/multiple-file",
        { urls, type: imageType },
        {
          responseType: "blob", // Expecting binary data (e.g., ZIP file)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Create a download URL from the response data
      const downloadUrl = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename; // Save as a ZIP file
      document.body.appendChild(a); // Append to DOM for Firefox compatibility
      a.click();
      a.remove(); // Clean up after clicking
      URL.revokeObjectURL(downloadUrl); // Release the object URL
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async downloadSingleFile(url: string) {
    try {
      const response = await this.axiosInstance.get(`/download/file?url=${url}`, {
        responseType: "blob",
      });
      // const imgURL = URL.createObjectURL(response.data);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getDashboardStat(): Promise<dashboardStats> {
    try {
      const response = await this.axiosInstance.get<dashboardStats>(`/dashboard/stats`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new CommonService(appConstant.BACKEND_API_URL);
