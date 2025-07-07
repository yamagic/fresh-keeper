/**
 * メインレイアウトコンポーネント - アプリ全体の基本構造
 */

import { useState, ReactNode } from 'react';
import { Box, Container, Fab, Zoom } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { UserResponse } from '@/types';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  /** メインコンテンツ */
  children: ReactNode;
  /** ログイン中のユーザー情報 */
  user?: UserResponse | null;
  /** 現在のページID */
  currentPage?: string;
  /** ページ変更時の処理 */
  onPageChange?: (page: string) => void;
  /** ログアウト処理 */
  onLogout?: () => void;
  /** 新規製品追加処理 */
  onAddProduct?: () => void;
  /** 未読通知の数 */
  notificationCount?: number;
  /** 期限切れ間近の製品数 */
  urgentProductCount?: number;
  /** フローティングアクションボタンを表示するか */
  showFab?: boolean;
  /** コンテナの最大幅 */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export default function Layout({
  children,
  user,
  currentPage = 'dashboard',
  onPageChange,
  onLogout,
  onAddProduct,
  notificationCount = 0,
  urgentProductCount = 0,
  showFab = true,
  maxWidth = 'lg',
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handlePageChange = (page: string) => {
    onPageChange?.(page);
    setSidebarOpen(false); // ページ変更時にサイドバーを閉じる
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ヘッダー */}
      <Header
        user={user}
        onLogout={onLogout}
        onAddProduct={onAddProduct}
        onMenuClick={handleSidebarToggle}
        notificationCount={notificationCount}
      />

      {/* サイドバー */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        notificationCount={notificationCount}
        urgentProductCount={urgentProductCount}
      />

      {/* メインコンテンツエリア */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Container maxWidth={maxWidth} sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>

      {/* フローティングアクションボタン（モバイル用） */}
      {showFab && onAddProduct && user && (
        <Zoom in={true}>
          <Fab
            color="primary"
            aria-label="製品を追加"
            onClick={onAddProduct}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              display: { xs: 'flex', sm: 'none' }, // モバイルのみ表示
            }}
          >
            <AddRounded />
          </Fab>
        </Zoom>
      )}
    </Box>
  );
}