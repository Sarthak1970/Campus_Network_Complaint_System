package routes
 
import (
	"github.com/gin-gonic/gin"
	"Complaint-System/internal/handler"
	"Complaint-System/internal/service"
)
 
func SetupDashboardRoutes(router *gin.Engine, complaintService *service.ComplaintService) {
	dashboardHandler := handler.NewDashboardHandler(complaintService)
 
	dashboard := router.Group("/api/dashboard")
	{
		dashboard.GET("", dashboardHandler.GetDashboard)
 

		dashboard.GET("/stats", dashboardHandler.GetDashboardStats)
 

		dashboard.GET("/recent", dashboardHandler.GetRecentComplaints)
	}
}
 
// Usage in main.go:
// complaintService := service.NewComplaintService(repository)
// routes.SetupDashboardRoutes(router, complaintService)
 