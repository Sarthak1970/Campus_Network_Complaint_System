package model

import "time"

type Complaint struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Email       string    `json:"email"`
	RollNo      string    `json:"roll_no"`
	Type        string    `json:"type_of_complaint"`
	Description string    `json:"description"`
	Location    string    `json:"location"`
	Date        string    `json:"date"`
	Time        string    `json:"time"`
	Image       string    `json:"image,omitempty"`
	Status      string    `json:"status"`      
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateComplaintRequest struct {
	FirstName   string `json:"first_name" binding:"required"`
	LastName    string `json:"last_name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	RollNo      string `json:"roll_no"`
	Type        string `json:"type_of_complaint" binding:"required"`
	Description string `json:"description" binding:"required"`
	Location    string `json:"location"`
	Date        string `json:"date"`
	Time        string `json:"time"`
	Image       string `json:"image"`
}