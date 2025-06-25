package main

import (
	"expiry_tracker/controller"
	"expiry_tracker/db"
	"expiry_tracker/repository"
	"expiry_tracker/router"
	"expiry_tracker/usecase"
)

func main() {
	db := db.NewDB()
	userRepository := repository.NewUserRepository(db)
	productRepository := repository.NewProductRepository(db)
	userUsecase := usecase.NewUserUsecase(userRepository)
	productUsecase := usecase.NewProductUsecase(productRepository)
	userController := controller.NewUserController(userUsecase)
	productController := controller.NewProductController(productUsecase)
	e := router.NewRouter(userController, productController)
	e.Logger.Fatal(e.Start(":8080"))
}
