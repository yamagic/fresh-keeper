package main

import (
	"fresh-keeper/controller"
	"fresh-keeper/db"
	"fresh-keeper/repository"
	"fresh-keeper/router"
	"fresh-keeper/usecase"
)

func main() {
	db := db.NewDB()
	userRepository := repository.NewUserRepository(db)

	userUsecase := usecase.NewUserUsecase(userRepository, userValidator)

	userController := controller.NewUserController(userUsecase)

	e := router.NewRouter(userController)

	e.Logger.Fatal(e.Start(":8080"))
}