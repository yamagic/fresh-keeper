package controller

import (
	"expiry_tracker/model"
	"expiry_tracker/usecase"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type IProductController interface {
	GetAllProducts(c echo.Context) error
	GetProductById(c echo.Context) error
	CreateProduct(c echo.Context) error
	UpdateProduct(c echo.Context) error
	DeleteProduct(c echo.Context) error
}

type productController struct {
	pu usecase.IProductUsecase
}

func NewProductController(pu usecase.IProductUsecase) IProductController {
	return &productController{pu: pu}
}

func (pc *productController) GetAllProducts(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]

	productRes, err := pc.pu.GetAllProducts(uint(userId.(float64)))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, productRes)
}

func (pc *productController) GetProductById(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]
	id := c.Param("productId")
	productId, _ := strconv.Atoi(id)
	productRes, err := pc.pu.GetProductByID(uint(userId.(float64)), uint(productId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, productRes)
}

func (pc *productController) CreateProduct(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]

	product := model.Product{}
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	product.UserId = uint(userId.(float64))
	productRes, err := pc.pu.CreateProduct(product)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, productRes)
}

func (pc *productController) UpdateProduct(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]
	id := c.Param("productId")
	productId, _ := strconv.Atoi(id)

	product := model.Product{}
	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	taskRes, err := pc.pu.UpdateProduct(product, uint(userId.(float64)), uint(productId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, taskRes)
}

func (pc *productController) DeleteProduct(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]
	id := c.Param("productId")
	productId, _ := strconv.Atoi(id)

	err := pc.pu.DeleteProduct(uint(userId.(float64)), uint(productId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}
