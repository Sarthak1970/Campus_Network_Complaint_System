package service

import (
	"context"
	"errors"
	"time"

	"Complaint-System/internal/model"
	"Complaint-System/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AdminService struct {
	repo *repository.ComplaintRepository
}

var jwtSecret = []byte("your-super-secret-jwt-key-change-in-production") // Change this!

func NewAdminService(repo *repository.ComplaintRepository) *AdminService {
	return &AdminService{repo: repo}
}

func (s *AdminService) RegisterAdmin(ctx context.Context, req model.AdminRegisterRequest) error {
	existing, _ := s.repo.GetAdminByUsername(ctx, req.Username)
	if existing != nil {
		return errors.New("username already taken")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.repo.CreateAdmin(ctx, req, string(hashedPassword))
}

func (s *AdminService) LoginAdmin(ctx context.Context, req model.AdminLoginRequest) (string, error) {
	admin, err := s.repo.GetAdminByUsername(ctx, req.Username)
	if err != nil {
		return "", errors.New("invalid username or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(req.Password))
	if err != nil {
		return "", errors.New("invalid username or password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  admin.UserID,
		"username": admin.Username,
		"role":     "admin",
		"exp":      time.Now().Add(24 * time.Hour).Unix(), // 24 hours expiry
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return tokenString, nil
}

func (s *AdminService) GetAllComplaintsAdmin(ctx context.Context) ([]model.Complaint, error) {
	return s.repo.GetAllComplaints(ctx)
}

func (s *AdminService) ResolveComplaintAdmin(ctx context.Context, id uint) error {
	return s.repo.UpdateStatus(ctx, id, "Resolved")
}