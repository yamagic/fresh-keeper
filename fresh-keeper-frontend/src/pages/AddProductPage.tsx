/**
 * 製品追加ページ
 */

import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';
import { ProductForm } from '@/components';
import { useNotifications } from '@/stores';
import { productService } from '@/services';
import { ProductFormData } from '@/types';
import { ROUTES } from '@/router';

export default function AddProductPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const newProduct = await productService.createProduct(data);
      
      showSuccess('製品登録完了', `${newProduct.name}を登録しました`);
      navigate(ROUTES.PRODUCTS);
    } catch (error: any) {
      showError('登録エラー', error.message || '製品の登録に失敗しました');
      throw error; // フォームにエラーを表示するため再throw
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PRODUCTS);
  };

  return (
    <Box>
      {/* ページヘッダー */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          製品一覧に戻る
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          新しい製品を追加
        </Typography>
        <Typography variant="body1" color="text.secondary">
          食材の情報を入力して、賞味期限の管理を始めましょう
        </Typography>
      </Box>

      {/* 使い方のヒント */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          💡 製品登録のコツ
        </Typography>
        <Typography variant="body2" paragraph>
          • 製品名は分かりやすく具体的に（例：「牛乳」→「明治おいしい牛乳 1L」）
        </Typography>
        <Typography variant="body2" paragraph>
          • 説明欄にはブランド名や購入場所を記入すると便利です
        </Typography>
        <Typography variant="body2">
          • 賞味期限と消費期限を正しく選択してください
        </Typography>
      </Paper>

      {/* 製品フォーム */}
      <ProductForm
        onSubmit={handleSubmit}
        title="製品を登録"
        submitText="登録する"
      />
    </Box>
  );
}