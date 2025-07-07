/**
 * ユーザー登録ページ
 */

import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Box, Typography, Button } from '@mui/material';
import { SignupForm } from '@/components';
import { useAuth, useNotifications } from '@/stores';
import { SignupFormData } from '@/types';
import { ROUTES } from '@/router';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (data: SignupFormData) => {
    try {
      clearError();
      await signup(data.name, data.email, data.password);
      
      showSuccess('アカウント作成成功', `${data.name}さん、Fresh Keeperへようこそ！`);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      showError('登録エラー', error.message || 'アカウント作成に失敗しました');
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
            アカウント作成
          </Typography>
          <Typography variant="body2" color="text.secondary">
            無料でアカウントを作成して、食材管理を始めましょう
          </Typography>
        </Box>

        {/* 登録フォーム */}
        <SignupForm 
          onSubmit={handleSubmit}
          loading={isLoading}
          error={error}
        />

        {/* ログインリンク */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            既にアカウントをお持ちの方は
          </Typography>
          <Button 
            component={Link} 
            to={ROUTES.LOGIN}
            variant="text"
            sx={{ mt: 1 }}
          >
            ログイン
          </Button>
        </Box>

        {/* 利用規約とプライバシーポリシー */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            アカウントを作成することで、
            <Link to="#" style={{ textDecoration: 'none' }}>利用規約</Link>
            および
            <Link to="#" style={{ textDecoration: 'none' }}>プライバシーポリシー</Link>
            に同意したものとみなされます。
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}