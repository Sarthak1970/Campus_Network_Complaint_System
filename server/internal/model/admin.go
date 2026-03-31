package model

import "time"

type Admin struct {
	UserID    string    `gorm:"primaryKey;column:user_id" json:"user_id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	Password  string    `gorm:"not null" json:"-"` // Never return password
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

type AdminRegisterRequest struct {
	Username string `json:"username" binding:"required"`
	UserID   string `json:"user_id" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

type AdminLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AdminLoginResponse struct {
	Token  string `json:"token"`
	Admin  Admin  `json:"admin"`
}