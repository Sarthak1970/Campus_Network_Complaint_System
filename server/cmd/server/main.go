package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"Complaint-System/internal/config"
	"Complaint-System/internal/database"
	"Complaint-System/internal/handler"
	"Complaint-System/internal/repository"
	"Complaint-System/internal/service"
)

func main() {
	cfg := config.LoadConfig()

	db, err := database.ConnectDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	repo := repository.NewComplaintRepository(db)
	svc := service.NewComplaintService(repo)
	h := handler.NewComplaintHandler(svc)

	r := gin.Default()

	r.Use(corsMiddleware())

	api := r.Group("/api")
	{
		api.POST("/complaints", h.CreateComplaint)
	}

	addr := ":" + cfg.ServerPort
	fmt.Printf("Server running on http://localhost%s\n", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		// Handle preflight requests
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}