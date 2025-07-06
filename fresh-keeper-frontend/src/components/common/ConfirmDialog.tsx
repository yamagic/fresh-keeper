/**
 * 確認ダイアログ - 削除や重要な操作の確認に使用
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  /** ダイアログの表示状態 */
  open: boolean;
  /** ダイアログのタイトル */
  title: string;
  /** 確認メッセージ */
  message: string;
  /** 確認ボタンのテキスト */
  confirmText?: string;
  /** キャンセルボタンのテキスト */
  cancelText?: string;
  /** 確認ボタンの色（危険な操作は'error'） */
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning';
  /** 確認ボタンクリック時の処理 */
  onConfirm: () => void;
  /** キャンセル・閉じるボタンクリック時の処理 */
  onCancel: () => void;
  /** 処理中かどうか */
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'はい',
  cancelText = 'キャンセル',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  loading = false
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        {title}
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}