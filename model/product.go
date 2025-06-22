package model

import (
	"time"
	"gorm.io/gorm"
)

type Product struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"user_id" gorm:"not null"`
	User        User           `json:"user" gorm:"foreignKey:UserID"`
	Name        string         `json:"name" gorm:"not null"`
	Description string         `json:"description"`
	Quantity    int            `json:"quantity" gorm:"default:1"`
	ExpiryDate  time.Time      `json:"expiry_date" gorm:"not null"`
	Type        ExpiryType     `json:"type" gorm:"not null"`
	IsNotified  bool           `json:"is_notified" gorm:"default:false"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type ExpiryType string

type ProductResponse struct {
	ID          uint       `json:"id"`
	UserID      uint       `json:"user_id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Quantity    int        `json:"quantity"`
	ExpiryDate  time.Time  `json:"expiry_date"`
	Type        ExpiryType `json:"type"`
	IsNotified  bool       `json:"is_notified"`
	DaysLeft    int        `json:"days_left"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}