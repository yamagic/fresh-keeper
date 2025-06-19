package main

import (
	"fmt"
	"expiry_tracker/db"
	"expiry_tracker/model"
)

func main() {
	dbConn := db.NewDB()
	defer fmt.Println("Successfully Migarated")
	defer db.CloseDB(dbConn)
	dbConn.AutoMigrate(&model.User{})
}