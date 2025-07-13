/**
 * 認証関連のAPIサービス
 */

import { apiClient } from './apiClient';
import type { LoginFormData } from '@/types/forms';
import type { UserRegisterData, UserResponse } from '@/types/models';
import type { LoginResponse, ApiResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/types/api';

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
      
      // バックエンドが空文字列を返す場合の対応
      if (response === '' || response === null || response === undefined) {
        // ログイン成功（レスポンスボディなし）
        // JWTクッキーが設定されているので、認証が必要なAPIで確認
        try {
          // 製品一覧APIを呼び出して認証状態を確認
          await apiClient.get('/products');
          // 認証成功時はログインに使用したemailを使用
          return {
            id: 0, // JWTから取得できないため仮のID
            email: loginData.email,
            name: loginData.email.split('@')[0] // emailのローカル部分をnameとして使用
          };
        } catch (error) {
          throw new Error('ログイン後の認証確認に失敗しました');
        }
      }
      
      // JSONレスポンスの場合
      if (response && typeof response === 'object') {
        if (response.success === false) {
          throw new Error(response.message || 'ログインに失敗しました');
        }
        return response.data;
      }
      
      throw new Error('予期しないレスポンス形式です');
    } catch (error: any) {
      // エラーメッセージを適切に変換
      if (error.status === 401) {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      } else if (error.status === 400) {
        throw new Error('入力内容に不備があります');
      } else if (error.status === 0) {
        throw new Error('サーバーに接続できません');
      }
      
      throw new Error(error.message || 'ログインに失敗しました');
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
      
      // バックエンドに専用のエンドポイントがないため、
      // ログイン時に保存したユーザー情報を使用する
      // 実際の認証状態確認は必要に応じて製品一覧などのAPIで行う
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