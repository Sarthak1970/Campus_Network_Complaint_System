package repository

import (
	"context"

	"Complaint-System/internal/model"  
	"github.com/jackc/pgx/v5/pgxpool"
)

type ComplaintRepository struct {
	db *pgxpool.Pool
}

func NewComplaintRepository(db *pgxpool.Pool) *ComplaintRepository {
	return &ComplaintRepository{db: db}
}

func (r *ComplaintRepository) Create(ctx context.Context, req model.CreateComplaintRequest) (model.Complaint, error) {
	query := `
		INSERT INTO complaints (first_name, last_name, email, roll_no, type_of_complaint, description, location, date, time, image)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, first_name, last_name, email, roll_no, type_of_complaint, status, description, location, date, time, image, created_at`

	var complaint model.Complaint

	err := r.db.QueryRow(ctx, query,
		req.FirstName,
		req.LastName,
		req.Email,
		req.RollNo,
		req.Type,
		req.Description,
		req.Location,
		req.Date,
		req.Time,
		req.Image,
	).Scan(
		&complaint.ID,
		&complaint.FirstName,
		&complaint.LastName,
		&complaint.Email,
		&complaint.RollNo,
		&complaint.Type,
		&complaint.Status,
		&complaint.Description,
		&complaint.Location,
		&complaint.Date,
		&complaint.Time,
		&complaint.Image,
		&complaint.CreatedAt,
	)

	return complaint, err
}