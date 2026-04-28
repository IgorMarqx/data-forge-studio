package services

import (
	"context"
	"data-forge-studio/backend/models"
	"data-forge-studio/backend/repositories"
)

type DriversService struct {
	repository *repositories.DriversRepository
}

func NewDriversService(repository *repositories.DriversRepository) *DriversService {
	return &DriversService{repository: repository}
}

func (s *DriversService) GetAllDrivers(ctx context.Context) ([]models.Driver, error) {
	return s.repository.GetAllDrivers(ctx)
}
