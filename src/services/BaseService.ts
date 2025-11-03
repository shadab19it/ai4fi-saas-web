import axios, { AxiosError, AxiosInstance } from "axios";
import appConstant from "./appConstant";

class BaseService {
  protected axiosInstance: AxiosInstance;

  constructor(apiUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: apiUrl,
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem(appConstant.JWT_AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    });

    // Add an interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleCommonError(error as AxiosError<{ error: string; message: string }>);
        // Propagate the error further
        return Promise.reject(error);
      }
    );
  }

  protected handleCommonError(error: AxiosError<{ error: any; message: string }>) {
    let errMsg = "";
    let status = 400;
    if (error.response) {
      status = error.response.status;
      // @ts-ignore
      errMsg = error.response?.data?.message || error.response?.data?.error || error.response?.data?.info;
      switch (status) {
        case 400:
          console.error("Bad Request:", errMsg);
          break;
        case 401:
          console.error("Unauthorized:", errMsg);
          // Redirect to login or perform other actions
          break;
        case 403:
          console.error("Forbidden:", errMsg);
          // Handle unauthorized access
          break;
        case 404:
          console.error("Not Found:", errMsg);
          // Handle resource not found
          break;
        case 409:
          console.error("Conflict:", errMsg);
          // Handle conflict (e.g., duplicate data)
          break;
        case 500:
          console.error("Internal Server Error:", errMsg);
          // Handle server error
          break;
        default:
          console.error("An error occurred:", errMsg);
      }
    } else {
      // Handle network errors or other unexpected errors
      console.error("Network error or unexpected error:", error.message);
      errMsg = error.message || "Network error or unexpected error";
    }

    return { status, error: errMsg };
  }
}

export default BaseService;
