/**
 * 製品編集ページ
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';
import { ProductForm, LoadingSpinner, ErrorMessage } from '@/components';
import { useNotifications } from '@/stores';
import { productService } from '@/services';
import type { ProductResponse } from '@/types/models';
import type { ProductFormData } from '@/types/forms';
import { ROUTES } from '@/router';

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 製品詳細の取得
  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id, 10));
    }
  }, [id]);

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProduct(productId);
      setProduct(data);
    } catch (err: any) {
      const errorMessage = err.message || '製品詳細の取得に失敗しました';
      setError(errorMessage);
      showError('データ取得エラー', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 製品更新
  const handleSubmit = async (data: ProductFormData) => {
    if (!product) return;

    try {
      const updatedProduct = await productService.updateProduct(product.id, data);
      
      showSuccess('更新完了', `${updatedProduct.name}を更新しました`);
      navigate(ROUTES.PRODUCT_DETAIL(product.id));
    } catch (error: any) {
      showError('更新エラー', error.message || '製品の更新に失敗しました');
      throw error; // フォームにエラーを表示するため再throw
    }
  };

  const handleCancel = () => {
    if (product) {
      navigate(ROUTES.PRODUCT_DETAIL(product.id));
    } else {
      navigate(ROUTES.PRODUCTS);
    }
  };

  if (loading) {
    return <LoadingSpinner message="製品情報を読み込み中..." />;
  }

  if (error || !product) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate(ROUTES.PRODUCTS)}
          sx={{ mb: 2 }}
        >
          製品一覧に戻る
        </Button>
        <ErrorMessage
          message={error || '製品が見つかりません'}
          title="製品の編集でエラーが発生しました"
          showRetry={!!id}
          onRetry={() => id && fetchProduct(parseInt(id, 10))}
        />
      </Box>
    );
  }

  // フォーム用のデフォルト値を準備
  const defaultValues: ProductFormData = {
    name: product.name,
    description: product.description,
    quantity: product.quantity,
    expiry_date: product.expiry_date.split('T')[0], // YYYY-MM-DD形式に変換
    type: product.type,
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
          詳細に戻る
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          製品を編集
        </Typography>
        <Typography variant="body1" color="text.secondary">
          「{product.name}」の情報を更新します
        </Typography>
      </Box>

      {/* 製品フォーム */}
      <ProductForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        title="製品を編集"
        submitText="更新する"
      />
    </Box>
  );
}