package router

import (
	"expiry_tracker/controller"
	"os"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

func NewRouter(uc controller.IUserController, pc controller.IProductController) *echo.Echo {
	e := echo.New()
	e.POST("/signup", uc.SignUp)
	e.POST("/login", uc.Login)
	e.POST("/logout", uc.LogOut)
	p := e.Group("/products")
	p.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey:  []byte(os.Getenv("SECRET")),
		TokenLookup: "cookie:token",
	}))
	p.GET("", pc.GetAllProducts)
	p.GET("/:productId", pc.GetProductById)
	p.POST("", pc.CreateProduct)
	p.PUT("/:productId", pc.UpdateProduct)
	p.DELETE("/:productId", pc.DeleteProduct)
	return e
}
