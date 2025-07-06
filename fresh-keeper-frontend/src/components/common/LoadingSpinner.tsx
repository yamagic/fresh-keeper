/**
 * ローディングスピナー - データ読み込み中に表示
 */

import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  /** ローディングメッセージ（オプション） */
  message?: string;
  /** スピナーのサイズ */
  size?: number;
  /** 全画面表示するかどうか */
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  message = '読み込み中...', 
  size = 40,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      p={2}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="rgba(255, 255, 255, 0.8)"
        zIndex={9999}
      >
        {content}
      </Box>
    );
  }

  return content;
}