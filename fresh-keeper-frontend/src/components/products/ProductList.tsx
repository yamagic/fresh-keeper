/**
 * 製品一覧 - ProductCardを格子状に表示
 */

import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { SearchRounded, SortRounded } from '@mui/icons-material';
import { ProductResponse } from '@/types';
import ProductCard from './ProductCard';
import { LoadingSpinner, ErrorMessage } from '@/components/common';

interface ProductListProps {
  /** 製品データの配列 */
  products: ProductResponse[];
  /** データ読み込み中かどうか */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** エラー時の再試行処理 */
  onRetry?: () => void;
  /** カードのアクション */
  onEdit?: (product: ProductResponse) => void;
  onDelete?: (product: ProductResponse) => void;
  onToggleNotification?: (product: ProductResponse) => void;
}

// ソートオプション
const SORT_OPTIONS = [
  { value: 'expiry_asc', label: '期限が近い順' },
  { value: 'expiry_desc', label: '期限が遠い順' },
  { value: 'name_asc', label: '名前順（あ→わ）' },
  { value: 'name_desc', label: '名前順（わ→あ）' },
  { value: 'created_desc', label: '登録が新しい順' },
  { value: 'created_asc', label: '登録が古い順' },
] as const;

type SortOption = typeof SORT_OPTIONS[number]['value'];

export default function ProductList({
  products,
  loading = false,
  error,
  onRetry,
  onEdit,
  onDelete,
  onToggleNotification,
}: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('expiry_asc');

  // 製品のフィルタリング
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  // 製品のソート
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'expiry_asc':
        return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      case 'expiry_desc':
        return new Date(b.expiry_date).getTime() - new Date(a.expiry_date).getTime();
      case 'name_asc':
        return a.name.localeCompare(b.name, 'ja');
      case 'name_desc':
        return b.name.localeCompare(a.name, 'ja');
      case 'created_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'created_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  // アラートレベル別の統計
  const getAlertStats = () => {
    const stats = { expired: 0, danger: 0, warning: 0, safe: 0 };
    
    products.forEach((product) => {
      const daysLeft = product.days_left;
      if (daysLeft < 0) stats.expired++;
      else if (daysLeft <= 1) stats.danger++;
      else if (daysLeft <= 3) stats.warning++;
      else stats.safe++;
    });
    
    return stats;
  };

  const alertStats = getAlertStats();

  // ローディング表示
  if (loading) {
    return <LoadingSpinner message="製品を読み込み中..." />;
  }

  // エラー表示
  if (error) {
    return (
      <ErrorMessage
        message={error}
        title="製品の読み込みでエラーが発生しました"
        showRetry={!!onRetry}
        onRetry={onRetry}
      />
    );
  }

  return (
    <Box>
      {/* 統計情報 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SortRounded />
          製品統計（全{products.length}件）
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {alertStats.expired > 0 && (
            <Chip label={`期限切れ: ${alertStats.expired}件`} color="error" size="small" />
          )}
          {alertStats.danger > 0 && (
            <Chip label={`緊急: ${alertStats.danger}件`} color="error" variant="outlined" size="small" />
          )}
          {alertStats.warning > 0 && (
            <Chip label={`警告: ${alertStats.warning}件`} color="warning" size="small" />
          )}
          <Chip label={`安全: ${alertStats.safe}件`} color="success" variant="outlined" size="small" />
        </Stack>
      </Paper>

      {/* 検索・ソート コントロール */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* 検索ボックス */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="製品名や説明で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* ソート選択 */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>並び順</InputLabel>
              <Select
                value={sortBy}
                label="並び順"
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* 製品が見つからない場合 */}
      {sortedProducts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? '検索条件に一致する製品が見つかりません' : '製品が登録されていません'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? '検索キーワードを変更してみてください' : '新しい製品を登録してみましょう'}
          </Typography>
        </Paper>
      ) : (
        <>
          {/* 検索結果の表示 */}
          {searchQuery && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              「{searchQuery}」の検索結果: {sortedProducts.length}件
            </Typography>
          )}

          {/* 製品グリッド */}
          <Grid container spacing={2}>
            {sortedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleNotification={onToggleNotification}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}