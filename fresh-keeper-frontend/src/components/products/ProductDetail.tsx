/**
 * 製品詳細表示 - 1つの製品の詳細情報を表示
 */

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LabelRounded,
  DescriptionRounded,
  NumbersRounded,
  CalendarTodayRounded,
  NotificationsRounded,
  AccessTimeRounded,
  UpdateRounded,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { ProductResponse } from '@/types/models';
import { EXPIRY_TYPE_LABELS } from '@/types/models';
import { AlertChip } from '@/components/common';

interface ProductDetailProps {
  /** 製品データ */
  product: ProductResponse;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  // 日付フォーマット関数
  const formatDate = (dateString: string, includeTime = false): string => {
    try {
      const date = new Date(dateString);
      const formatString = includeTime 
        ? 'yyyy年M月d日(E) HH:mm' 
        : 'yyyy年M月d日(E)';
      return format(date, formatString, { locale: ja });
    } catch {
      return dateString;
    }
  };

  // 残り日数に基づくメッセージ
  const getExpiryMessage = (daysLeft: number): { message: string; color: string } => {
    if (daysLeft < 0) {
      return { message: `${Math.abs(daysLeft)}日前に期限切れ`, color: 'error.main' };
    }
    if (daysLeft === 0) {
      return { message: '今日が期限日です！', color: 'error.main' };
    }
    if (daysLeft === 1) {
      return { message: '明日が期限日です', color: 'warning.main' };
    }
    if (daysLeft <= 3) {
      return { message: 'もうすぐ期限です', color: 'warning.main' };
    }
    if (daysLeft <= 7) {
      return { message: 'まだ時間があります', color: 'info.main' };
    }
    return { message: '十分な期間があります', color: 'success.main' };
  };

  const expiryInfo = getExpiryMessage(product.days_left);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* メインカード */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* ヘッダー部分 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h6" color={expiryInfo.color} gutterBottom>
                {expiryInfo.message}
              </Typography>
            </Box>
            <AlertChip daysLeft={product.days_left} size="medium" />
          </Box>

          {/* 説明文 */}
          {product.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* 詳細情報グリッド */}
          <Grid container spacing={3}>
            {/* 基本情報 */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  基本情報
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <NumbersRounded />
                    </ListItemIcon>
                    <ListItemText 
                      primary="数量" 
                      secondary={`${product.quantity}個`} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <LabelRounded />
                    </ListItemIcon>
                    <ListItemText 
                      primary="期限の種類" 
                      secondary={EXPIRY_TYPE_LABELS[product.type]} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayRounded />
                    </ListItemIcon>
                    <ListItemText 
                      primary={EXPIRY_TYPE_LABELS[product.type]}
                      secondary={formatDate(product.expiry_date)} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsRounded />
                    </ListItemIcon>
                    <ListItemText 
                      primary="通知状態" 
                      secondary={
                        <Chip 
                          label={product.is_notified ? '通知済み' : '未通知'} 
                          color={product.is_notified ? 'primary' : 'default'}
                          size="small"
                        />
                      } 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* メタ情報 */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  管理情報
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeRounded />
                    </ListItemIcon>
                    <ListItemText 
                      primary="登録日時" 
                      secondary={formatDate(product.created_at, true)} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <UpdateRounded />
                    </ListItemIcon>
                    <ListItemText 
                      primary="最終更新" 
                      secondary={formatDate(product.updated_at, true)} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <NumbersRounded />
                    </ListItemIcon>
                    <ListItemText 
                      primary="製品ID" 
                      secondary={product.id} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 期限についての詳細情報 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            期限について
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {product.type === 'best_before' 
                ? '賞味期限は、おいしく食べることができる期限です。この期限を過ぎても、すぐに食べられなくなるわけではありません。'
                : '消費期限は、安全に食べることができる期限です。この期限を過ぎた食品は食べない方が良いでしょう。'
              }
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`残り${product.days_left}日`}
              color={product.days_left <= 3 ? 'error' : product.days_left <= 7 ? 'warning' : 'success'}
            />
            <Chip 
              label={EXPIRY_TYPE_LABELS[product.type]}
              variant="outlined"
            />
            {product.is_notified && (
              <Chip 
                label="通知済み"
                color="info"
                icon={<NotificationsRounded />}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}