package controllers

import (
	"context"
	"data-forge-studio/backend/models"
	"data-forge-studio/backend/services"
)

type DriversController struct {
	service *services.DriversService
}

func NewDriversController(service *services.DriversService) *DriversController {
	return &DriversController{service: service}
}

func (c *DriversController) GetALlDrivers(ctx context.Context) ([]models.Driver, error) {
	return c.service.GetAllDrivers(ctx)
}
