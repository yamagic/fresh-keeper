package main

import (
	"expiry_tracker/controller"
	"expiry_tracker/db"
	"expiry_tracker/repository"
	"expiry_tracker/router"
	"expiry_tracker/usecase"
	"expiry_tracker/validator"
)

func main() {
	db := db.NewDB()
	userValidator := validator.NewUserValidator()
	productValidator := validator.NewProductValidator()
	userRepository := repository.NewUserRepository(db)
	productRepository := repository.NewProductRepository(db)
	userUsecase := usecase.NewUserUsecase(userRepository, userValidator)
	productUsecase := usecase.NewProductUsecase(productRepository, productValidator)
	userController := controller.NewUserController(userUsecase)
	productController := controller.NewProductController(productUsecase)
	e := router.NewRouter(userController, productController)
	e.Logger.Fatal(e.Start(":8080"))
}
