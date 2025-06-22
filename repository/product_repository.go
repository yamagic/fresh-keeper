package repository

import (
	"fmt"
	"expiry_tracker/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IProductRepository interface {
	GetAllProducts(products *[]model.Product, userId uint) error
	GetProductById(product *model.Product, userId uint, productId uint) error
	CreateProduct(product *model.Product) error
	UpdateProduct(product *model.Product, userId uint, productId uint) error
	DeleteProduct(userId uint, productId uint) error
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) IProductRepository {
	return &productRepository{db: db}
}

func (pr *productRepository) GetAllProducts(products *[]model.Product, userId uint) error {
	if err := pr.Joins(User).Where("user_id = ?", userId).Order("created_at").Find(products).Error; err != nil {
		return err
	}
	return nil
}

func (pr *productRepository) GetProductById(product *model.Product, userId uint, productId uint) error {
	if err := pr.db.Joins(User).Where("user_id = ?").First(product, productID).Error; err != nil {
		return err
	}
	return nil
}

func (pr *productRepository) CreateProduct(product *model.Product) error {
	if err := pr.db.Create(product).Error; err != nil {
		return err
	}
	return nil
}

func (pr *productRepository) UpdateProduct(product *model.Product, userId uint, productId uint) error {
	result := pr.db.Model(User).Clauses(clause.Returning{}).Where("user_id = ? AND id = ?", userId, productId).Updates(product)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("product not found")
	}
	return nil
}

func (pr *productRepository) DeleteProduct(userId uint, productId uint) error {
	result := pr.db.Where("user_id = ? AND id = ?", userId, productId).Delete(&model.Product{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("product not found")
	}
	return nil
}