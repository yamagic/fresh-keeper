/**
 * アプリケーション全体の状態管理
 */

import { create } from 'zustand';

interface AppState {
  // UI状態
  sidebarOpen: boolean;
  currentPage: string;
  
  // 通知状態
  notifications: Notification[];
  
  // アプリ設定
  theme: 'light' | 'dark';
  language: 'ja' | 'en';
  
  // アクション
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ja' | 'en') => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // 自動消去時間（ミリ秒）
  timestamp: Date;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初期状態
  sidebarOpen: false,
  currentPage: 'dashboard',
  notifications: [],
  theme: 'light',
  language: 'ja',

  // サイドバー管理
  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  // ページ管理
  setCurrentPage: (page: string) => {
    set({ currentPage: page });
  },

  // 通知管理
  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // 自動削除の設定
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // テーマ管理
  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
  },

  // 言語管理
  setLanguage: (language: 'ja' | 'en') => {
    set({ language });
  },
}));

// 通知用のカスタムフック
export const useNotifications = () => {
  const { notifications, addNotification, removeNotification, clearNotifications } = useAppStore();

  const showSuccess = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message: string, duration = 0) => {
    addNotification({ type: 'error', title, message, duration });
  };

  const showWarning = (title: string, message: string, duration = 8000) => {
    addNotification({ type: 'warning', title, message, duration });
  };

  const showInfo = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'info', title, message, duration });
  };

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearNotifications,
  };
};

// UI状態用のカスタムフック
export const useUIState = () => {
  const { 
    sidebarOpen, 
    currentPage, 
    theme, 
    language,
    setSidebarOpen,
    toggleSidebar,
    setCurrentPage,
    setTheme,
    setLanguage,
  } = useAppStore();

  return {
    sidebarOpen,
    currentPage,
    theme,
    language,
    setSidebarOpen,
    toggleSidebar,
    setCurrentPage,
    setTheme,
    setLanguage,
  };
};