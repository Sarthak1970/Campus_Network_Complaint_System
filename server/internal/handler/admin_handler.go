package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"Complaint-System/internal/model"
	"Complaint-System/internal/service"
)

type AdminHandler struct {
	service *service.AdminService
}

func NewAdminHandler(svc *service.AdminService) *AdminHandler {
	return &AdminHandler{service: svc}
}

func (h *AdminHandler) RegisterAdmin(c *gin.Context) {
	var req model.AdminRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	err := h.service.RegisterAdmin(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"msg": "Admin account created successfully"})
}

func (h *AdminHandler) LoginAdmin(c *gin.Context) {
	var req model.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	token, err := h.service.LoginAdmin(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"msg":   "Login successful",
	})
}