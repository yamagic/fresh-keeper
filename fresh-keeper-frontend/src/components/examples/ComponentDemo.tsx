/**
 * コンポーネントの使用例・デモページ
 * 実際の開発では不要ですが、学習・テスト用として作成
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import {
  LoadingSpinner,
  ErrorMessage,
  ConfirmDialog,
  AlertChip,
  LoginForm,
  SignupForm,
  ProductForm,
  ProductCard,
  ProductList,
  Layout,
} from '@/components';
import { ProductResponse, LoginFormData, SignupFormData, ProductFormData } from '@/types';

// ===== モックデータ =====

const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'テストユーザー',
};

const mockProducts: ProductResponse[] = [
  {
    id: 1,
    name: '牛乳',
    description: '明治おいしい牛乳 1L',
    quantity: 1,
    expiry_date: '2024-01-15',
    type: 'use_by',
    is_notified: false,
    days_left: 2,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 2,
    name: 'りんご',
    description: '青森産ふじりんご',
    quantity: 5,
    expiry_date: '2024-01-20',
    type: 'best_before',
    is_notified: true,
    days_left: 7,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 3,
    name: '食パン',
    description: 'ヤマザキ超芸術トマト',
    quantity: 1,
    expiry_date: '2024-01-12',
    type: 'use_by',
    is_notified: false,
    days_left: -1,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
];

export default function ComponentDemo() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== イベントハンドラー =====

  const handleLoginSubmit = async (data: LoginFormData) => {
    console.log('Login form submitted:', data);
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleSignupSubmit = async (data: SignupFormData) => {
    console.log('Signup form submitted:', data);
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleProductSubmit = async (data: ProductFormData) => {
    console.log('Product form submitted:', data);
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleProductEdit = (product: ProductResponse) => {
    console.log('Edit product:', product);
  };

  const handleProductDelete = (product: ProductResponse) => {
    console.log('Delete product:', product);
    setShowConfirmDialog(true);
  };

  const handleProductToggleNotification = (product: ProductResponse) => {
    console.log('Toggle notification:', product);
  };

  return (
    <Layout
      user={mockUser}
      currentPage="demo"
      onLogout={() => console.log('Logout')}
      onAddProduct={() => console.log('Add product')}
      notificationCount={3}
      urgentProductCount={2}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Fresh Keeper コンポーネントデモ
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          作成したコンポーネントの動作確認用ページです。
        </Typography>

        <Grid container spacing={4}>
          {/* ===== 共通コンポーネント ===== */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                共通コンポーネント
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    AlertChip
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <AlertChip daysLeft={-1} />
                    <AlertChip daysLeft={0} />
                    <AlertChip daysLeft={1} />
                    <AlertChip daysLeft={3} />
                    <AlertChip daysLeft={7} />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    LoadingSpinner
                  </Typography>
                  <LoadingSpinner message="データを読み込み中..." />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    ErrorMessage & ConfirmDialog
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => setShowError(!showError)}
                    >
                      エラー表示切り替え
                    </Button>
                    <Button 
                      variant="outlined"
                      onClick={() => setShowConfirmDialog(true)}
                    >
                      確認ダイアログを表示
                    </Button>
                  </Box>
                  
                  {showError && (
                    <ErrorMessage
                      message="テストエラーメッセージです"
                      showRetry
                      onRetry={() => setShowError(false)}
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* ===== 製品コンポーネント ===== */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                製品コンポーネント
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                ProductCard 単体表示
              </Typography>
              <Grid container spacing={2}>
                {mockProducts.slice(0, 3).map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard
                      product={product}
                      onEdit={handleProductEdit}
                      onDelete={handleProductDelete}
                      onToggleNotification={handleProductToggleNotification}
                    />
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                ProductList 一覧表示
              </Typography>
              <ProductList
                products={mockProducts}
                loading={loading}
                onEdit={handleProductEdit}
                onDelete={handleProductDelete}
                onToggleNotification={handleProductToggleNotification}
              />
            </Paper>
          </Grid>

          {/* ===== フォームコンポーネント ===== */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                ログインフォーム
              </Typography>
              <LoginForm
                onSubmit={handleLoginSubmit}
                loading={loading}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                製品フォーム
              </Typography>
              <ProductForm
                onSubmit={handleProductSubmit}
                loading={loading}
                title="テスト製品登録"
              />
            </Paper>
          </Grid>
        </Grid>

        {/* ===== ダイアログ ===== */}
        <ConfirmDialog
          open={showConfirmDialog}
          title="製品を削除"
          message="本当にこの製品を削除しますか？この操作は取り消せません。"
          confirmText="削除"
          confirmColor="error"
          onConfirm={() => {
            console.log('Product deleted');
            setShowConfirmDialog(false);
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      </Box>
    </Layout>
  );
}