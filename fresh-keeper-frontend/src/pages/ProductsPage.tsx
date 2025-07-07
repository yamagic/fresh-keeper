/**
 * 製品一覧ページ
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { ProductList, LoadingSpinner, ErrorMessage, ConfirmDialog } from '@/components';
import { useNotifications } from '@/stores';
import { productService } from '@/services';
import { ProductResponse } from '@/types';
import { ROUTES } from '@/router';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: ProductResponse | null;
  }>({ open: false, product: null });

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

  // 製品編集
  const handleEditProduct = (product: ProductResponse) => {
    navigate(ROUTES.PRODUCT_EDIT(product.id));
  };

  // 製品削除（確認ダイアログ表示）
  const handleDeleteProduct = (product: ProductResponse) => {
    setDeleteDialog({ open: true, product });
  };

  // 製品削除の実行
  const confirmDeleteProduct = async () => {
    const { product } = deleteDialog;
    if (!product) return;

    try {
      await productService.deleteProduct(product.id);
      
      // 一覧から削除
      setProducts(prev => prev.filter(p => p.id !== product.id));
      
      showSuccess('削除完了', `${product.name}を削除しました`);
    } catch (error: any) {
      showError('削除エラー', error.message || '製品の削除に失敗しました');
    } finally {
      setDeleteDialog({ open: false, product: null });
    }
  };

  // 通知設定切り替え
  const handleToggleNotification = async (product: ProductResponse) => {
    try {
      const updatedProduct = await productService.toggleProductNotification(
        product.id, 
        !product.is_notified
      );
      
      // 一覧を更新
      setProducts(prev => 
        prev.map(p => p.id === product.id ? updatedProduct : p)
      );
      
      const message = updatedProduct.is_notified ? '通知を有効にしました' : '通知を無効にしました';
      showSuccess('通知設定変更', message);
    } catch (error: any) {
      showError('設定エラー', error.message || '通知設定の変更に失敗しました');
    }
  };

  return (
    <Box>
      {/* ページヘッダー */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            製品一覧
          </Typography>
          <Typography variant="body1" color="text.secondary">
            登録された食材の管理と期限確認
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => navigate(ROUTES.PRODUCT_NEW)}
          size="large"
        >
          製品を追加
        </Button>
      </Box>

      {/* 製品一覧 */}
      <ProductList
        products={products}
        loading={loading}
        error={error}
        onRetry={fetchProducts}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onToggleNotification={handleToggleNotification}
      />

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="製品を削除"
        message={`「${deleteDialog.product?.name}」を削除しますか？この操作は取り消せません。`}
        confirmText="削除"
        confirmColor="error"
        onConfirm={confirmDeleteProduct}
        onCancel={() => setDeleteDialog({ open: false, product: null })}
      />
    </Box>
  );
}