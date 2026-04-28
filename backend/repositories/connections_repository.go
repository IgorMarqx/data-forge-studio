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
		ColorHex: input.ColorHex,
	}

	err := r.db.WithContext(ctx).Create(&connection).Error
	if err != nil {
		return models.Connection{}, err
	}

	connection.Driver = driver
	return connection, nil
}

func (r *ConnectionsRepository) Update(ctx context.Context, input models.UpdateConnectionInput) (models.Connection, error) {
	var connection models.Connection
	if err := r.db.WithContext(ctx).Preload("Driver").First(&connection, input.ID).Error; err != nil {
		return models.Connection{}, err
	}

	updates := map[string]interface{}{}

	if input.Name != nil {
		updates["name"] = *input.Name
	}

	if input.Host != nil {
		updates["host"] = *input.Host
	}

	if input.Port != nil {
		updates["port"] = *input.Port
	}

	if input.Database != nil {
		updates["database_name"] = *input.Database
	}

	if input.Username != nil {
		updates["username"] = *input.Username
	}

	if input.Password != nil {
		updates["password"] = *input.Password
	}

	if input.SSL != nil {
		updates["ssl"] = *input.SSL
	}

	if input.ColorHex != nil {
		updates["color_hex"] = *input.ColorHex
	}

	if len(updates) > 0 {
		if err := r.db.WithContext(ctx).Model(&connection).Updates(updates).Error; err != nil {
			return models.Connection{}, err
		}
	}

	if err := r.db.WithContext(ctx).Preload("Driver").First(&connection, input.ID).Error; err != nil {
		return models.Connection{}, err
	}

	return connection, nil
}
