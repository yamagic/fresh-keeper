/**
 * 製品関連のカスタムフック - React Query対応
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services';
import { useNotifications } from '@/stores';
import type { ProductResponse, ProductCreateData, ProductUpdateData } from '@/types/models';
import { QUERY_KEYS } from '@/types/api';

/**
 * 製品一覧を取得するフック
 */
export const useProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    queryFn: productService.getProducts,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
    gcTime: 1000 * 60 * 10, // 10分間メモリに保持
  });
};

/**
 * 特定の製品詳細を取得するフック
 */
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_DETAIL(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id, // idが存在する場合のみクエリを実行
    staleTime: 1000 * 60 * 2, // 2分間キャッシュ
  });
};

/**
 * 製品作成のミューテーション
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: (data: ProductCreateData) => productService.createProduct(data),
    onSuccess: (newProduct) => {
      // 製品一覧のキャッシュを無効化（再取得）
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      
      showSuccess('製品登録完了', `${newProduct.name}を登録しました`);
    },
    onError: (error: any) => {
      showError('登録エラー', error.message || '製品の登録に失敗しました');
    },
  });
};

/**
 * 製品更新のミューテーション
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdateData }) => 
      productService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      // 関連するキャッシュを更新
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT_DETAIL(updatedProduct.id) });
      
      showSuccess('更新完了', `${updatedProduct.name}を更新しました`);
    },
    onError: (error: any) => {
      showError('更新エラー', error.message || '製品の更新に失敗しました');
    },
  });
};

/**
 * 製品削除のミューテーション
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // 製品一覧のキャッシュから削除された製品を除去
      queryClient.setQueryData<ProductResponse[]>(QUERY_KEYS.PRODUCTS, (oldData) => {
        return oldData?.filter(product => product.id !== deletedId) || [];
      });
      
      // 削除された製品の詳細キャッシュを無効化
      queryClient.removeQueries({ queryKey: QUERY_KEYS.PRODUCT_DETAIL(deletedId) });
      
      showSuccess('削除完了', '製品を削除しました');
    },
    onError: (error: any) => {
      showError('削除エラー', error.message || '製品の削除に失敗しました');
    },
  });
};

/**
 * 製品の通知設定を切り替えるミューテーション
 */
export const useToggleProductNotification = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ id, isNotified }: { id: number; isNotified: boolean }) => 
      productService.toggleProductNotification(id, isNotified),
    onSuccess: (updatedProduct) => {
      // 楽観的更新：即座にUIを更新
      queryClient.setQueryData<ProductResponse[]>(QUERY_KEYS.PRODUCTS, (oldData) => {
        return oldData?.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        ) || [];
      });
      
      // 詳細ページのキャッシュも更新
      queryClient.setQueryData(
        QUERY_KEYS.PRODUCT_DETAIL(updatedProduct.id), 
        updatedProduct
      );
      
      const message = updatedProduct.is_notified ? '通知を有効にしました' : '通知を無効にしました';
      showSuccess('通知設定変更', message);
    },
    onError: (error: any) => {
      // エラー時はキャッシュを無効化して正しいデータを再取得
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      showError('設定エラー', error.message || '通知設定の変更に失敗しました');
    },
  });
};

/**
 * 期限切れ間近の製品を取得するフック
 */
export const useUrgentProducts = (daysThreshold: number = 3) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, 'urgent', daysThreshold],
    queryFn: () => productService.getUrgentProducts(daysThreshold),
    staleTime: 1000 * 60 * 2, // 2分間キャッシュ
  });
};

/**
 * 製品統計を取得するフック
 */
export const useProductStats = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, 'stats'],
    queryFn: productService.getProductStats,
    staleTime: 1000 * 60 * 5, // 5分間キャッシュ
  });
};