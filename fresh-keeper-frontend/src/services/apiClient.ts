/**
 * APIクライアント - Axiosを使ったHTTP通信の基盤
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiConfig, ApiError, CsrfTokenResponse } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private csrfToken: string | null = null;

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      withCredentials: config.withCredentials, // クッキー認証のため必須
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * リクエスト・レスポンスインターセプターを設定
   */
  private setupInterceptors() {
    // リクエストインターセプター（CSRFトークンを自動追加）
    this.client.interceptors.request.use(
      (config) => {
        if (this.csrfToken) {
          config.headers['X-CSRF-Token'] = this.csrfToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // レスポンスインターセプター（エラーハンドリング）
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * エラーレスポンスを統一形式に変換
   */
  private handleError(error: any): ApiError {
    if (error.response) {
      // サーバーからのエラーレスポンス
      return {
        message: error.response.data?.message || 'サーバーエラーが発生しました',
        status: error.response.status,
        errors: error.response.data?.errors,
      };
    } else if (error.request) {
      // ネットワークエラー
      return {
        message: 'ネットワークエラーが発生しました。接続を確認してください。',
        status: 0,
      };
    } else {
      // その他のエラー
      return {
        message: error.message || '予期しないエラーが発生しました',
        status: 0,
      };
    }
  }

  /**
   * CSRFトークンを取得・設定
   */
  async initializeCsrfToken(): Promise<void> {
    try {
      const response = await this.client.get<CsrfTokenResponse>('/csrf');
      
      if (response.data && response.data.csrf_token) {
        this.csrfToken = response.data.csrf_token;
      } else {
        throw new Error('CSRF token not found in response');
      }
    } catch (error) {
      console.error('Failed to initialize CSRF token:', error);
      throw error;
    }
  }

  /**
   * CSRFトークンをクリア
   */
  clearCsrfToken(): void {
    this.csrfToken = null;
  }

  /**
   * GETリクエスト
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  /**
   * POSTリクエスト
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return response.data;
    } catch (error: any) {
      // APIErrorの形式で投げ直す
      const apiError = {
        message: error.response?.data?.message || error.message || 'ネットワークエラーが発生しました。接続を確認してください。',
        status: error.response?.status || 0,
        errors: error.response?.data?.errors,
      };
      
      throw apiError;
    }
  }

  /**
   * PUTリクエスト
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return response.data;
    } catch (error: any) {
      console.error('PUT request error:', {
        url,
        data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        message: error.message
      });
      
      const apiError = {
        message: error.response?.data?.message || error.message || 'PUTリクエストでエラーが発生しました',
        status: error.response?.status || 0,
        errors: error.response?.data?.errors,
      };
      throw apiError;
    }
  }

  /**
   * DELETEリクエスト
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * ファイルアップロード用POSTリクエスト
   */
  async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// APIクライアントのシングルトンインスタンスを作成
const apiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30秒
  withCredentials: true,
};

export const apiClient = new ApiClient(apiConfig);

// デフォルトエクスポート
export default apiClient;