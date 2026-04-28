package controllers

import (
	"context"

	"data-forge-studio/backend/models"
	"data-forge-studio/backend/services"
)

type ConnectionsController struct {
	service *services.ConnectionsService
}

func NewConnectionsController(service *services.ConnectionsService) *ConnectionsController {
	return &ConnectionsController{service: service}
}

func (c *ConnectionsController) List(ctx context.Context) ([]models.Connection, error) {
	return c.service.List(ctx)
}

func (c *ConnectionsController) Create(ctx context.Context, input models.CreateConnectionInput) (models.Connection, error) {
	return c.service.Create(ctx, input)
}

func (c *ConnectionsController) Update(ctx context.Context, input models.UpdateConnectionInput) (models.Connection, error) {
	return c.service.Update(ctx, input)
}
