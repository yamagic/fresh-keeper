/**
 * ログインページ
 */

import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Box, Typography, Button } from '@mui/material';
import { LoginForm } from '@/components';
import { useAuth, useNotifications } from '@/stores';
import { LoginFormData } from '@/types';
import { ROUTES } from '@/router';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password);
      
      showSuccess('ログイン成功', 'Fresh Keeperへようこそ！');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      showError('ログインエラー', error.message || 'ログインに失敗しました');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      py: 4,
    }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4 }}>
        {/* ヘッダー */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            🍎 Fresh Keeper
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            ログイン
          </Typography>
          <Typography variant="body2" color="text.secondary">
            食材の賞味期限を管理して、食品廃棄を減らしましょう
          </Typography>
        </Box>

        {/* ログインフォーム */}
        <LoginForm 
          onSubmit={handleSubmit}
          loading={isLoading}
          error={error}
        />

        {/* 登録リンク */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            アカウントをお持ちでない方は
          </Typography>
          <Button 
            component={Link} 
            to={ROUTES.SIGNUP}
            variant="text"
            sx={{ mt: 1 }}
          >
            アカウントを作成
          </Button>
        </Box>

        {/* デモアクセス */}
        <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            開発・テスト用
          </Typography>
          <Button 
            component={Link} 
            to={ROUTES.DEMO}
            variant="outlined"
            size="small"
            color="secondary"
          >
            コンポーネントデモを見る
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}