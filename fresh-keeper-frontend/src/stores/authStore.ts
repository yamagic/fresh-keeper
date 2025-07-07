/**
 * 認証状態管理 - Zustand ストア
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, UserResponse, AUTH_CONSTANTS } from '@/types';
import { authService } from '@/services';

interface AuthStore extends AuthState {
  // 追加のヘルパー
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // 初期化完了フラグ
  isInitialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 初期状態
      status: 'idle',
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isInitialized: false,

      // ローディング状態管理
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // 初期化状態管理
      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized });
      },

      // エラークリア
      clearError: () => {
        set({ error: null });
      },

      // ログイン
      login: async (email: string, password: string) => {
        const { setLoading, clearError } = get();
        
        try {
          setLoading(true);
          clearError();
          set({ status: 'loading' });

          const user = await authService.login({ email, password });
          
          set({ 
            status: 'authenticated',
            user,
            isAuthenticated: true,
            error: null,
            isLoading: false,
          });

          console.log('Login successful:', user);
        } catch (error: any) {
          const errorMessage = error.message || 'ログインに失敗しました';
          set({ 
            status: 'error',
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          throw error;
        }
      },

      // ユーザー登録
      signup: async (name: string, email: string, password: string) => {
        const { setLoading, clearError } = get();
        
        try {
          setLoading(true);
          clearError();
          set({ status: 'loading' });

          const user = await authService.signup({ name, email, password });
          
          set({ 
            status: 'authenticated',
            user,
            isAuthenticated: true,
            error: null,
            isLoading: false,
          });

          console.log('Signup successful:', user);
        } catch (error: any) {
          const errorMessage = error.message || 'アカウント作成に失敗しました';
          set({ 
            status: 'error',
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          throw error;
        }
      },

      // ログアウト
      logout: async () => {
        const { setLoading } = get();
        
        try {
          setLoading(true);
          
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
          // ログアウトエラーでも状態はクリアする
        } finally {
          set({ 
            status: 'unauthenticated',
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
          
          console.log('Logout completed');
        }
      },

      // 認証状態確認
      checkAuth: async () => {
        const { setLoading, clearError } = get();
        
        try {
          setLoading(true);
          clearError();

          const user = await authService.getCurrentUser();
          
          if (user) {
            set({ 
              status: 'authenticated',
              user,
              isAuthenticated: true,
              error: null,
              isLoading: false,
            });
          } else {
            set({ 
              status: 'unauthenticated',
              user: null,
              isAuthenticated: false,
              error: null,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ 
            status: 'unauthenticated',
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        }
      },

      // アプリ初期化
      initialize: async () => {
        const { checkAuth, setInitialized } = get();
        
        try {
          console.log('Initializing auth store...');
          
          // 認証状態の確認
          await checkAuth();
          
          setInitialized(true);
          console.log('Auth store initialized');
        } catch (error) {
          console.error('Auth store initialization error:', error);
          setInitialized(true); // エラーでも初期化完了とする
        }
      },
    }),
    {
      name: AUTH_CONSTANTS.STORAGE_KEYS.USER, // localStorage のキー
      partialize: (state) => ({
        // 永続化する状態を選択（認証状態とユーザー情報のみ）
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        status: state.status,
      }),
      onRehydrateStorage: () => (state) => {
        // ストア復元時の処理
        if (state) {
          console.log('Auth store rehydrated:', state.user?.name);
        }
      },
    }
  )
);

// カスタムフック
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // 状態
    ...store,
    
    // 便利なプロパティ
    isLoggedIn: store.isAuthenticated,
    userName: store.user?.name || null,
    userEmail: store.user?.email || null,
    
    // アクション
    login: store.login,
    signup: store.signup,
    logout: store.logout,
    clearError: store.clearError,
  };
};