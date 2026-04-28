package models

import "time"

type Driver struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:40;not null" json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
