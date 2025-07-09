/**
 * アプリケーションのルーティング設定
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components';
import { ComponentDemo } from '@/components/examples';
import { useAuthStore } from '@/stores/authStore';

// ページコンポーネント（後で実装）
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AddProductPage from '@/pages/AddProductPage';
import EditProductPage from '@/pages/EditProductPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * 認証が必要なルートを保護するコンポーネント
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

/**
 * 認証済みユーザーのアクセスを制限するルート（ログイン・登録ページなど）
 */
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

/**
 * レイアウト付きルート
 */
function LayoutRoute({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  
  return (
    <Layout
      user={user}
      onLogout={logout}
      notificationCount={0} // TODO: 実際の通知数を実装
      urgentProductCount={0} // TODO: 実際の緊急製品数を実装
    >
      {children}
    </Layout>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* パブリックルート（認証不要） */}
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicOnlyRoute>
              <SignupPage />
            </PublicOnlyRoute>
          } 
        />

        {/* プライベートルート（認証必要） */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <LayoutRoute>
                <DashboardPage />
              </LayoutRoute>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <LayoutRoute>
                <ProductsPage />
              </LayoutRoute>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products/:id" 
          element={
            <ProtectedRoute>
              <LayoutRoute>
                <ProductDetailPage />
              </LayoutRoute>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products/new" 
          element={
            <ProtectedRoute>
              <LayoutRoute>
                <AddProductPage />
              </LayoutRoute>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products/:id/edit" 
          element={
            <ProtectedRoute>
              <LayoutRoute>
                <EditProductPage />
              </LayoutRoute>
            </ProtectedRoute>
          } 
        />

        {/* 開発・デモ用ルート */}
        <Route 
          path="/demo" 
          element={<ComponentDemo />} 
        />

        {/* デフォルトルート */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } 
        />

        {/* 404 ページ */}
        <Route 
          path="*" 
          element={<NotFoundPage />} 
        />
      </Routes>
    </BrowserRouter>
  );
}