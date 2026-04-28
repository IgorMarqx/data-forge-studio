package services

import (
	"context"
	"data-forge-studio/backend/models"
	"data-forge-studio/backend/repositories"
)

type DriversService struct {
	repositories *repositories.DriversRepository
}

func (s *DriversService) GetAllDrivers(ctx context.Context) ([]models.Driver, error) {
	return s.repositories.GetAllDrivers(ctx)
}
