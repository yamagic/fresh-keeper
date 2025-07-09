/**
 * 認証関連のカスタムフック - React Query対応
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { useAuthStore, useNotifications } from '@/stores';
import type { LoginFormData } from '@/types/forms';
import type { UserRegisterData } from '@/types/models';
import { QUERY_KEYS } from '@/types/api';
import { ROUTES } from '@/router';

/**
 * ログインミューテーション
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const setUser = useAuthStore(state => state.login);

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (user) => {
      showSuccess('ログイン成功', 'Fresh Keeperへようこそ！');
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      showError('ログインエラー', error.message || 'ログインに失敗しました');
    },
  });
};

/**
 * ユーザー登録ミューテーション
 */
export const useSignup = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const signup = useAuthStore(state => state.signup);

  return useMutation({
    mutationFn: (data: UserRegisterData) => authService.signup(data),
    onSuccess: (user) => {
      showSuccess('アカウント作成成功', `${user.name}さん、Fresh Keeperへようこそ！`);
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      showError('登録エラー', error.message || 'アカウント作成に失敗しました');
    },
  });
};

/**
 * ログアウトミューテーション
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const logout = useAuthStore(state => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      showSuccess('ログアウト', 'またのご利用をお待ちしています');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      // ログアウトエラーでもローカル状態はクリア
      logout();
      showError('ログアウトエラー', 'ローカルからログアウトしました');
      navigate(ROUTES.LOGIN);
    },
  });
};

/**
 * 現在のユーザー情報を取得するクエリ
 */
export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated, // 認証済みの場合のみ実行
    staleTime: 1000 * 60 * 10, // 10分間キャッシュ
    retry: false, // 失敗時の自動リトライを無効
  });
};

/**
 * 認証状態初期化フック
 */
export const useAuthInitialization = () => {
  const { initialize, isInitialized } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'initialization'],
    queryFn: async () => {
      await initialize();
      return true;
    },
    enabled: !isInitialized,
    staleTime: Infinity, // 初期化は一度だけ
    retry: false,
  });
};