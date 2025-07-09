/**
 * ユーザー登録フォーム
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
  Typography,
} from '@mui/material';
import { VisibilityRounded, VisibilityOffRounded } from '@mui/icons-material';
import type { SignupFormData } from '@/types/forms';
import { signupFormSchema } from '@/types/forms';

interface SignupFormProps {
  /** フォーム送信時の処理 */
  onSubmit: (data: SignupFormData) => Promise<void>;
  /** 送信中かどうか */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
}

export default function SignupForm({ onSubmit, loading = false, error }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onChange',
  });

  // パスワード強度の簡易チェック
  const password = watch('password');
  const getPasswordStrength = (pwd: string): string => {
    if (!pwd) return '';
    if (pwd.length < 8) return '短すぎます';
    
    let score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    
    if (score < 2) return '弱い';
    if (score < 3) return '普通';
    return '強い';
  };

  const handleFormSubmit = async (data: SignupFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error('Signup form submission error:', err);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <CardHeader 
        title="アカウント登録" 
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

          {/* 名前入力 */}
          <TextField
            label="お名前"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={loading}
            autoComplete="name"
          />

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
            helperText={errors.password?.message || (password && `強度: ${getPasswordStrength(password)}`)}
            disabled={loading}
            autoComplete="new-password"
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

          {/* パスワード確認入力 */}
          <TextField
            label="パスワード確認"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={loading}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="パスワード確認を表示"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* パスワード要件の説明 */}
          <Typography variant="caption" color="text.secondary">
            パスワードは8文字以上で、大文字・小文字・数字を含む必要があります
          </Typography>

          {/* 登録ボタン */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !isValid || !isDirty}
            sx={{ mt: 2 }}
          >
            {loading ? 'アカウント作成中...' : 'アカウントを作成'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}