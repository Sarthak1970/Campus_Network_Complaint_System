package service

import(
	"context"
	"Complaint-System/internal/model"
	"Complaint-System/internal/repository"
)

type ComplaintService struct{
	repo *repository.ComplaintRepository
}

func NewComplaintService(repo *repository.ComplaintRepository) *ComplaintService{
	return &ComplaintService{repo:repo}
}

func (s *ComplaintService) CreateComplaint(ctx context.Context, req model.CreateComplaintRequest) (model.Complaint, error) {
	return s.repo.Create(ctx, req)
}