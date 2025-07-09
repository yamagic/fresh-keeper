/**
 * Fresh Keeper 型定義のエクスポートファイル
 * すべての型定義をここから import できます
 */

// ===== 基本データモデル =====
export type {
  ExpiryType,
  AlertLevel,
  AlertConfig,
  User,
  UserResponse,
  UserRegisterData,
  UserLoginData,
  Product,
  ProductResponse,
  ProductCreateData,
  ProductUpdateData,
} from './models';

export { EXPIRY_TYPE_LABELS } from './models';

// ===== API通信関連 =====
export type {
  ApiResponse,
  ApiError,
  Pagination,
  PaginatedResponse,
  LoginResponse,
  CsrfTokenResponse,
  ProductListResponse,
  ProductDetailResponse,
  ProductCreateResponse,
  ProductUpdateResponse,
  ProductDeleteResponse,
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