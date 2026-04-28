package main

import (
	"context"
	"errors"
	"fmt"

	"data-forge-studio/backend/controllers"
	"data-forge-studio/backend/database"
	"data-forge-studio/backend/models"
	"data-forge-studio/backend/repositories"
	"data-forge-studio/backend/services"
	"gorm.io/gorm"
)

// App struct
type App struct {
	ctx                   context.Context
	db                    *gorm.DB
	dbStatus              database.Status
	connectionsController *controllers.ConnectionsController
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.connectProjectDatabase(ctx)
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) shutdown(ctx context.Context) {
	if a.db != nil {
		sqlDB, err := a.db.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}

func (a *App) connectProjectDatabase(ctx context.Context) {
	config := database.MySQLConfigFromEnv()

	db, err := database.OpenGORM(ctx, config)
	if err != nil {
		a.dbStatus = database.Status{
			Connected: false,
			Message:   err.Error(),
		}
		return
	}

	a.db = db
	a.bootstrapBackend(db)
	a.dbStatus = database.Status{
		Connected: true,
		Message:   "MySQL conectado.",
	}
}

func (a *App) GetProjectDatabaseStatus() database.Status {
	return a.dbStatus
}

func (a *App) GetConnections() ([]models.Connection, error) {
	if a.connectionsController == nil {
		return nil, errors.New("backend não inicializado: conexão MySQL indisponível")
	}

	return a.connectionsController.List(a.ctx)
}

func (a *App) CreateConnection(input models.CreateConnectionInput) (models.Connection, error) {
	if a.connectionsController == nil {
		return models.Connection{}, errors.New("backend não inicializado: conexão MySQL indisponível")
	}

	return a.connectionsController.Create(a.ctx, input)
}

func (a *App) bootstrapBackend(db *gorm.DB) {
	connectionsRepository := repositories.NewConnectionsRepository(db)
	connectionsService := services.NewConnectionsService(connectionsRepository)
	a.connectionsController = controllers.NewConnectionsController(connectionsService)
}
