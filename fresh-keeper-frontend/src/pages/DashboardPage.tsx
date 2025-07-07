/**
 * ダッシュボードページ - アプリのメイン画面
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
} from '@mui/material';
import {
  AddRounded,
  WarningRounded,
  ErrorRounded,
  CheckCircleRounded,
  TrendingUpRounded,
  NotificationsRounded,
  InventoryRounded,
} from '@mui/icons-material';
import { LoadingSpinner, ErrorMessage, AlertChip } from '@/components';
import { useAuth, useNotifications } from '@/stores';
import { productService } from '@/services';
import { ProductResponse } from '@/types';
import { ROUTES } from '@/router';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useNotifications();
  
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 製品データの取得
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      const errorMessage = err.message || '製品データの取得に失敗しました';
      setError(errorMessage);
      showError('データ取得エラー', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 統計の計算
  const getStats = () => {
    const total = products.length;
    const expired = products.filter(p => p.days_left < 0).length;
    const urgent = products.filter(p => p.days_left >= 0 && p.days_left <= 3).length;
    const safe = products.filter(p => p.days_left > 3).length;
    
    return { total, expired, urgent, safe };
  };

  const stats = getStats();
  const urgentProducts = products.filter(p => p.days_left >= 0 && p.days_left <= 3).slice(0, 5);
  const recentProducts = products.slice(0, 5);

  if (loading) {
    return <LoadingSpinner message="ダッシュボードを読み込み中..." fullScreen />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        title="ダッシュボードの読み込みでエラーが発生しました"
        showRetry
        onRetry={fetchProducts}
      />
    );
  }

  return (
    <Box>
      {/* ウェルカムメッセージ */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          おかえりなさい、{user?.name}さん 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          今日も食材を無駄なく活用しましょう
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 統計カード */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InventoryRounded color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">全製品</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                登録済み製品数
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ErrorRounded color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">期限切れ</Typography>
              </Box>
              <Typography variant="h4" color="error">
                {stats.expired}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                処分が必要
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningRounded color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">緊急</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {stats.urgent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3日以内に期限
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleRounded color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">安全</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.safe}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                まだ余裕がある
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 緊急アクション */}
        {stats.urgent > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningRounded sx={{ mr: 1 }} />
                <Typography variant="h6">
                  ⚠️ 緊急: {stats.urgent}個の製品が3日以内に期限切れです
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="warning"
                onClick={() => navigate(ROUTES.PRODUCTS)}
              >
                製品一覧で確認
              </Button>
            </Paper>
          </Grid>
        )}

        {/* 期限切れ間近の製品 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">🚨 期限切れ間近</Typography>
                <Chip label={`${urgentProducts.length}件`} color="warning" size="small" />
              </Box>
              
              {urgentProducts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleRounded color="success" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    期限切れ間近の製品はありません
                  </Typography>
                </Box>
              ) : (
                <List>
                  {urgentProducts.map((product) => (
                    <ListItem key={product.id} divider>
                      <ListItemIcon>
                        <NotificationsRounded color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.name}
                        secondary={`${product.description || ''}`}
                      />
                      <AlertChip daysLeft={product.days_left} />
                    </ListItem>
                  ))}
                </List>
              )}
              
              {urgentProducts.length > 0 && (
                <Button 
                  fullWidth 
                  variant="outlined"
                  onClick={() => navigate(ROUTES.PRODUCTS)}
                  sx={{ mt: 2 }}
                >
                  すべて見る
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 最近の製品 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">📦 最近の製品</Typography>
                <Chip label={`${recentProducts.length}件`} color="primary" size="small" />
              </Box>
              
              {recentProducts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <InventoryRounded color="action" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    製品が登録されていません
                  </Typography>
                  <Button 
                    variant="contained"
                    startIcon={<AddRounded />}
                    onClick={() => navigate(ROUTES.PRODUCT_NEW)}
                  >
                    最初の製品を追加
                  </Button>
                </Box>
              ) : (
                <List>
                  {recentProducts.map((product) => (
                    <ListItem key={product.id} divider>
                      <ListItemText
                        primary={product.name}
                        secondary={`${product.description || ''} - 登録: ${new Date(product.created_at).toLocaleDateString('ja-JP')}`}
                      />
                      <AlertChip daysLeft={product.days_left} />
                    </ListItem>
                  ))}
                </List>
              )}
              
              {recentProducts.length > 0 && (
                <Button 
                  fullWidth 
                  variant="outlined"
                  onClick={() => navigate(ROUTES.PRODUCTS)}
                  sx={{ mt: 2 }}
                >
                  すべて見る
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* クイックアクション */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ⚡ クイックアクション
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained"
                  startIcon={<AddRounded />}
                  onClick={() => navigate(ROUTES.PRODUCT_NEW)}
                >
                  製品を追加
                </Button>
                <Button 
                  variant="outlined"
                  startIcon={<InventoryRounded />}
                  onClick={() => navigate(ROUTES.PRODUCTS)}
                >
                  製品一覧
                </Button>
                <Button 
                  variant="outlined"
                  startIcon={<TrendingUpRounded />}
                  disabled
                >
                  統計レポート（準備中）
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}