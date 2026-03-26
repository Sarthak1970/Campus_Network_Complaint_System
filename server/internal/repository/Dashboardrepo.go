package repository
 
import (
	"context"
	"time"
 
	"gorm.io/gorm"
	"Complaint-System/internal/model"
)
 
 
func (r *ComplaintRepository) GetComplaintsByDateRange(ctx context.Context, startTime, endTime time.Time) ([]model.Complaint, error) {
	var complaints []model.Complaint
 
	query := r.db.WithContext(ctx)
 
	if !startTime.IsZero() {
		query = query.Where("created_at >= ?", startTime)
	}
 
	query = query.Where("created_at <= ?", endTime).
		Order("created_at DESC")
 
	if err := query.Find(&complaints).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return []model.Complaint{}, nil // Return empty slice if no records found
		}
		return nil, err
	}
 
	return complaints, nil
}
 
func (r *ComplaintRepository) GetRecentComplaints(ctx context.Context, limit int) ([]model.Complaint, error) {
	var complaints []model.Complaint
 
	if limit <= 0 {
		limit = 10
	}
 
	if err := r.db.WithContext(ctx).
		Order("created_at DESC").
		Limit(limit).
		Find(&complaints).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return []model.Complaint{}, nil
		}
		return nil, err
	}
 
	return complaints, nil
}
 
func (r *ComplaintRepository) GetComplaintCountByStatus(ctx context.Context, startTime, endTime time.Time) (map[string]int, error) {
	var results []struct {
		Status string
		Count  int
	}
 
	query := r.db.WithContext(ctx)
 
	if !startTime.IsZero() {
		query = query.Where("created_at >= ?", startTime)
	}
 
	query = query.Where("created_at <= ?", endTime).
		Group("status").
		Select("status, COUNT(*) as count")
 
	if err := query.Find(&results).Error; err != nil {
		return nil, err
	}
 
	statusCount := make(map[string]int)
	for _, result := range results {
		statusCount[result.Status] = result.Count
	}
 
	return statusCount, nil
}
 
func (r *ComplaintRepository) GetAverageResolutionTime(ctx context.Context, startTime, endTime time.Time) (float64, error) {
	var result struct {
		AvgDays float64
	}
 
	query := r.db.WithContext(ctx)
 
	if !startTime.IsZero() {
		query = query.Where("created_at >= ?", startTime)
	}
 
	if err := query.
		Where("created_at <= ?", endTime).
		Where("status IN ?", []string{"Resolved", "Closed"}).
		Select("AVG(EXTRACT(DAY FROM (NOW() - created_at))) as avg_days").
		Row().
		Scan(&result.AvgDays); err != nil {
		return 0, err
	}
 
	return result.AvgDays, nil
}
 
func (r *ComplaintRepository) GetComplaintTrend(ctx context.Context, currentStart, currentEnd, previousStart, previousEnd time.Time) (int, error) {
	var currentCount int64
	var previousCount int64
 
	if err := r.db.WithContext(ctx).
		Where("created_at >= ?", currentStart).
		Where("created_at <= ?", currentEnd).
		Model(&model.Complaint{}).
		Count(&currentCount).Error; err != nil {
		return 0, err
	}
 
	if err := r.db.WithContext(ctx).
		Where("created_at >= ?", previousStart).
		Where("created_at <= ?", previousEnd).
		Model(&model.Complaint{}).
		Count(&previousCount).Error; err != nil {
		return 0, err
	}
 
	if previousCount == 0 {
		return 0, nil
	}
 
	trend := int(((float64(currentCount) - float64(previousCount)) / float64(previousCount)) * 100)
	return trend, nil
}