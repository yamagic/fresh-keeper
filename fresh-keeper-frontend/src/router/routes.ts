/**
 * ルート定義と型安全なナビゲーション
 */

/**
 * アプリケーション内のルート定義
 */
export const ROUTES = {
  // パブリックルート
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // プライベートルート
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: number | string) => `/products/${id}`,
  PRODUCT_NEW: '/products/new',
  PRODUCT_EDIT: (id: number | string) => `/products/${id}/edit`,
  
  // 設定・アカウント
  SETTINGS: '/settings',
  
  // その他
  DEMO: '/demo',
  ROOT: '/',
} as const;

/**
 * ページタイトルの定義
 */
export const PAGE_TITLES = {
  [ROUTES.LOGIN]: 'ログイン',
  [ROUTES.SIGNUP]: 'アカウント登録',
  [ROUTES.DASHBOARD]: 'ダッシュボード',
  [ROUTES.PRODUCTS]: '製品一覧',
  [ROUTES.PRODUCT_NEW]: '製品を追加',
  [ROUTES.SETTINGS]: '設定',
  [ROUTES.DEMO]: 'コンポーネントデモ',
} as const;

/**
 * パンくずリスト用のルート階層定義
 */
export const ROUTE_HIERARCHY = {
  [ROUTES.DASHBOARD]: [],
  [ROUTES.PRODUCTS]: [
    { label: 'ダッシュボード', path: ROUTES.DASHBOARD }
  ],
  [ROUTES.PRODUCT_NEW]: [
    { label: 'ダッシュボード', path: ROUTES.DASHBOARD },
    { label: '製品一覧', path: ROUTES.PRODUCTS }
  ],
} as const;

/**
 * ナビゲーションメニューの定義
 */
export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
  },
  {
    id: 'products',
    label: '製品一覧',
    path: ROUTES.PRODUCTS,
    icon: 'inventory',
  },
  {
    id: 'add-product',
    label: '製品を追加',
    path: ROUTES.PRODUCT_NEW,
    icon: 'add',
  },
] as const;

/**
 * ルートパラメータの型定義
 */
export interface RouteParams {
  id: string;
}

/**
 * 型安全なルートパラメータ取得用のヘルパー
 */
export const getRouteParam = (params: any, key: keyof RouteParams): string => {
  const value = params[key];
  if (typeof value !== 'string') {
    throw new Error(`Route parameter '${key}' is missing or invalid`);
  }
  return value;
};