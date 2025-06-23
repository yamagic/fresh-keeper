package usecase

import (
	"expiry_tracker/model"
	"expiry_tracker/repository"
)

type IProductUsecase interface {
	GetAllProducts(userId uint) ([]model.ProductResponse, error)
	GetProductByID(userId uint, productId uint) (model.ProductResponse, error)
	CreateProduct(product model.Product) (model.ProductResponse, error)
	UpdateProduct(product model.Product, userId uint, productId uint) (model.ProductResponse, error)
	DeleteProduct(userId uint, productId uint) error
}

type productUsecase struct {
	pr repository.IProductRepository
}

func NewProductUsecase(pr repository.IProductRepository) IProductUsecase {
	return &productUsecase{pr: pr}
}

func (pu *productUsecase) GetAllProducts(userId uint) ([]model.ProductResponse, error) {
	products := []model.Product{}
	if err := pu.pr.GetAllProducts(&products, userId); err != nil {
		return nil, err
	}

	resProducts := []model.ProductResponse{}

	for _, v := range products {
		p := model.ProductResponse{
			ID:          v.ID,
			Name:        v.Name,
			Description: v.Description,
			Quantity:    v.Quantity,
			ExpiryDate:  v.ExpiryDate,
			Type:        v.Type,
			IsNotified:  v.IsNotified,
			CreatedAt:   v.CreatedAt,
			UpdatedAt:   v.UpdatedAt,
		}
		resProducts = append(resProducts, p)
	}

	return resProducts, nil
}

func (pu *productUsecase) GetProductByID(userId uint, productId uint) (model.ProductResponse, error) {
	product := model.Product{}

	if err := pu.pr.GetProductById(&product, userId, productId); err != nil {
		return model.ProductResponse{}, err
	}

	resProduct := model.ProductResponse{
		ID:          product.ID,
		Name:        product.Name,
		Description: product.Description,
		Quantity:    product.Quantity,
		ExpiryDate:  product.ExpiryDate,
		Type:        product.Type,
		IsNotified:  product.IsNotified,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
	}

	return resProduct, nil
}

func (pu *productUsecase) CreateProduct(product model.Product) (model.ProductResponse, error) {
	if err := pu.pr.CreateProduct(&product); err != nil {
		return model.ProductResponse{}, err
	}

	resProduct := model.ProductResponse{
		ID:          product.ID,
		Name:        product.Name,
		Description: product.Description,
		Quantity:    product.Quantity,
		ExpiryDate:  product.ExpiryDate,
		Type:        product.Type,
		IsNotified:  product.IsNotified,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
	}

	return resProduct, nil
}

func (pu *productUsecase) UpdateProduct(product model.Product, userId uint, productId uint) (model.ProductResponse, error) {
	if err := pu.pr.UpdateProduct(&product, userId, productId); err != nil {
		return model.ProductResponse{}, err
	}

	resProduct := model.ProductResponse{
		ID:          product.ID,
		Name:        product.Name,
		Description: product.Description,
		Quantity:    product.Quantity,
		ExpiryDate:  product.ExpiryDate,
		Type:        product.Type,
		IsNotified:  product.IsNotified,
		UpdatedAt:   product.UpdatedAt,
	}

	return resProduct, nil
}

func (pu *productUsecase) DeleteProduct(userId uint, productId uint) error {
	if err := pu.pr.DeleteProduct(userId, productId); err != nil {
		return err
	}

	return nil
}
