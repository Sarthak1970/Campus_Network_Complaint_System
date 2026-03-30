package service

import (
	"context"
	"fmt"
	"time"

	"Complaint-System/internal/model"
	"Complaint-System/internal/repository"
)

type ComplaintService struct {
	repo *repository.ComplaintRepository
}

func NewComplaintService(repo *repository.ComplaintRepository) *ComplaintService {
	return &ComplaintService{repo: repo}
}

func (s *ComplaintService) CreateComplaint(ctx context.Context, req model.CreateComplaintRequest) (model.Complaint, error) {
	return s.repo.Create(ctx, req)
}

func (s *ComplaintService) GetAllComplaints(ctx context.Context) ([]model.Complaint, error) {
	return s.repo.GetAllComplaints(ctx)
}

func (s *ComplaintService) GetComplaintStats(ctx context.Context, period string) (map[string]interface{}, error) {
	var startTime time.Time
	now := time.Now()

	switch period {
	case "7d":
		startTime = now.AddDate(0, 0, -7)
	case "30d":
		startTime = now.AddDate(0, -1, 0)
	case "90d":
		startTime = now.AddDate(0, -3, 0)
	case "all":
		startTime = time.Time{}
	default:
		return nil, fmt.Errorf("invalid period: %s", period)
	}

	complaints, err := s.repo.GetComplaintsByDateRange(ctx, startTime, now)
	if err != nil {
		return nil, err
	}

	total := len(complaints)
	active := 0
	resolved := 0

	for _, c := range complaints {
		switch c.Status {
		case "Active", "Pending", "Open":
			active++
		case "Resolved", "Closed":
			resolved++
		}
	}

	avgTime := "N/A"
	if resolved > 0 {
		avgTime = fmt.Sprintf("%.1f days", float64(total)/float64(resolved))
	} else if total > 0 {
		avgTime = "Pending"
	}

	return map[string]interface{}{
		"total":    total,
		"active":   active,
		"resolved": resolved,
		"avgTime":  avgTime,
	}, nil
}

func (s *ComplaintService) GetRecentComplaints(ctx context.Context, limit int) ([]map[string]interface{}, error) {
	if limit <= 0 {
		limit = 10
	}

	complaints, err := s.repo.GetRecentComplaints(ctx, limit)
	if err != nil {
		return nil, err
	}

	var result []map[string]interface{}
	for _, c := range complaints {
		item := map[string]interface{}{
			"id":                c.ID,
			"first_name":        c.FirstName,
			"last_name":         c.LastName,
			"description":       c.Description,
			"type_of_complaint": c.Type,
			"status":            c.Status,
			"location":          c.Location,
			"time":              formatTimeAgo(c.CreatedAt),
			"created_at":        c.CreatedAt,
		}
		result = append(result, item)
	}

	return result, nil
}

func formatTimeAgo(t time.Time) string {
	diff := time.Since(t)

	switch {
	case diff.Minutes() < 1:
		return "just now"
	case diff.Minutes() < 60:
		mins := int(diff.Minutes())
		if mins == 1 {
			return "1 minute ago"
		}
		return fmt.Sprintf("%d minutes ago", mins)
	case diff.Hours() < 24:
		hours := int(diff.Hours())
		if hours == 1 {
			return "1 hour ago"
		}
		return fmt.Sprintf("%d hours ago", hours)
	case diff.Hours() < 48:
		return "Yesterday"
	default:
		days := int(diff.Hours() / 24)
		return fmt.Sprintf("%d days ago", days)
	}
}