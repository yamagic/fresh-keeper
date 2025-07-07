/**
 * 認証関連のAPIサービス
 */

import { apiClient } from './apiClient';
import {
  LoginFormData,
  UserRegisterData,
  LoginResponse,
  UserResponse,
  ApiResponse,
  API_ENDPOINTS,
} from '@/types';

export class AuthService {
  /**
   * ユーザー登録
   */
  async signup(userData: UserRegisterData): Promise<UserResponse> {
    try {
      const response = await apiClient.post<ApiResponse<UserResponse>>(
        API_ENDPOINTS.AUTH.SIGNUP,
        userData
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'ユーザー登録に失敗しました');
      }
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * ログイン
   */
  async login(loginData: LoginFormData): Promise<UserResponse> {
    try {
      // CSRFトークンが未設定の場合は取得
      await this.ensureCsrfToken();
      
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        loginData
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'ログインに失敗しました');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * ログアウト
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT);
      
      // ログアウト後はCSRFトークンをクリア
      apiClient.clearCsrfToken();
    } catch (error) {
      console.error('Logout error:', error);
      // ログアウトは失敗してもCSRFトークンはクリア
      apiClient.clearCsrfToken();
      throw error;
    }
  }

  /**
   * 現在のユーザー情報を取得（認証状態確認）
   */
  async getCurrentUser(): Promise<UserResponse | null> {
    try {
      // この実装はバックエンドに /me エンドポイントがある場合
      // 現在のバックエンドにはないので、ログイン状態の確認は別の方法で行う
      
      // 仮実装：製品一覧を取得して認証状態を確認
      await apiClient.get('/products');
      
      // 実際のユーザー情報はログイン時に取得してZustandに保存する方式
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * CSRFトークンが設定されていない場合は取得
   */
  private async ensureCsrfToken(): Promise<void> {
    try {
      await apiClient.initializeCsrfToken();
    } catch (error) {
      console.error('Failed to ensure CSRF token:', error);
      throw new Error('セキュリティトークンの取得に失敗しました');
    }
  }
}

// サービスのシングルトンインスタンス
export const authService = new AuthService();

export default authService;