/**
 * Fresh Keeper 型定義の使用例
 * 初心者向けの使い方サンプル
 */

import {
  User,
  Product,
  ProductCreateData,
  LoginFormData,
  SignupFormData,
  ProductFormData,
  ApiResponse,
  ProductResponse,
  AuthState,
  ExpiryType,
  EXPIRY_TYPE_LABELS,
  FORM_DEFAULTS,
} from './index';

// ===== 基本的な型の使用例 =====

/**
 * 例1: ユーザー情報を表示する関数
 */
function displayUserInfo(user: User): string {
  // TypeScriptの型チェックにより、存在しないプロパティを参照するとエラーになる
  return `${user.name} (${user.email}) - 登録日: ${user.created_at}`;
}

/**
 * 例2: 製品データを作成する関数
 */
function createProductData(name: string, expiryDate: string, type: ExpiryType): ProductCreateData {
  return {
    name,
    description: '', // 空文字も有効
    quantity: 1,
    expiry_date: expiryDate,
    type, // ExpiryType により 'best_before' | 'use_by' のみ許可
  };
}

/**
 * 例3: 期限タイプを日本語で表示
 */
function getExpiryTypeLabel(type: ExpiryType): string {
  return EXPIRY_TYPE_LABELS[type]; // '賞味期限' または '消費期限'
}

// ===== フォームデータの使用例 =====

/**
 * 例4: ログインフォームのデフォルト値
 */
const loginForm: LoginFormData = {
  email: '', // 型により string しか許可されない
  password: '',
};

/**
 * 例5: 製品フォームの初期化
 */
const newProductForm: ProductFormData = {
  ...FORM_DEFAULTS.product, // デフォルト値を使用
  name: '新しい製品', // 一部を上書き
};

// ===== APIレスポンスの使用例 =====

/**
 * 例6: API成功時の処理
 */
function handleProductResponse(response: ApiResponse<ProductResponse>): void {
  if (response.success && response.data) {
    const product = response.data;
    console.log(`製品: ${product.name}, 残り日数: ${product.days_left}日`);
  } else {
    console.error('エラー:', response.message);
  }
}

/**
 * 例7: 製品一覧の処理
 */
function processProducts(products: ProductResponse[]): void {
  products.forEach((product) => {
    // 型により、存在しないプロパティを参照するとエラー
    const alertLevel = getAlertLevel(product.days_left);
    console.log(`${product.name}: ${alertLevel}`);
  });
}

// ===== 状態管理の使用例 =====

/**
 * 例8: 認証状態の確認
 */
function checkAuthStatus(authState: AuthState): boolean {
  return authState.isAuthenticated && authState.user !== null;
}

/**
 * 例9: ユーザー名の安全な取得
 */
function getUserName(authState: AuthState): string {
  // Optional chaining により null の場合も安全に処理
  return authState.user?.name ?? 'ゲストユーザー';
}

// ===== ヘルパー関数の例 =====

/**
 * 例10: 残り日数による警告レベル判定
 */
function getAlertLevel(daysLeft: number): string {
  if (daysLeft < 0) return '期限切れ';
  if (daysLeft <= 1) return '緊急';
  if (daysLeft <= 3) return '警告';
  if (daysLeft <= 7) return '注意';
  return '安全';
}

/**
 * 例11: 日付フォーマット
 */
function formatExpiryDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ===== React コンポーネントでの使用例 =====

/**
 * 例12: React コンポーネントの Props 型定義
 */
interface ProductCardProps {
  product: ProductResponse;
  onEdit: (product: ProductResponse) => void;
  onDelete: (id: number) => void;
}

/**
 * 例13: カスタムフックの戻り値型
 */
interface UseProductsReturn {
  products: ProductResponse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// ===== 型ガード関数の例 =====

/**
 * 例14: APIエラーの型ガード
 */
function isApiError(error: unknown): error is ApiResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    'message' in error
  );
}

/**
 * 例15: 型アサーション（型の断言）の例
 */
function processApiResponse(response: unknown): void {
  // 型ガードで安全性を確保してから処理
  if (isApiError(response)) {
    console.log('APIエラー:', response.message);
  }
}

// ===== エクスポート（実際のコードでは不要） =====
export {
  displayUserInfo,
  createProductData,
  getExpiryTypeLabel,
  handleProductResponse,
  processProducts,
  checkAuthStatus,
  getUserName,
  getAlertLevel,
  formatExpiryDate,
  isApiError,
  processApiResponse,
};

export type { ProductCardProps, UseProductsReturn };