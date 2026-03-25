
package model

import "time"

type Complaint struct {
	ID          int64     `json:"id"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Email       string    `json:"email"`
	RollNo      string    `json:"roll_no"`
	Type        string    `json:"type_of_complaint"`
	Status      string    `json:"status"`
	Description string    `json:"description"`
	Location    string    `json:"location"`
	Date        time.Time `json:"date"`
	Time        time.Time `json:"time"`
	Image       string    `json:"image"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateComplaintRequest struct {
	FirstName   string `json:"first_name" binding:"required,min=2,max=50"`
	LastName    string `json:"last_name" binding:"required,min=2,max=50"`
	Email       string `json:"email" binding:"required,email"`
	RollNo      string `json:"roll_no" binding:"required"`
	Type        string `json:"type_of_complaint" binding:"required"`
	Description string `json:"description" binding:"required,max=1000"`
	Location    string `json:"location" binding:"required"`
	Date        string `json:"date" binding:"required"`   
	Time        string `json:"time" binding:"required"`
	Image       string `json:"image"`
}