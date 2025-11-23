import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IFastGenModelGenerateConfig, ModelConfig } from "../components/ModelGenerator/ModelGenerateUI";
import { GeneratedModel } from "../store/modelSlice";

export interface IResponse {
  success: boolean;
  message: string;
  error?: string;
  status?: number;
  info: boolean;
  // Add other properties as needed based on your API response
}

type ApiResponse = IResponse;

interface IModelResponse extends ApiResponse {
  image_urls: any[];
  seed: number;
}
interface IModelDeleteResponse extends ApiResponse {}
interface ModelListResponse extends ApiResponse {
  history: GeneratedModel[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}
interface FlowsListResponse extends ApiResponse {
  flows: any[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}
interface IVirtualTryOnResult extends ApiResponse {
  tryonResult: any[];
}

class ModelService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<any>): IModelResponse {
    return response.data;
  }

  async generateModel(config: ModelConfig): Promise<IModelResponse> {
    try {
      const response = await this.axiosInstance.post<IModelResponse>(`/generate/model`, config);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async generateFastGenModel(config: IFastGenModelGenerateConfig): Promise<IModelResponse> {
    try {
      const response = await this.axiosInstance.post<IModelResponse>(`/generate/fast-gen-model`, config);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async virtualTryon(formData: FormData): Promise<IVirtualTryOnResult> {
    try {
      const response = await this.axiosInstance.post<IVirtualTryOnResult>(`/generate/virtual-try-on`, formData);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getModelList(page: number, limit: number, type: string): Promise<ModelListResponse> {
    try {
      const response = await this.axiosInstance.get<ModelListResponse>(`/generate/model/history`, {
        params: {
          page,
          limit,
          type,
        },
      });
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getImages(folderName: string, maxResult: number): Promise<any> {
    try {
      const response = await this.axiosInstance.post<any>(`/get-s3-images?maxResult=${maxResult}`, [folderName]);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async deleteGenerateImage(id: string, imageUrl: string): Promise<IModelDeleteResponse> {
    try {
      const response = await this.axiosInstance.post<IModelResponse>(`/generate/generated-image/delete`, { id, imageUrl });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getFlowsList(page: number, limit: number): Promise<FlowsListResponse> {
    try {
      const response = await this.axiosInstance.get<FlowsListResponse>(`/product-ad/flows`, {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new ModelService(appConstant.BACKEND_API_URL);
