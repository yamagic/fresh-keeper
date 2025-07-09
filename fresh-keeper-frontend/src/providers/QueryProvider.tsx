/**
 * React Query プロバイダー設定
 */

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// QueryClient の設定
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // デフォルトのクエリ設定
      staleTime: 1000 * 60 * 5, // 5分間キャッシュ
      gcTime: 1000 * 60 * 10, // 10分間メモリに保持
      retry: (failureCount, error: any) => {
        // 認証エラー(401, 403)やクライアントエラー(4xx)では再試行しない
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // その他のエラーは3回まで再試行
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
    },
    mutations: {
      // デフォルトのミューテーション設定
      retry: false, // ミューテーションは再試行しない
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevToolsを一時的に無効化 */}
      {/* {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
        />
      )} */}
    </QueryClientProvider>
  );
}