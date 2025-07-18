package validator

import (
	"expiry_tracker/model"
	"testing"
)

func TestUserValidator_SignUpUserValidate(t *testing.T) {
	validator := NewUserValidator()

	tests := []struct {
		name    string
		user    model.User
		wantErr bool
		errMsg  string
	}{
		{
			name: "正常なユーザー登録",
			user: model.User{
				Email:    "test@example.com",
				Password: "password123",
				Name:     "テストユーザー",
			},
			wantErr: false,
		},
		{
			name: "メールアドレスが空",
			user: model.User{
				Email:    "",
				Password: "password123",
				Name:     "テストユーザー",
			},
			wantErr: true,
			errMsg:  "email: email is required.",
		},
		{
			name: "無効なメールアドレス形式",
			user: model.User{
				Email:    "invalid-email",
				Password: "password123",
				Name:     "テストユーザー",
			},
			wantErr: true,
			errMsg:  "email: is not valid email format.",
		},
		{
			name: "メールアドレスが長すぎる",
			user: model.User{
				Email:    "very.long.email.address.test@example.com", // 30文字以上
				Password: "password123",
				Name:     "テストユーザー",
			},
			wantErr: true,
			errMsg:  "email: limited max 30 char.",
		},
		{
			name: "パスワードが空",
			user: model.User{
				Email:    "test@example.com",
				Password: "",
				Name:     "テストユーザー",
			},
			wantErr: true,
			errMsg:  "password: password is required.",
		},
		{
			name: "パスワードが短すぎる",
			user: model.User{
				Email:    "test@example.com",
				Password: "123", // 6文字未満
				Name:     "テストユーザー",
			},
			wantErr: true,
			errMsg:  "password: limited min 6 max 30 char.",
		},
		{
			name: "パスワードが長すぎる",
			user: model.User{
				Email:    "test@example.com",
				Password: "1234567890123456789012345678901", // 31文字
				Name:     "テストユーザー",
			},
			wantErr: true,
			errMsg:  "password: limited min 6 max 30 char.",
		},
		{
			name: "最小有効パスワード（6文字）",
			user: model.User{
				Email:    "test@example.com",
				Password: "123456",
				Name:     "テストユーザー",
			},
			wantErr: false,
		},
		{
			name: "名前が空",
			user: model.User{
				Email:    "test@example.com",
				Password: "password123",
				Name:     "",
			},
			wantErr: true,
			errMsg:  "name: name is required.",
		},
		{
			name: "名前が長すぎる",
			user: model.User{
				Email:    "test@example.com",
				Password: "password123",
				Name:     "1234567890123456789012345678901", // 31文字
			},
			wantErr: true,
			errMsg:  "name: limited max 30 char.",
		},
		{
			name: "最大有効名前（30文字）",
			user: model.User{
				Email:    "test@example.com",
				Password: "password123",
				Name:     "123456789012345678901234567890", // 30文字
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.SignUpUserValidate(tt.user)

			if tt.wantErr {
				if err == nil {
					t.Errorf("SignUpUserValidate() error = nil, wantErr %v", tt.wantErr)
					return
				}
				if tt.errMsg != "" && err.Error() != tt.errMsg {
					t.Errorf("SignUpUserValidate() error = %v, wantErrMsg %v", err.Error(), tt.errMsg)
				}
			} else {
				if err != nil {
					t.Errorf("SignUpUserValidate() error = %v, wantErr %v", err, tt.wantErr)
				}
			}
		})
	}
}

func TestUserValidator_LoginUserValidate(t *testing.T) {
	validator := NewUserValidator()

	tests := []struct {
		name    string
		user    model.User
		wantErr bool
		errMsg  string
	}{
		{
			name: "正常なログイン",
			user: model.User{
				Email:    "test@example.com",
				Password: "password123",
			},
			wantErr: false,
		},
		{
			name: "メールアドレスが空",
			user: model.User{
				Email:    "",
				Password: "password123",
			},
			wantErr: true,
			errMsg:  "email: email is required.",
		},
		{
			name: "メールアドレスが長すぎる",
			user: model.User{
				Email:    "very.long.email.address.test@example.com", // 30文字以上
				Password: "password123",
			},
			wantErr: true,
			errMsg:  "email: limited max 30 char.",
		},
		{
			name: "無効なメールアドレス",
			user: model.User{
				Email:    "invalid-email",
				Password: "password123",
			},
			wantErr: true,
			errMsg:  "email: is not valid email format.",
		},
		{
			name: "パスワードが空",
			user: model.User{
				Email:    "test@example.com",
				Password: "",
			},
			wantErr: true,
			errMsg:  "password: password is required.",
		},
		{
			name: "パスワードが短すぎる",
			user: model.User{
				Email:    "test@example.com",
				Password: "123",
			},
			wantErr: true,
			errMsg:  "password: limited min 6 max 30 char.",
		},
		{
			name: "Nameフィールドは無視される",
			user: model.User{
				Email:    "test@example.com",
				Password: "password123",
				Name:     "", // ログインではNameは検証されない
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.LoginUserValidate(tt.user)

			if tt.wantErr {
				if err == nil {
					t.Errorf("LoginUserValidate() error = nil, wantErr %v", tt.wantErr)
					return
				}
				if tt.errMsg != "" && err.Error() != tt.errMsg {
					t.Errorf("LoginUserValidate() error = %v, wantErrMsg %v", err.Error(), tt.errMsg)
				}
			} else {
				if err != nil {
					t.Errorf("LoginUserValidate() error = %v, wantErr %v", err, tt.wantErr)
				}
			}
		})
	}
}

func TestUserValidator_EdgeCases(t *testing.T) {
	validator := NewUserValidator()

	t.Run("空のUserでサインアップ", func(t *testing.T) {
		var user model.User
		err := validator.SignUpUserValidate(user)
		if err == nil {
			t.Error("空のUserでバリデーションエラーが発生しませんでした")
		}
	})

	t.Run("空のUserでログイン", func(t *testing.T) {
		var user model.User
		err := validator.LoginUserValidate(user)
		if err == nil {
			t.Error("空のUserでバリデーションエラーが発生しませんでした")
		}
	})

	t.Run("有効なメールアドレス形式のテスト", func(t *testing.T) {
		validEmails := []string{
			"test@example.com",
			"user.name@domain.co.jp",
			"test+tag@gmail.com",
			"123@domain.org",
		}

		for _, email := range validEmails {
			user := model.User{
				Email:    email,
				Password: "password123",
				Name:     "テストユーザー",
			}
			err := validator.SignUpUserValidate(user)
			if err != nil {
				t.Errorf("有効なメールアドレス %s でエラーが発生しました: %v", email, err)
			}
		}
	})

	t.Run("無効なメールアドレス形式のテスト", func(t *testing.T) {
		invalidEmails := []string{
			"plainaddress",
			"@missingusername.com",
			"username@.com",
			"username..double.dot@example.com",
		}

		for _, email := range invalidEmails {
			user := model.User{
				Email:    email,
				Password: "password123",
				Name:     "テストユーザー",
			}
			err := validator.SignUpUserValidate(user)
			if err == nil {
				t.Errorf("無効なメールアドレス %s でエラーが発生しませんでした", email)
			}
		}
	})
}
