package validator

import (
	"expiry_tracker/model"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

type IProductValidator interface {
	ProductValidate(product model.Product) error
}

type productValidator struct{}

func NewProductValidator() IProductValidator {
	return &productValidator{}
}

func (pv *productValidator) ProductValidate(product model.Product) error {
	return validation.ValidateStruct(&product,
		validation.Field(
			&product.Name,
			validation.Required.Error("name is required"),
			validation.RuneLength(1, 30).Error("limited max 30 char"),
		),
		validation.Field(
			&product.Quantity,
			validation.Required.Error("quantity is required"),
			validation.Min(1).Error("quantity must be greater than 0"),
		),
		validation.Field(
			&product.ExpiryDate,
			validation.Required.Error("expiry date is required"),
		),
		validation.Field(
			&product.Type,
			validation.Required.Error("type is required"),
			validation.In(model.ExpiryTypeBestBefore, model.ExpiryTypeUseBy).Error("invalid type"),
		),
		validation.Field(
			&product.IsNotified,
			validation.Required.Error("is notified is required"),
		),
	)
}
