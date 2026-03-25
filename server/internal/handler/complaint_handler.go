package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"Complaint-System/internal/model"
	"Complaint-System/internal/service"
)

type ComplaintHandler struct {
	service *service.ComplaintService
}

func NewComplaintHandler(service *service.ComplaintService) *ComplaintHandler {
	return &ComplaintHandler{service: service}
}

func (h *ComplaintHandler) CreateComplaint(c *gin.Context) {
	var req model.CreateComplaintRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	complaint, err := h.service.CreateComplaint(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create complaint"})
		return
	}

	c.JSON(http.StatusCreated, complaint)
}