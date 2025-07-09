/**
 * Fresh Keeper API通信用の型定義
 * HTTPリクエスト・レスポンス、エラーハンドリング関連
 */

import type { UserResponse, ProductResponse } from './models';

// ===== 共通API型 =====

/**
 * API共通レスポンス形式
 */
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
}

/**
 * APIエラーレスポンス
 */
export interface ApiError {
  message: string;
  status: number;
  errors?: string[]; // バリデーションエラーの詳細
}

/**
 * ページネーション情報
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// ===== 認証API型 =====

/**
 * ログインAPIレスポンス
 */
export interface LoginResponse extends ApiResponse<UserResponse> {
  token?: string; // JWTトークン（クッキーの場合は不要）
}

/**
 * CSRFトークンレスポンス
 */
export interface CsrfTokenResponse extends ApiResponse {
  csrf_token: string;
}

// ===== 製品API型 =====

/**
 * 製品一覧APIレスポンス
 */
export interface ProductListResponse extends ApiResponse<ProductResponse[]> {}

/**
 * 製品詳細APIレスポンス
 */
export interface ProductDetailResponse extends ApiResponse<ProductResponse> {}

/**
 * 製品作成APIレスポンス
 */
export interface ProductCreateResponse extends ApiResponse<ProductResponse> {}

/**
 * 製品更新APIレスポンス
 */
export interface ProductUpdateResponse extends ApiResponse<ProductResponse> {}

/**
 * 製品削除APIレスポンス
 */
export interface ProductDeleteResponse extends ApiResponse {}

// ===== API設定型 =====

/**
 * APIクライアント設定
 */
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean; // クッキー認証のため
}

/**
 * APIエンドポイント定義
 */
export const API_ENDPOINTS = {
  // 認証
  AUTH: {
    SIGNUP: '/signup',
    LOGIN: '/login',
    LOGOUT: '/logout',
    CSRF: '/csrf',
  },
  // 製品
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    DETAIL: (id: number) => `/products/${id}`,
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
  },
} as const;

// ===== HTTPメソッド型 =====

/**
 * サポートするHTTPメソッド
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * APIリクエスト設定
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// ===== React Query用の型 =====

/**
 * React Queryのキー生成用
 */
export const QUERY_KEYS = {
  PRODUCTS: ['products'] as const,
  PRODUCT_DETAIL: (id: number) => ['products', id] as const,
  USER: ['user'] as const,
  CSRF: ['csrf'] as const,
} as const;

/**
 * ミューテーション用のキー
 */
export const MUTATION_KEYS = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  LOGOUT: 'logout',
  CREATE_PRODUCT: 'createProduct',
  UPDATE_PRODUCT: 'updateProduct',
  DELETE_PRODUCT: 'deleteProduct',
} as const;