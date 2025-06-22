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

	userUsecase := usecase.NewUserUsecase(userRepository)

	userController := controller.NewUserController(userUsecase)

	e := router.NewRouter(userController)

	e.Logger.Fatal(e.Start(":8080"))
}