package usecase

import (
	"crypto/bcrypt"
	"errors"
	"expiry_tracker/models"
	"expiry_tracker/repository"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type IUserUsecase interface {
	SignUp(user *models.User) (models.UserResponse, error)
	Login(user *models.User) (string, error)
}

type userUsecase struct {
	ur repository.IUserRepository
}

func NewUserUsecase(ur repository.IUserRepository) IUserUsecase {
	return &userUsecase{ur: ur}
}

func (uu *userUsecase) SignUp(user *models.User) (models.UserResponse, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		return models.UserResponse{}, err
	}
	
	newUser := models.User{
		Email:    user.Email, 
		Password: string(hash), 
		Name:     user.Name,
	}
	
	if err := uu.ur.CreateUser(&newUser); err != nil {
		return models.UserResponse{}, err
	}
	
	resUser := models.UserResponse{
		ID:    newUser.ID,
		Email: newUser.Email, 
		Name:  newUser.Name,
	}
	
	return resUser, nil
}

func (uu *userUsecase) Login(user *models.User) (string, error) {
	storedUser := models.User{}
	if err := uu.ur.GetUserByEmail(&storedUser, user.Email); err != nil {
		return "", errors.New("user not found")
	}
	
	err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
	if err != nil {
		return "", errors.New("invalid password")
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": storedUser.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), 
	})
	
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		return "", err
	}
	
	return tokenString, nil
}
	