import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box } from '@mui/material';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* ヘッダー */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🍎 Fresh Keeper
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* メインコンテンツ */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            新鮮な食材を管理しよう
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fresh Keeperは、食材の賞味期限を追跡し、食品廃棄を減らすお手伝いをします。
          </Typography>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              🚀 開発中...
            </Typography>
            <Typography variant="body2">
              現在、以下の機能を開発中です：
            </Typography>
            <ul>
              <li>ユーザー登録・ログイン機能</li>
              <li>食材の登録・管理機能</li>
              <li>賞味期限アラート機能</li>
              <li>レスポンシブデザイン</li>
            </ul>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;