package routes
 
import (
	"github.com/gin-gonic/gin"
	"Complaint-System/internal/handler"
	"Complaint-System/internal/service"
)

func SetupComplaintRoutes(r *gin.Engine, svc *service.ComplaintService) {
	h := handler.NewComplaintHandler(svc)
	r.POST("/api/complaints", h.CreateComplaint)
}

func SetupDashboardRoutes(r *gin.Engine, svc *service.ComplaintService) {
	h := handler.NewDashboardHandler(svc)

	dashboard := r.Group("/api/dashboard")
	{
		dashboard.GET("", h.GetDashboard)                   
		dashboard.GET("/stats", h.GetDashboardStats)         
		dashboard.GET("/recent", h.GetRecentComplaints)      
	}
}
 
func SetupAdminRoutes(r *gin.Engine, adminService *service.AdminService) {
	h := handler.NewAdminHandler(adminService)

	admin := r.Group("/api/admin")
	{
		admin.POST("/register", h.RegisterAdmin)
		admin.POST("/login", h.LoginAdmin)
		admin.GET("/complaints", h.GetAllComplaints)          
		admin.PATCH("/complaints/:id/resolve", h.ResolveComplaintAdmin)
	}
}
