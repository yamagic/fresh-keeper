/**
 * Fresh Keeper フォーム入力用の型定義
 * React Hook Form + Zod バリデーション対応
 */

import { z } from 'zod';
import { ExpiryType } from './models';

// ===== バリデーションスキーマ（Zod） =====

/**
 * ユーザーログインフォームのバリデーションスキーマ
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .min(8, 'パスワードは8文字以上で入力してください'),
});

/**
 * ユーザー登録フォームのバリデーションスキーマ
 */
export const signupFormSchema = z.object({
  name: z
    .string()
    .min(1, '名前を入力してください')
    .min(2, '名前は2文字以上で入力してください')
    .max(50, '名前は50文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードは大文字、小文字、数字を含む必要があります'
    ),
  confirmPassword: z
    .string()
    .min(1, 'パスワード確認を入力してください'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

/**
 * 製品作成・編集フォームのバリデーションスキーマ
 */
export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, '製品名を入力してください')
    .min(2, '製品名は2文字以上で入力してください')
    .max(100, '製品名は100文字以内で入力してください'),
  description: z
    .string()
    .max(500, '説明は500文字以内で入力してください')
    .optional(),
  quantity: z
    .number({
      required_error: '数量を入力してください',
      invalid_type_error: '数量は数値で入力してください',
    })
    .int('数量は整数で入力してください')
    .min(1, '数量は1以上で入力してください')
    .max(999, '数量は999以下で入力してください'),
  expiry_date: z
    .string()
    .min(1, '期限日を入力してください')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, '期限日は今日以降の日付を選択してください'),
  type: z.enum(['best_before', 'use_by'], {
    required_error: '期限の種類を選択してください',
  }),
});

// ===== フォーム型定義（Zodから自動生成） =====

/**
 * ログインフォームの型
 */
export type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * 登録フォームの型
 */
export type SignupFormData = z.infer<typeof signupFormSchema>;

/**
 * 製品フォームの型
 */
export type ProductFormData = z.infer<typeof productFormSchema>;

// ===== フォーム状態管理用型 =====

/**
 * フォームの送信状態
 */
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

/**
 * フォームのフィールド状態
 */
export interface FieldState {
  value: any;
  error: string | undefined;
  touched: boolean;
  dirty: boolean;
}

// ===== セレクトボックス用の選択肢型 =====

/**
 * 期限タイプ選択肢
 */
export const EXPIRY_TYPE_OPTIONS = [
  { value: 'best_before' as ExpiryType, label: '賞味期限' },
  { value: 'use_by' as ExpiryType, label: '消費期限' },
] as const;

/**
 * 数量選択肢（よく使われる数量）
 */
export const QUANTITY_OPTIONS = [
  { value: 1, label: '1個' },
  { value: 2, label: '2個' },
  { value: 3, label: '3個' },
  { value: 5, label: '5個' },
  { value: 10, label: '10個' },
] as const;

// ===== バリデーションヘルパー型 =====

/**
 * バリデーションエラーメッセージ
 */
export interface ValidationErrors {
  [key: string]: string | undefined;
}

/**
 * フォームのデフォルト値生成用の型
 */
export interface FormDefaults {
  login: LoginFormData;
  signup: Omit<SignupFormData, 'confirmPassword'>;
  product: ProductFormData;
}

/**
 * デフォルト値の定義
 */
export const FORM_DEFAULTS: FormDefaults = {
  login: {
    email: '',
    password: '',
  },
  signup: {
    name: '',
    email: '',
    password: '',
  },
  product: {
    name: '',
    description: '',
    quantity: 1,
    expiry_date: '',
    type: 'best_before',
  },
} as const;