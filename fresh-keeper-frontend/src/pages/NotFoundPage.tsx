/**
 * 404 Not Found ページ
 */

import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import { HomeRounded, ArrowBackRounded } from '@mui/icons-material';
import { ROUTES } from '@/router';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <Box sx={{ width: '100%' }}>
        {/* 404 イラスト */}
        <Typography variant="h1" sx={{ 
          fontSize: '6rem', 
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 2,
        }}>
          404
        </Typography>

        {/* エラーメッセージ */}
        <Typography variant="h4" component="h1" gutterBottom>
          ページが見つかりません
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          お探しのページは存在しないか、移動された可能性があります。
        </Typography>

        {/* 果物のイラスト */}
        <Typography variant="h2" sx={{ my: 3 }}>
          🍎🥕🥬
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Fresh Keeperで食材を無駄なく管理しましょう
        </Typography>

        {/* アクションボタン */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexWrap: 'wrap',
          mt: 4,
        }}>
          <Button
            variant="contained"
            startIcon={<HomeRounded />}
            onClick={() => navigate(ROUTES.DASHBOARD)}
            size="large"
          >
            ダッシュボードに戻る
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate(-1)}
            size="large"
          >
            前のページに戻る
          </Button>
        </Box>

        {/* 便利なリンク */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            よく使われるページ
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              size="small" 
              onClick={() => navigate(ROUTES.PRODUCTS)}
            >
              製品一覧
            </Button>
            <Button 
              size="small" 
              onClick={() => navigate(ROUTES.PRODUCT_NEW)}
            >
              製品を追加
            </Button>
            <Button 
              size="small" 
              onClick={() => navigate(ROUTES.DEMO)}
            >
              デモページ
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}