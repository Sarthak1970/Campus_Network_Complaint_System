package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"Complaint-System/internal/service"
)

type DashboardHandler struct {
	service *service.ComplaintService
}

func NewDashboardHandler(service *service.ComplaintService) *DashboardHandler {
	return &DashboardHandler{service: service}
}

type DashboardStats struct {
	Total      int    `json:"total"`
	Active     int    `json:"active"`
	Resolved   int    `json:"resolved"`
	AvgTime    string `json:"avgTime"`
	TrendValue int    `json:"trendValue,omitempty"`
}

type DashboardResponse struct {
	Stats            map[string]DashboardStats `json:"stats"`
	RecentComplaints []map[string]interface{}  `json:"recentComplaints"`
}

func (h *DashboardHandler) GetDashboard(c *gin.Context) {
	ctx := c.Request.Context()

	stats7d, _ := h.service.GetComplaintStats(ctx, "7d")
	stats30d, _ := h.service.GetComplaintStats(ctx, "30d")
	stats90d, _ := h.service.GetComplaintStats(ctx, "90d")
	statsAll, _ := h.service.GetComplaintStats(ctx, "all")

	recent, err := h.service.GetRecentComplaints(ctx, 5)
	if err != nil {
		recent = []map[string]interface{}{}
	}

	response := DashboardResponse{
		Stats: map[string]DashboardStats{
			"7d":  convertToDashboardStats(stats7d),
			"30d": convertToDashboardStats(stats30d),
			"90d": convertToDashboardStats(stats90d),
			"all": convertToDashboardStats(statsAll),
		},
		RecentComplaints: recent,
	}

	c.JSON(http.StatusOK, response)
}

func (h *DashboardHandler) GetDashboardStats(c *gin.Context) {
	period := c.DefaultQuery("period", "30d")

	validPeriods := map[string]bool{"7d": true, "30d": true, "90d": true, "all": true}
	if !validPeriods[period] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid period. Use: 7d, 30d, 90d, all"})
		return
	}

	stats, err := h.service.GetComplaintStats(c.Request.Context(), period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch statistics"})
		return
	}

	c.JSON(http.StatusOK, convertToDashboardStats(stats))
}

func (h *DashboardHandler) GetRecentComplaints(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	complaints, err := h.service.GetRecentComplaints(c.Request.Context(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recent complaints"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"complaints": complaints})
}

func convertToDashboardStats(data map[string]interface{}) DashboardStats {
	return DashboardStats{
		Total:    getInt(data, "total"),
		Active:   getInt(data, "active"),
		Resolved: getInt(data, "resolved"),
		AvgTime:  getString(data, "avgTime"),
	}
}

func getInt(m map[string]interface{}, key string) int {
	if v, ok := m[key].(int); ok {
		return v
	}
	if v, ok := m[key].(float64); ok {
		return int(v)
	}
	return 0
}

func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key].(string); ok {
		return v
	}
	return ""
}