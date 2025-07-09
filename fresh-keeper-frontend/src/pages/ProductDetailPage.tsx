/**
 * 製品詳細ページ
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowBackRounded, EditRounded, DeleteRounded } from '@mui/icons-material';
import { ProductDetail, LoadingSpinner, ErrorMessage, ConfirmDialog } from '@/components';
import { useNotifications } from '@/stores';
import { productService } from '@/services';
import type { ProductResponse } from '@/types/models';
import { ROUTES, getRouteParam } from '@/router';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

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

  // 製品削除
  const handleDelete = async () => {
    if (!product) return;

    try {
      await productService.deleteProduct(product.id);
      
      showSuccess('削除完了', `${product.name}を削除しました`);
      navigate(ROUTES.PRODUCTS);
    } catch (error: any) {
      showError('削除エラー', error.message || '製品の削除に失敗しました');
    } finally {
      setDeleteDialog(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="製品詳細を読み込み中..." />;
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
          title="製品詳細の表示でエラーが発生しました"
          showRetry={!!id}
          onRetry={() => id && fetchProduct(parseInt(id, 10))}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* ページヘッダー */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: 3 
      }}>
        <Box>
          <Button
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate(ROUTES.PRODUCTS)}
            sx={{ mb: 2 }}
          >
            製品一覧に戻る
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            製品詳細
          </Typography>
        </Box>
        
        {/* アクションボタン */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditRounded />}
            onClick={() => navigate(ROUTES.PRODUCT_EDIT(product.id))}
          >
            編集
          </Button>
          
          <IconButton
            color="error"
            onClick={() => setDeleteDialog(true)}
            title="削除"
          >
            <DeleteRounded />
          </IconButton>
        </Box>
      </Box>

      {/* 製品詳細 */}
      <ProductDetail product={product} />

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        open={deleteDialog}
        title="製品を削除"
        message={`「${product.name}」を削除しますか？この操作は取り消せません。`}
        confirmText="削除"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
      />
    </Box>
  );
}