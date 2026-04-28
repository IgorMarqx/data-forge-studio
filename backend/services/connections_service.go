package services

import (
	"context"
	"errors"
	"strings"

	"data-forge-studio/backend/models"
	"data-forge-studio/backend/repositories"
)

type ConnectionsService struct {
	repository *repositories.ConnectionsRepository
}

func NewConnectionsService(repository *repositories.ConnectionsRepository) *ConnectionsService {
	return &ConnectionsService{repository: repository}
}

func (s *ConnectionsService) List(ctx context.Context) ([]models.Connection, error) {
	return s.repository.List(ctx)
}

func (s *ConnectionsService) Create(ctx context.Context, input models.CreateConnectionInput) (models.Connection, error) {
	input.Name = strings.TrimSpace(input.Name)
	input.Driver = strings.TrimSpace(input.Driver)
	input.Host = strings.TrimSpace(input.Host)
	input.Port = strings.TrimSpace(input.Port)
	input.Database = strings.TrimSpace(input.Database)
	input.Username = strings.TrimSpace(input.Username)

	if input.Name == "" {
		return models.Connection{}, errors.New("nome da conexão é obrigatório")
	}

	if input.Driver == "" {
		return models.Connection{}, errors.New("driver é obrigatório")
	}

	if input.Database == "" {
		return models.Connection{}, errors.New("database é obrigatório")
	}

	if input.Driver != "sqlite" && input.Host == "" {
		return models.Connection{}, errors.New("host é obrigatório")
	}

	return s.repository.Create(ctx, input)
}
