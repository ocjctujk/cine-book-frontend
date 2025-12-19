import axiosInstance from "./axiosConfig";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiService {
  async get<T>(endpoint: string) {
    const response = await axiosInstance.get<ApiResponse<T>>(endpoint);
    return response;
  }

  async post<T>(endpoint: string, data: unknown) {
    const response = await axiosInstance.post<ApiResponse<T>>(endpoint, data);
    return response;
  }

  async put<T>(endpoint: string, data: unknown) {
    const response = await axiosInstance.put<ApiResponse<T>>(endpoint, data);
    return response;
  }

  async delete<T>(endpoint: string) {
    const response = await axiosInstance.delete<ApiResponse<T>>(endpoint);
    return response;
  }
}

export default new ApiService();
