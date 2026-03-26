package handler
 
import (
	"net/http"
	"log"
	// "time"
 
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
	TrendValue int    `json:"trendValue"` // percentage change
}
 
type DashboardResponse struct {
	Stats map[string]DashboardStats `json:"stats"`
	RecentComplaints []RecentComplaintItem `json:"recentComplaints"`
}
 
type RecentComplaintItem struct {
	ID          int64  `json:"id"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Description string `json:"description"`
	Type        string `json:"type_of_complaint"`
	Status      string `json:"status"`
	Location    string `json:"location"`
	Time        string `json:"time"` // formatted as "X hours ago"
}
 
func (h *DashboardHandler) GetDashboard(c *gin.Context) {
	ctx := c.Request.Context()
 
	stats7d, err := h.service.GetComplaintStats(ctx, "7d")
	if err != nil {
		log.Printf("Error fetching 7d stats: %+v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch 7d statistics"})
		return
	}
 
	stats30d, err := h.service.GetComplaintStats(ctx, "30d")
	if err != nil {
		log.Printf("Error fetching 30d stats: %+v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch 30d statistics"})
		return
	}
 
	stats90d, err := h.service.GetComplaintStats(ctx, "90d")
	if err != nil {
		log.Printf("Error fetching 90d stats: %+v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch 90d statistics"})
		return
	}
 
	statsAll, err := h.service.GetComplaintStats(ctx, "all")
	if err != nil {
		log.Printf("Error fetching all-time stats: %+v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch all-time statistics"})
		return
	}
 
	recentComplaints, err := h.service.GetRecentComplaints(ctx, 3)
	if err != nil {
		log.Printf("Error fetching recent complaints: %+v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recent complaints"})
		return
	}
 
	response := DashboardResponse{
		Stats: map[string]DashboardStats{
			"7d":  stats7d,
			"30d": stats30d,
			"90d": stats90d,
			"all": statsAll,
		},
		RecentComplaints: recentComplaints,
	}
 
	c.JSON(http.StatusOK, response)
}
 
func (h *DashboardHandler) GetDashboardStats(c *gin.Context) {
	period := c.Query("period")
	if period == "" {
		period = "30d"
	}
 
	validPeriods := map[string]bool{"7d": true, "30d": true, "90d": true, "all": true}
	if !validPeriods[period] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid period. Must be one of: 7d, 30d, 90d, all"})
		return
	}
 
	ctx := c.Request.Context()
	stats, err := h.service.GetComplaintStats(ctx, period)
	if err != nil {
		log.Printf("Error fetching stats for period %s: %+v", period, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch statistics"})
		return
	}
 
	c.JSON(http.StatusOK, stats)
}
 
func (h *DashboardHandler) GetRecentComplaints(c *gin.Context) {
	limit := 10 
 
	if limitStr := c.Query("limit"); limitStr != "" {
		var l int
		if _, err := (&l); err != nil || l <= 0 {
			l = 10
		}
		limit = l
	}
 
	ctx := c.Request.Context()
	complaints, err := h.service.GetRecentComplaints(ctx, limit)
	if err != nil {
		log.Printf("Error fetching recent complaints: %+v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch recent complaints"})
		return
	}
 
	c.JSON(http.StatusOK, gin.H{"complaints": complaints})
}
