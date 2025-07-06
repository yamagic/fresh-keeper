/**
 * Fresh Keeper 型定義のエクスポートファイル
 * すべての型定義をここから import できます
 */

// ===== 基本データモデル =====
export type {
  // 基本型
  ExpiryType,
  AlertLevel,
  AlertConfig,
  
  // ユーザー関連
  User,
  UserResponse,
  UserRegisterData,
  UserLoginData,
  
  // 製品関連
  Product,
  ProductResponse,
  ProductCreateData,
  ProductUpdateData,
} from './models';

export { EXPIRY_TYPE_LABELS } from './models';

// ===== API通信関連 =====
export type {
  // 共通API型
  ApiResponse,
  ApiError,
  Pagination,
  PaginatedResponse,
  
  // 認証API
  LoginResponse,
  CsrfTokenResponse,
  
  // 製品API
  ProductListResponse,
  ProductDetailResponse,
  ProductCreateResponse,
  ProductUpdateResponse,
  ProductDeleteResponse,
  
  // API設定
  ApiConfig,
  HttpMethod,
  ApiRequestConfig,
} from './api';

export { API_ENDPOINTS, QUERY_KEYS, MUTATION_KEYS } from './api';

// ===== フォーム関連 =====
export type {
  // フォームデータ型
  LoginFormData,
  SignupFormData,
  ProductFormData,
  
  // フォーム状態
  FormState,
  FieldState,
  ValidationErrors,
  FormDefaults,
} from './forms';

export {
  // バリデーションスキーマ
  loginFormSchema,
  signupFormSchema,
  productFormSchema,
  
  // 選択肢・デフォルト値
  EXPIRY_TYPE_OPTIONS,
  QUANTITY_OPTIONS,
  FORM_DEFAULTS,
} from './forms';

// ===== 認証関連 =====
export type {
  // 認証状態
  AuthStatus,
  AuthState,
  AuthContextType,
  UseAuthReturn,
  RequireAuthConfig,
  
  // CSRF
  CsrfState,
  CsrfConfig,
  
  // セッション
  SessionInfo,
  SessionConfig,
  
  // 権限
  UserRole,
  Permission,
  PermissionCheck,
  
  // パスワード
  PasswordStrength,
  PasswordRequirements,
  PasswordValidation,
  
  // エラー
  AuthErrorType,
  AuthError,
} from './auth';

export { AUTH_CONSTANTS } from './auth';