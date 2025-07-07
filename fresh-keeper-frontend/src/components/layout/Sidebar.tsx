/**
 * サイドバーコンポーネント - ナビゲーションメニュー
 */

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  DashboardRounded,
  InventoryRounded,
  AddBoxRounded,
  NotificationsRounded,
  SettingsRounded,
  InfoRounded,
} from '@mui/icons-material';

interface SidebarProps {
  /** サイドバーの表示状態 */
  open: boolean;
  /** サイドバーを閉じる処理 */
  onClose: () => void;
  /** 現在のページ */
  currentPage?: string;
  /** ページ変更時の処理 */
  onPageChange?: (page: string) => void;
  /** 未読通知の数 */
  notificationCount?: number;
  /** 期限切れ間近の製品数 */
  urgentProductCount?: number;
}

// ナビゲーションメニューの定義
const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    icon: <DashboardRounded />,
    description: '概要と統計',
  },
  {
    id: 'products',
    label: '製品一覧',
    icon: <InventoryRounded />,
    description: '登録済みの製品',
  },
  {
    id: 'add-product',
    label: '製品を追加',
    icon: <AddBoxRounded />,
    description: '新しい製品を登録',
  },
  {
    id: 'notifications',
    label: '通知',
    icon: <NotificationsRounded />,
    description: '期限切れアラート',
  },
] as const;

const SETTINGS_ITEMS = [
  {
    id: 'settings',
    label: '設定',
    icon: <SettingsRounded />,
    description: 'アカウント設定',
  },
  {
    id: 'about',
    label: 'アプリについて',
    icon: <InfoRounded />,
    description: 'バージョン情報',
  },
] as const;

export default function Sidebar({
  open,
  onClose,
  currentPage = 'dashboard',
  onPageChange,
  notificationCount = 0,
  urgentProductCount = 0,
}: SidebarProps) {
  const handleItemClick = (pageId: string) => {
    onPageChange?.(pageId);
    onClose(); // モバイルでは選択後にサイドバーを閉じる
  };

  const renderBadge = (itemId: string) => {
    if (itemId === 'notifications' && notificationCount > 0) {
      return (
        <Chip 
          label={notificationCount} 
          color="error" 
          size="small" 
          sx={{ ml: 1 }}
        />
      );
    }
    if (itemId === 'products' && urgentProductCount > 0) {
      return (
        <Chip 
          label={urgentProductCount} 
          color="warning" 
          size="small" 
          sx={{ ml: 1 }}
        />
      );
    }
    return null;
  };

  const sidebarContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          🍎 Fresh Keeper
        </Typography>
        <Typography variant="caption" color="text.secondary">
          食材の賞味期限管理
        </Typography>
      </Box>

      {/* メインナビゲーション */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ pt: 1 }}>
          <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
            メニュー
          </Typography>
          
          {NAVIGATION_ITEMS.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentPage === item.id}
                onClick={() => handleItemClick(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: currentPage === item.id ? 'inherit' : 'action.active',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  secondary={item.description}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    sx: { 
                      color: currentPage === item.id ? 'inherit' : 'text.secondary',
                      opacity: currentPage === item.id ? 0.8 : 1,
                    }
                  }}
                />
                {renderBadge(item.id)}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* 設定セクション */}
        <List>
          <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.75rem' }}>
            その他
          </Typography>
          
          {SETTINGS_ITEMS.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={currentPage === item.id}
                onClick={() => handleItemClick(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: currentPage === item.id ? 'inherit' : 'action.active',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  secondary={item.description}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    sx: { 
                      color: currentPage === item.id ? 'inherit' : 'text.secondary',
                      opacity: currentPage === item.id ? 0.8 : 1,
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* フッター */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © 2024 Fresh Keeper
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary" // モバイル対応
      ModalProps={{
        keepMounted: true, // モバイルパフォーマンス向上
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}