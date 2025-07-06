/**
 * Fresh Keeper 認証・セキュリティ関連の型定義
 * Zustand状態管理、CSRF、JWT認証対応
 */

import { UserResponse } from './models';

// ===== 認証状態型 =====

/**
 * 認証状態の型
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

/**
 * 認証ストアの状態
 */
export interface AuthState {
  // 認証状態
  status: AuthStatus;
  user: UserResponse | null;
  isAuthenticated: boolean;
  
  // エラー状態
  error: string | null;
  
  // 認証アクション
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  
  // 初期化
  initialize: () => Promise<void>;
}

/**
 * 認証コンテキストの型（React Context用）
 */
export interface AuthContextType extends AuthState {
  isLoading: boolean;
}

// ===== CSRF関連型 =====

/**
 * CSRFトークンの状態
 */
export interface CsrfState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // アクション
  fetchToken: () => Promise<void>;
  clearToken: () => void;
}

/**
 * CSRF設定
 */
export interface CsrfConfig {
  headerName: string; // X-CSRF-Token
  cookieName: string; // csrf_token
  autoRefresh: boolean; // 自動更新するかどうか
}

// ===== セッション管理型 =====

/**
 * セッション情報
 */
export interface SessionInfo {
  isValid: boolean;
  expiresAt: Date | null;
  lastActivity: Date;
}

/**
 * セッション管理の設定
 */
export interface SessionConfig {
  timeout: number; // セッションタイムアウト（ミリ秒）
  warningTime: number; // タイムアウト警告時間（ミリ秒）
  checkInterval: number; // セッションチェック間隔（ミリ秒）
}

// ===== 権限・ロール型 =====

/**
 * ユーザーの権限（将来の拡張用）
 */
export type UserRole = 'user' | 'admin';

/**
 * アクセス権限の定義
 */
export interface Permission {
  resource: string; // 'products', 'users' など
  action: 'read' | 'write' | 'delete'; // 操作の種類
}

/**
 * 権限チェック用の型
 */
export interface PermissionCheck {
  hasPermission: (permission: Permission) => boolean;
  canAccessRoute: (route: string) => boolean;
}

// ===== 認証フック用型 =====

/**
 * useAuth フックの戻り値型
 */
export interface UseAuthReturn extends AuthState {
  // 便利なプロパティ
  isLoading: boolean;
  isLoggedIn: boolean;
  userName: string | null;
  userEmail: string | null;
}

/**
 * useRequireAuth フックの設定
 */
export interface RequireAuthConfig {
  redirectTo?: string; // 未認証時のリダイレクト先
  requiredRole?: UserRole; // 必要な権限
  onUnauthorized?: () => void; // 未認証時の処理
}

// ===== パスワード関連型 =====

/**
 * パスワード強度レベル
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong';

/**
 * パスワード要件
 */
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

/**
 * パスワード検証結果
 */
export interface PasswordValidation {
  strength: PasswordStrength;
  score: number; // 0-100
  suggestions: string[]; // 改善提案
  isValid: boolean;
}

// ===== 認証エラー型 =====

/**
 * 認証エラーの種類
 */
export type AuthErrorType = 
  | 'invalid_credentials'
  | 'user_not_found'
  | 'email_already_exists'
  | 'session_expired'
  | 'csrf_token_mismatch'
  | 'network_error'
  | 'server_error'
  | 'validation_error';

/**
 * 認証エラー情報
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

// ===== 定数定義 =====

/**
 * 認証関連の定数
 */
export const AUTH_CONSTANTS = {
  // ローカルストレージキー
  STORAGE_KEYS: {
    USER: 'fresh_keeper_user',
    REMEMBER_EMAIL: 'fresh_keeper_remember_email',
  },
  
  // セッション設定
  SESSION: {
    TIMEOUT: 30 * 60 * 1000, // 30分
    WARNING_TIME: 5 * 60 * 1000, // 5分前に警告
    CHECK_INTERVAL: 60 * 1000, // 1分間隔でチェック
  },
  
  // CSRF設定
  CSRF: {
    HEADER_NAME: 'X-CSRF-Token',
    COOKIE_NAME: 'csrf_token',
  },
  
  // エラーメッセージ
  ERROR_MESSAGES: {
    invalid_credentials: 'メールアドレスまたはパスワードが正しくありません',
    user_not_found: 'ユーザーが見つかりません',
    email_already_exists: 'このメールアドレスは既に登録されています',
    session_expired: 'セッションが期限切れです。再度ログインしてください',
    csrf_token_mismatch: 'セキュリティトークンが無効です。ページを再読み込みしてください',
    network_error: 'ネットワークエラーが発生しました',
    server_error: 'サーバーエラーが発生しました',
    validation_error: '入力内容に問題があります',
  },
} as const;