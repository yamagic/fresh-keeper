/**
 * ヘッダーコンポーネント - アプリの上部ナビゲーション
 */

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  MenuRounded,
  AccountCircleRounded,
  NotificationsRounded,
  LogoutRounded,
  SettingsRounded,
  AddRounded,
} from '@mui/icons-material';
import { UserResponse } from '@/types';

interface HeaderProps {
  /** ログイン中のユーザー情報 */
  user?: UserResponse | null;
  /** ログアウト処理 */
  onLogout?: () => void;
  /** 新規製品追加ボタンクリック時の処理 */
  onAddProduct?: () => void;
  /** メニューボタンクリック時の処理（モバイル用） */
  onMenuClick?: () => void;
  /** 未読通知の数 */
  notificationCount?: number;
}

export default function Header({
  user,
  onLogout,
  onAddProduct,
  onMenuClick,
  notificationCount = 0,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(anchorEl);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout?.();
  };

  // ユーザーの頭文字を取得（アバター用）
  const getUserInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <AppBar position="static" sx={{ mb: 0 }}>
      <Toolbar>
        {/* モバイルメニューボタン */}
        {onMenuClick && (
          <IconButton
            color="inherit"
            aria-label="メニューを開く"
            onClick={onMenuClick}
            edge="start"
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuRounded />
          </IconButton>
        )}

        {/* アプリタイトル */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          🍎 Fresh Keeper
          {user && (
            <Typography variant="body2" sx={{ ml: 2, opacity: 0.8, display: { xs: 'none', sm: 'block' } }}>
              {user.name}さん、こんにちは
            </Typography>
          )}
        </Typography>

        {/* ログイン時のボタン群 */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 新規追加ボタン */}
            {onAddProduct && (
              <Button
                color="inherit"
                startIcon={<AddRounded />}
                onClick={onAddProduct}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                製品を追加
              </Button>
            )}

            {/* 新規追加ボタン（モバイル用） */}
            {onAddProduct && (
              <Tooltip title="製品を追加">
                <IconButton
                  color="inherit"
                  onClick={onAddProduct}
                  sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                  <AddRounded />
                </IconButton>
              </Tooltip>
            )}

            {/* 通知ボタン */}
            <Tooltip title="通知">
              <IconButton color="inherit">
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsRounded />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* ユーザーメニュー */}
            <Tooltip title="アカウントメニュー">
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                  {getUserInitial(user.name)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <SettingsRounded sx={{ mr: 1 }} />
                設定
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutRounded sx={{ mr: 1 }} />
                ログアウト
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          /* 未ログイン時のボタン */
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit">
              ログイン
            </Button>
            <Button color="inherit" variant="outlined">
              登録
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}