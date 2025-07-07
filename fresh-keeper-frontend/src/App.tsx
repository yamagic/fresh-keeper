import { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryProvider } from '@/providers';
import { AppRouter } from '@/router';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/services';

// Material-UIのテーマを作成（日本語フォント対応）
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // 緑色（新鮮さをイメージ）
    },
    secondary: {
      main: '#FF9800', // オレンジ色（注意を促すイメージ）
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Noto Sans JP',
      'Hiragino Kaku Gothic ProN',
      'Hiragino Sans',
      'Meiryo',
      'sans-serif'
    ].join(','),
  },
});

function App() {
  const { initialize, isInitialized } = useAuthStore();

  // アプリ初期化
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // CSRFトークンの初期化
        await apiClient.initializeCsrfToken();
        
        // 認証状態の初期化
        await initialize();
      } catch (error) {
        console.error('App initialization error:', error);
        // エラーでも初期化完了とする
      }
    };

    initializeApp();
  }, [initialize]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryProvider>
        {isInitialized ? (
          <AppRouter />
        ) : (
          // 初期化中の表示（シンプルなローディング）
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '1.2rem',
            color: '#666'
          }}>
            🍎 Fresh Keeper を起動中...
          </div>
        )}
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;