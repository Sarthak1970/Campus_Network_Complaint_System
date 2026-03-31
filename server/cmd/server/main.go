package main

import (
	"fmt"
	"log"

	"Complaint-System/internal/config"
	"Complaint-System/internal/database"

	"github.com/gin-gonic/gin"

	// "Complaint-System/internal/handler"
	"Complaint-System/internal/repository"
	"Complaint-System/internal/routes"
	"Complaint-System/internal/service"
	// "Complaint-System/internal/model"
)

func main() {
	cfg := config.LoadConfig()

	db, err := database.ConnectDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	// err = db.AutoMigrate(&model.Complaint{}, &model.Admin{})
	// if err != nil {
	// 	log.Fatalf("Failed to migrate database: %v", err)
	// }
	// log.Println("Database migrated successfully")

	repo := repository.NewComplaintRepository(db)
	svc := service.NewComplaintService(repo)
	adminSvc := service.NewAdminService(repo)

	r := gin.Default()

	r.Use(corsMiddleware())

	routes.SetupComplaintRoutes(r, svc)
	routes.SetupDashboardRoutes(r, svc)
	routes.SetupAdminRoutes(r, adminSvc)

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "Complaint Management System API",
			"status":  "success",
			"routes": []string{
				"/api/complaints",
				"/api/dashboard",
			},
		})
	})

	fmt.Println("Server running on http://localhost:" + cfg.ServerPort)
	fmt.Println("Registered Routes:")
	for _, route := range r.Routes() {
		fmt.Printf("  %s  %s\n", route.Method, route.Path)
	}

	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
