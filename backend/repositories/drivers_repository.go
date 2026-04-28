package repositories

import (
	"context"
	"data-forge-studio/backend/models"

	"gorm.io/gorm"
)

type DriversRepository struct {
	db *gorm.DB
}

func NewDriversRepository(db *gorm.DB) *DriversRepository {
	return &DriversRepository{db: db}
}

func (r *DriversRepository) GetAllDrivers(ctx context.Context) ([]models.Driver, error) {
	var drivers []models.Driver

	err := r.db.WithContext(ctx).Order("id DESC").Find(&drivers).Error

	if err != nil {
		return nil, err
	}

	return drivers, nil
}
