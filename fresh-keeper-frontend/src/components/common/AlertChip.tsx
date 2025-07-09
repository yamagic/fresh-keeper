/**
 * アラートチップ - 賞味期限の警告レベルを色分けして表示
 */

import { Chip } from '@mui/material';
import { 
  CheckCircleRounded, 
  WarningRounded, 
  ErrorRounded, 
  BlockRounded 
} from '@mui/icons-material';
import type { AlertLevel } from '@/types';

interface AlertChipProps {
  /** 残り日数 */
  daysLeft: number;
  /** 表示サイズ */
  size?: 'small' | 'medium';
  /** バリアント */
  variant?: 'filled' | 'outlined';
}

/**
 * 残り日数からアラートレベルを判定
 */
function getAlertLevel(daysLeft: number): AlertLevel {
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 1) return 'danger';
  if (daysLeft <= 3) return 'warning';
  return 'safe';
}

/**
 * アラートレベルに応じた表示設定を取得
 */
function getAlertConfig(level: AlertLevel, daysLeft: number) {
  switch (level) {
    case 'expired':
      return {
        label: '期限切れ',
        color: 'error' as const,
        icon: <BlockRounded />,
      };
    case 'danger':
      return {
        label: `残り${daysLeft}日`,
        color: 'error' as const,
        icon: <ErrorRounded />,
      };
    case 'warning':
      return {
        label: `残り${daysLeft}日`,
        color: 'warning' as const,
        icon: <WarningRounded />,
      };
    case 'safe':
      return {
        label: `残り${daysLeft}日`,
        color: 'success' as const,
        icon: <CheckCircleRounded />,
      };
    default:
      return {
        label: `残り${daysLeft}日`,
        color: 'default' as const,
        icon: <CheckCircleRounded />,
      };
  }
}

export default function AlertChip({ 
  daysLeft, 
  size = 'small',
  variant = 'filled'
}: AlertChipProps) {
  const alertLevel = getAlertLevel(daysLeft);
  const config = getAlertConfig(alertLevel, daysLeft);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant={variant}
      icon={config.icon}
    />
  );
}