package validator

import (
	"expiry_tracker/model"
	"testing"
	"time"
)

func TestProductValidator_ProductValidate(t *testing.T) {
	validator := NewProductValidator()

	tests := []struct {
		name    string
		product model.Product
		wantErr bool
		errMsg  string
	}{
		{
			name: "正常なプロダクト",
			product: model.Product{
				Name:       "テスト商品",
				Quantity:   1,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       model.ExpiryTypeBestBefore,
			},
			wantErr: false,
		},
		{
			name: "名前が空文字",
			product: model.Product{
				Name:       "",
				Quantity:   1,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       model.ExpiryTypeBestBefore,
			},
			wantErr: true,
			errMsg:  "name: name is required.",
		},
		{
			name: "名前が長すぎる",
			product: model.Product{
				Name:       "1234567890123456789012345678901", // 31文字
				Quantity:   1,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       model.ExpiryTypeBestBefore,
			},
			wantErr: true,
			errMsg:  "name: limited max 30 char.",
		},
		{
			name: "数量が0",
			product: model.Product{
				Name:       "テスト商品",
				Quantity:   0,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       model.ExpiryTypeBestBefore,
			},
			wantErr: true,
			errMsg:  "quantity: quantity is required.",
		},
		{
			name: "数量が負の値",
			product: model.Product{
				Name:       "テスト商品",
				Quantity:   -1,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       model.ExpiryTypeBestBefore,
			},
			wantErr: true,
			errMsg:  "quantity: quantity must be greater than 0.",
		},
		{
			name: "日付が空",
			product: model.Product{
				Name:       "テスト商品",
				Quantity:   1,
				ExpiryDate: time.Time{},
				Type:       model.ExpiryTypeBestBefore,
			},
			wantErr: true,
			errMsg:  "expiry_date: expiry date is required.",
		},
		{
			name: "タイプが空",
			product: model.Product{
				Name:       "テスト商品",
				Quantity:   1,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       "",
			},
			wantErr: true,
			errMsg:  "type: type is required.",
		},
		{
			name: "無効なタイプ",
			product: model.Product{
				Name:       "テスト商品",
				Quantity:   1,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       "invalid_type",
			},
			wantErr: true,
			errMsg:  "type: invalid type.",
		},
		{
			name: "有効なタイプ",
			product: model.Product{
				Name:       "テスト商品",
				Quantity:   1,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       model.ExpiryTypeUseBy,
			},
			wantErr: false,
		},
		{
			name: "最大文字数ちょうど（30文字）",
			product: model.Product{
				Name:       "123456789012345678901234567890", // 30文字
				Quantity:   1,
				ExpiryDate: time.Now().AddDate(0, 0, 7),
				Type:       model.ExpiryTypeBestBefore,
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.ProductValidate(tt.product)

			if tt.wantErr {
				if err == nil {
					t.Errorf("ProductValidate() error = nil, wantErr %v", tt.wantErr)
					return
				}
				if tt.errMsg != "" && err.Error() != tt.errMsg {
					t.Errorf("ProductValidate() error = %v, wantErrMsg %v", err.Error(), tt.errMsg)
				}
			} else {
				if err != nil {
					t.Errorf("ProductValidate() error = %v, wantErr %v", err, tt.wantErr)
				}
			}
		})
	}
}

func TestProductValidator_EdgeCases(t *testing.T) {
	validator := NewProductValidator()

	// 空のProductでテスト
	t.Run("すべてのフィールドが初期値", func(t *testing.T) {
		var product model.Product
		err := validator.ProductValidate(product)
		if err == nil {
			t.Error("空のProductでバリデーションエラーが発生しませんでした")
		}
	})

	// 過去の日付でテスト
	t.Run("過去の有効期限", func(t *testing.T) {
		product := model.Product{
			Name:       "期限切れ商品",
			Quantity:   1,
			ExpiryDate: time.Now().AddDate(0, 0, -1), // 昨日
			Type:       model.ExpiryTypeBestBefore,
		}
		// バリデーターは日付の妥当性をチェックしないので、エラーなし
		err := validator.ProductValidate(product)
		if err != nil {
			t.Errorf("過去の日付でエラーが発生しました: %v", err)
		}
	})
}
