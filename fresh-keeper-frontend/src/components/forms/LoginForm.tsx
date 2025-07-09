/**
 * ログインフォーム - React Hook Form + Zod バリデーション
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { VisibilityRounded, VisibilityOffRounded } from '@mui/icons-material';
import type { LoginFormData } from '@/types/forms';
import { loginFormSchema } from '@/types/forms';

interface LoginFormProps {
  /** フォーム送信時の処理 */
  onSubmit: (data: LoginFormData) => Promise<void>;
  /** 送信中かどうか */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
}

export default function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form の設定
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema), // Zod バリデーション
    mode: 'onChange', // 入力中にリアルタイムバリデーション
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // エラーは親コンポーネントで処理
      console.error('Login form submission error:', err);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardHeader 
        title="ログイン" 
        titleTypographyProps={{ align: 'center', variant: 'h5' }}
      />
      
      <CardContent>
        <Box 
          component="form" 
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* エラーメッセージ表示 */}
          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          {/* メールアドレス入力 */}
          <TextField
            label="メールアドレス"
            type="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading}
            autoComplete="email"
          />

          {/* パスワード入力 */}
          <TextField
            label="パスワード"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="パスワードを表示"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* ログインボタン */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !isValid || !isDirty}
            sx={{ mt: 2 }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}