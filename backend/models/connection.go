package models

import "time"

type Connection struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:120;not null" json:"name"`
	DriverID  uint      `gorm:"column:driver_id;not null" json:"driverId"`
	Driver    Driver    `gorm:"foreignKey:DriverID" json:"driver"`
	Host      string    `gorm:"size:255;not null;default:''" json:"host"`
	Port      string    `gorm:"size:20;not null;default:''" json:"port"`
	Database  string    `gorm:"column:database_name;size:255;not null" json:"database"`
	Username  string    `gorm:"size:255;not null;default:''" json:"username"`
	Password  string    `gorm:"type:text;not null" json:"password"`
	SSL       bool      `gorm:"column:ssl;not null;default:false" json:"ssl"`
	ColorHex  string    `gorm:"column:color_hex;size:7;not null;default:'#ec4899'" json:"colorHex"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (Connection) TableName() string {
	return "connections"
}

type CreateConnectionInput struct {
	Name     string `json:"name"`
	Driver   string `json:"driver"`
	Host     string `json:"host"`
	Port     string `json:"port"`
	Database string `json:"database"`
	Username string `json:"username"`
	Password string `json:"password"`
	SSL      bool   `json:"ssl"`
	ColorHex string `json:"colorHex"`
}

type UpdateConnectionInput struct {
	ID       uint    `json:"id"`
	Name     *string `json:"name,omitempty"`
	Host     *string `json:"host,omitempty"`
	Port     *string `json:"port,omitempty"`
	Database *string `json:"database,omitempty"`
	Username *string `json:"username,omitempty"`
	Password *string `json:"password,omitempty"`
	SSL      *bool   `json:"ssl,omitempty"`
	ColorHex *string `json:"colorHex,omitempty"`
}
