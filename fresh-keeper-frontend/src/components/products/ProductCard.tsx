/**
 * 製品カード - 製品情報を1つのカードで表示
 */

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { 
  EditRounded, 
  DeleteRounded, 
  NotificationsRounded,
  NotificationsOffRounded,
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ProductResponse, EXPIRY_TYPE_LABELS } from '@/types';
import { AlertChip } from '@/components/common';

interface ProductCardProps {
  /** 製品データ */
  product: ProductResponse;
  /** 編集ボタンクリック時の処理 */
  onEdit?: (product: ProductResponse) => void;
  /** 削除ボタンクリック時の処理 */
  onDelete?: (product: ProductResponse) => void;
  /** 通知設定変更時の処理 */
  onToggleNotification?: (product: ProductResponse) => void;
  /** アクションボタンを表示するかどうか */
  showActions?: boolean;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleNotification,
  showActions = true,
}: ProductCardProps) {
  // 期限日をフォーマット
  const formatExpiryDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy年M月d日(E)', { locale: ja });
    } catch {
      return dateString;
    }
  };

  // 残り日数の計算（バックエンドのdays_leftと一致させる）
  const calculateDaysLeft = (expiryDate: string): number => {
    try {
      const expiry = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiry.setHours(0, 0, 0, 0);
      return differenceInDays(expiry, today);
    } catch {
      return 0;
    }
  };

  const daysLeft = calculateDaysLeft(product.expiry_date);

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* 製品名とアラートチップ */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 1 }}>
            {product.name}
          </Typography>
          <AlertChip daysLeft={daysLeft} />
        </Box>

        {/* 説明文 */}
        {product.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2 }}
            noWrap
          >
            {product.description}
          </Typography>
        )}

        {/* 製品詳細情報 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* 数量 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              数量:
            </Typography>
            <Chip label={`${product.quantity}個`} size="small" variant="outlined" />
          </Box>

          {/* 期限タイプ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {EXPIRY_TYPE_LABELS[product.type]}:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatExpiryDate(product.expiry_date)}
            </Typography>
          </Box>

          {/* 残り日数表示 */}
          <Typography 
            variant="body2" 
            color={daysLeft <= 1 ? 'error.main' : daysLeft <= 3 ? 'warning.main' : 'text.secondary'}
            fontWeight={daysLeft <= 3 ? 'bold' : 'normal'}
          >
            {daysLeft < 0 ? '期限切れ' : daysLeft === 0 ? '今日が期限' : `残り${daysLeft}日`}
          </Typography>

          {/* 通知状態 */}
          {product.is_notified && (
            <Chip 
              label="通知済み" 
              size="small" 
              color="info" 
              icon={<NotificationsRounded />}
            />
          )}
        </Box>
      </CardContent>

      {/* アクションボタン */}
      {showActions && (
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          {/* 通知切り替えボタン */}
          {onToggleNotification && (
            <Tooltip title={product.is_notified ? '通知を無効にする' : '通知を有効にする'}>
              <IconButton 
                size="small"
                onClick={() => onToggleNotification(product)}
                color={product.is_notified ? 'primary' : 'default'}
              >
                {product.is_notified ? <NotificationsRounded /> : <NotificationsOffRounded />}
              </IconButton>
            </Tooltip>
          )}

          {/* 編集ボタン */}
          {onEdit && (
            <Tooltip title="編集">
              <IconButton 
                size="small"
                onClick={() => onEdit(product)}
                color="primary"
              >
                <EditRounded />
              </IconButton>
            </Tooltip>
          )}

          {/* 削除ボタン */}
          {onDelete && (
            <Tooltip title="削除">
              <IconButton 
                size="small"
                onClick={() => onDelete(product)}
                color="error"
              >
                <DeleteRounded />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      )}
    </Card>
  );
}