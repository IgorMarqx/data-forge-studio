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
	input.ColorHex = strings.TrimSpace(input.ColorHex)

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

	if input.ColorHex == "" {
		input.ColorHex = "#ec4899"
	}

	return s.repository.Create(ctx, input)
}

func (s *ConnectionsService) Update(ctx context.Context, input models.UpdateConnectionInput) (models.Connection, error) {
	if input.ID == 0 {
		return models.Connection{}, errors.New("conexão é obrigatória")
	}

	if input.Name != nil {
		value := strings.TrimSpace(*input.Name)
		input.Name = &value

		if value == "" {
			return models.Connection{}, errors.New("nome da conexão é obrigatório")
		}
	}

	if input.Host != nil {
		value := strings.TrimSpace(*input.Host)
		input.Host = &value
	}

	if input.Port != nil {
		value := strings.TrimSpace(*input.Port)
		input.Port = &value
	}

	if input.Database != nil {
		value := strings.TrimSpace(*input.Database)
		input.Database = &value

		if value == "" {
			return models.Connection{}, errors.New("database é obrigatório")
		}
	}

	if input.Username != nil {
		value := strings.TrimSpace(*input.Username)
		input.Username = &value
	}

	if input.ColorHex != nil {
		value := strings.TrimSpace(*input.ColorHex)
		input.ColorHex = &value

		if value == "" {
			return models.Connection{}, errors.New("cor da conexão é obrigatória")
		}
	}

	return s.repository.Update(ctx, input)
}
