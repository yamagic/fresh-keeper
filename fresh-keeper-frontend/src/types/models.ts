/**
 * Fresh Keeper バックエンドAPIのデータモデル型定義
 * Goのmodel/user.goとmodel/product.goに対応
 */

// ===== 基本型定義 =====

/**
 * 賞味期限の種類
 * best_before: 賞味期限（品質が保たれる期限）
 * use_by: 消費期限（安全性が保たれる期限）
 */
export type ExpiryType = 'best_before' | 'use_by';

// ===== ユーザー関連型 =====

/**
 * ユーザーモデル（バックエンドから受信するデータ）
 */
export interface User {
  id: number;
  email: string;
  password?: string; // パスワードは通常APIレスポンスに含まれない
  name: string;
  created_at: string; // ISO 8601形式の日付文字列
  updated_at: string;
}

/**
 * ユーザーレスポンス（APIから返される安全なユーザー情報）
 */
export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

/**
 * ユーザー登録用のデータ
 */
export interface UserRegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * ユーザーログイン用のデータ
 */
export interface UserLoginData {
  email: string;
  password: string;
}

// ===== 製品（食材）関連型 =====

/**
 * 製品モデル（バックエンドから受信するデータ）
 */
export interface Product {
  id: number;
  user_id: number;
  user?: UserResponse; // 製品の所有者情報（オプション）
  name: string;
  description: string;
  quantity: number;
  expiry_date: string; // ISO 8601形式の日付文字列
  type: ExpiryType;
  is_notified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 製品レスポンス（APIから返される製品情報）
 * DaysLeftが追加で計算される
 */
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  expiry_date: string;
  type: ExpiryType;
  is_notified: boolean;
  days_left: number; // 賞味期限までの残り日数
  created_at: string;
  updated_at: string;
}

/**
 * 製品作成用のデータ
 */
export interface ProductCreateData {
  name: string;
  description: string;
  quantity: number;
  expiry_date: string; // YYYY-MM-DD形式
  type: ExpiryType;
}

/**
 * 製品更新用のデータ（バックエンドバリデーションに合わせて必須フィールド）
 */
export interface ProductUpdateData {
  name: string;
  description?: string;
  quantity: number;
  expiry_date: string; // YYYY-MM-DDTHH:mm:ss.sssZ形式
  type: ExpiryType;
  is_notified?: boolean;
}

// ===== ヘルパー型 =====

/**
 * 賞味期限の種類を日本語で表示するためのマップ
 */
export const EXPIRY_TYPE_LABELS: Record<ExpiryType, string> = {
  best_before: '賞味期限',
  use_by: '消費期限',
} as const;

/**
 * 残り日数に基づく警告レベル
 */
export type AlertLevel = 'safe' | 'warning' | 'danger' | 'expired';

/**
 * 残り日数から警告レベルを判定する関数用の型
 */
export interface AlertConfig {
  warningDays: number; // 警告表示する日数
  dangerDays: number;  // 危険表示する日数
}