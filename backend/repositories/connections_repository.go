package repositories

import (
	"context"

	"data-forge-studio/backend/models"

	"gorm.io/gorm"
)

type ConnectionsRepository struct {
	db *gorm.DB
}

func NewConnectionsRepository(db *gorm.DB) *ConnectionsRepository {
	return &ConnectionsRepository{db: db}
}

func (r *ConnectionsRepository) List(ctx context.Context) ([]models.Connection, error) {
	var connections []models.Connection

	err := r.db.WithContext(ctx).
		Preload("Driver").
		Order("name ASC").
		Find(&connections).
		Error
	if err != nil {
		return nil, err
	}

	return connections, nil
}

func (r *ConnectionsRepository) Create(ctx context.Context, input models.CreateConnectionInput) (models.Connection, error) {
	var driver models.Driver
	if err := r.db.WithContext(ctx).Where("name = ?", input.Driver).First(&driver).Error; err != nil {
		return models.Connection{}, err
	}

	connection := models.Connection{
		Name:     input.Name,
		DriverID: driver.ID,
		Host:     input.Host,
		Port:     input.Port,
		Database: input.Database,
		Username: input.Username,
		Password: input.Password,
		SSL:      input.SSL,
	}

	err := r.db.WithContext(ctx).Create(&connection).Error
	if err != nil {
		return models.Connection{}, err
	}

	connection.Driver = driver
	return connection, nil
}
