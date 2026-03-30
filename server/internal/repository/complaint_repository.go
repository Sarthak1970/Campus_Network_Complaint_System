package repository

import (
	"context"
	"time"

	"Complaint-System/internal/model"
	"gorm.io/gorm"
)

type ComplaintRepository struct {
	db *gorm.DB
}

func NewComplaintRepository(db *gorm.DB) *ComplaintRepository {
	return &ComplaintRepository{db: db}
}


func (r *ComplaintRepository) Create(ctx context.Context, req model.CreateComplaintRequest) (model.Complaint, error) {
	complaint := model.Complaint{
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		Email:       req.Email,
		RollNo:      req.RollNo,
		Type:        req.Type,
		Description: req.Description,
		Location:    req.Location,
		Date:        req.Date,
		Time:        req.Time,
		Image:       req.Image,
		Status:      "Pending", 
	}

	err := r.db.WithContext(ctx).Create(&complaint).Error
	if err != nil {
		return model.Complaint{}, err
	}

	return complaint, nil
}
func (r *ComplaintRepository) GetAllComplaints(ctx context.Context) ([]model.Complaint, error) {
	var complaints []model.Complaint

	err := r.db.WithContext(ctx).
		Order("created_at DESC").
		Find(&complaints).Error

	if err != nil {
		return nil, err
	}

	return complaints, nil
}

func (r *ComplaintRepository) GetComplaintsByDateRange(ctx context.Context, startTime, endTime time.Time) ([]model.Complaint, error) {
	var complaints []model.Complaint

	query := r.db.WithContext(ctx)

	if !startTime.IsZero() {
		query = query.Where("created_at >= ?", startTime)
	}

	err := query.Where("created_at <= ?", endTime).
		Order("created_at DESC").
		Find(&complaints).Error

	if err != nil {
		return nil, err
	}

	return complaints, nil
}

func (r *ComplaintRepository) GetRecentComplaints(ctx context.Context, limit int) ([]model.Complaint, error) {
	if limit <= 0 {
		limit = 10
	}

	var complaints []model.Complaint

	err := r.db.WithContext(ctx).
		Order("created_at DESC").
		Limit(limit).
		Find(&complaints).Error

	if err != nil {
		return nil, err
	}

	return complaints, nil
}