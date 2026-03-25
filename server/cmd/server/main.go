package main

import(
	"fmt"

	"github.com/gin-gonic/gin"
	"Complaint-System/internal/config"
	"Complaint-System/internal/database"
	"Complaint-System/internal/handler"
	"Complaint-System/internal/repository"
	"Complaint-System/internal/service"
)

func main(){
	cfg:=config.LoadConfig()
	database.ConnectDB(cfg.DatabaseURL)

	repo:=repository.NewComplaintRepository(database.DB)
	svc:=service.NewComplaintService(repo)
	handler:=handler.NewComplaintHandler(svc)

	r:=gin.Default()

	//CORS
	r.Use(func(c *gin.Context){
		c.Writer.Header().Set("Access-Control-Allow-Origin","*")
		c.Writer.Header().Set("Access-Control-Allow-Methods","GET,POST,OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers","Content-Type")

		if c.Request.Method=="OPTIONS"{
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.POST("api/complaints",handler.CreateComplaint)
	
	fmt.Printf("Server running on http://localhost:%s\n", cfg.ServerPort)
		if err := r.Run(":" + cfg.ServerPort); err != nil {
			fmt.Println("Error in starting the server:",err)
		}
}