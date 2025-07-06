/**
 * 製品（食材）登録・編集フォーム
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Grid,
  Chip,
} from '@mui/material';
import { SaveRounded } from '@mui/icons-material';
import { 
  ProductFormData, 
  productFormSchema, 
  EXPIRY_TYPE_OPTIONS,
  QUANTITY_OPTIONS,
  EXPIRY_TYPE_LABELS,
} from '@/types';

interface ProductFormProps {
  /** フォーム送信時の処理 */
  onSubmit: (data: ProductFormData) => Promise<void>;
  /** 送信中かどうか */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** 初期値（編集時） */
  defaultValues?: Partial<ProductFormData>;
  /** フォームタイトル */
  title?: string;
  /** 送信ボタンのテキスト */
  submitText?: string;
}

export default function ProductForm({ 
  onSubmit, 
  loading = false, 
  error,
  defaultValues,
  title = '製品を登録',
  submitText = '保存'
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      quantity: 1,
      expiry_date: '',
      type: 'best_before',
      ...defaultValues,
    },
  });

  // 選択された期限タイプを監視
  const watchedType = watch('type');

  // 今日の日付を取得（期限日の最小値に使用）
  const today = new Date().toISOString().split('T')[0];

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error('Product form submission error:', err);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardHeader 
        title={title}
        titleTypographyProps={{ align: 'center', variant: 'h5' }}
        subheader={
          <Chip 
            label={EXPIRY_TYPE_LABELS[watchedType]} 
            color="primary" 
            size="small" 
            sx={{ mt: 1 }}
          />
        }
      />
      
      <CardContent>
        <Box 
          component="form" 
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {/* エラーメッセージ表示 */}
          {error && (
            <Alert severity="error">{error}</Alert>
          )}

          {/* 製品名入力 */}
          <TextField
            label="製品名"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={loading}
            placeholder="例: 牛乳、りんご、パン など"
          />

          {/* 説明入力 */}
          <TextField
            label="説明（任意）"
            fullWidth
            multiline
            rows={2}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={loading}
            placeholder="ブランド名、購入場所、メモなど"
          />

          <Grid container spacing={2}>
            {/* 数量選択 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.quantity}>
                <InputLabel>数量</InputLabel>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="数量"
                      disabled={loading}
                    >
                      {QUANTITY_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                      <MenuItem value="custom">その他</MenuItem>
                    </Select>
                  )}
                />
                {errors.quantity && (
                  <FormHelperText>{errors.quantity.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* 期限タイプ選択 */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>期限の種類</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="期限の種類"
                      disabled={loading}
                    >
                      {EXPIRY_TYPE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {/* 期限日入力 */}
          <TextField
            label={EXPIRY_TYPE_LABELS[watchedType]}
            type="date"
            fullWidth
            {...register('expiry_date')}
            error={!!errors.expiry_date}
            helperText={errors.expiry_date?.message}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }}
          />

          {/* 保存ボタン */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !isValid || !isDirty}
            startIcon={<SaveRounded />}
            sx={{ mt: 2 }}
          >
            {loading ? '保存中...' : submitText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}