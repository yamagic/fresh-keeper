/**
 * エラーメッセージ表示コンポーネント
 */

import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { RefreshRounded } from '@mui/icons-material';

interface ErrorMessageProps {
  /** エラーメッセージ */
  message: string;
  /** エラータイトル（オプション） */
  title?: string;
  /** 再試行ボタンの表示 */
  showRetry?: boolean;
  /** 再試行ボタンクリック時の処理 */
  onRetry?: () => void;
  /** エラーの深刻度 */
  severity?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({
  message,
  title = 'エラーが発生しました',
  showRetry = false,
  onRetry,
  severity = 'error'
}: ErrorMessageProps) {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Alert 
        severity={severity}
        action={
          showRetry && onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshRounded />}
            >
              再試行
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}