package database

import (
	"context"
	"database/sql"
	"fmt"
	"net"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type MySQLConfig struct {
	Host     string
	Port     string
	Database string
	Username string
	Password string
}

type Status struct {
	Connected bool   `json:"connected"`
	Message   string `json:"message"`
}

func MySQLConfigFromEnv() MySQLConfig {
	return MySQLConfig{
		Host:     envOrDefault("DATA_FORGE_DB_HOST", "127.0.0.1"),
		Port:     envOrDefault("DATA_FORGE_DB_PORT", "3306"),
		Database: envOrDefault("DATA_FORGE_DB_NAME", "data_forge_studio"),
		Username: envOrDefault("DATA_FORGE_DB_USER", "root"),
		Password: os.Getenv("DATA_FORGE_DB_PASSWORD"),
	}
}

func OpenMySQL(ctx context.Context, config MySQLConfig) (*sql.DB, error) {
	db, err := sql.Open("mysql", config.DSN())
	if err != nil {
		return nil, fmt.Errorf("open mysql: %w", err)
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(30 * time.Minute)
	db.SetConnMaxIdleTime(5 * time.Minute)

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := db.PingContext(pingCtx); err != nil {
		db.Close()
		return nil, fmt.Errorf("ping mysql: %w", err)
	}

	return db, nil
}

func OpenGORM(ctx context.Context, config MySQLConfig) (*gorm.DB, error) {
	db, err := gorm.Open(mysql.Open(config.DSN()), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("open gorm mysql: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("get sql db: %w", err)
	}

	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)
	sqlDB.SetConnMaxIdleTime(5 * time.Minute)

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(pingCtx); err != nil {
		sqlDB.Close()
		return nil, fmt.Errorf("ping mysql: %w", err)
	}

	return db, nil
}

func (c MySQLConfig) DSN() string {
	address := net.JoinHostPort(c.Host, c.Port)
	return fmt.Sprintf(
		"%s:%s@tcp(%s)/%s?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci",
		c.Username,
		c.Password,
		address,
		c.Database,
	)
}

func envOrDefault(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}
