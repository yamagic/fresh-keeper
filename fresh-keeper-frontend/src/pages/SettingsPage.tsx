/**
 * 設定ページ - アカウント設定と環境設定
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  Button,
  Alert,
} from '@mui/material';
import {
  AccountCircleRounded,
  NotificationsRounded,
  SecurityRounded,
  InfoRounded,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        設定
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        アカウントとアプリケーションの設定を管理できます。
      </Typography>

      {/* アカウント情報 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            アカウント情報
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <AccountCircleRounded />
              </ListItemIcon>
              <ListItemText
                primary="メールアドレス"
                secondary={user?.email || '未設定'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccountCircleRounded />
              </ListItemIcon>
              <ListItemText
                primary="ユーザー名"
                secondary={user?.name || '未設定'}
              />
            </ListItem>
          </List>
          <Button variant="outlined" sx={{ mt: 2 }}>
            プロフィールを編集
          </Button>
        </CardContent>
      </Card>

      {/* 通知設定 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            通知設定
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsRounded />
              </ListItemIcon>
              <ListItemText
                primary="期限切れ通知"
                secondary="製品の期限が近づいたときに通知を受け取る"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label=""
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NotificationsRounded />
              </ListItemIcon>
              <ListItemText
                primary="メール通知"
                secondary="重要な更新をメールで受け取る"
              />
              <FormControlLabel
                control={<Switch />}
                label=""
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* セキュリティ */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            セキュリティ
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <SecurityRounded />
              </ListItemIcon>
              <ListItemText
                primary="パスワード変更"
                secondary="パスワードを変更してアカウントを保護"
              />
              <Button variant="outlined" size="small">
                変更
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* アプリ情報 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            アプリケーション情報
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoRounded />
              </ListItemIcon>
              <ListItemText
                primary="Fresh Keeper"
                secondary="バージョン 1.0.0"
              />
            </ListItem>
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            設定の一部は今後のアップデートで実装予定です。
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}