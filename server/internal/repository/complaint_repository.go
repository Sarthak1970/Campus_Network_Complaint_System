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

func (r *ComplaintRepository) CreateAdmin(ctx context.Context, req model.AdminRegisterRequest, hashedPassword string) error {
	admin := model.Admin{
		UserID:   req.UserID,
		Username: req.Username,
		Password: hashedPassword,
	}

	return r.db.WithContext(ctx).Create(&admin).Error
}

func (r *ComplaintRepository) GetAdminByUsername(ctx context.Context, username string) (*model.Admin, error) {
	var admin model.Admin
	err := r.db.WithContext(ctx).
		Where("username = ?", username).
		First(&admin).Error

	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *ComplaintRepository) UpdateStatus(ctx context.Context, id uint, status string) error {
	return r.db.WithContext(ctx).
		Model(&model.Complaint{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
}