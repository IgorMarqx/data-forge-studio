package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"data-forge-studio/backend/database"
	_ "github.com/go-sql-driver/mysql"
)

const migrationsDir = "backend/migrations"

func main() {
	if len(os.Args) < 2 {
		exitWithUsage()
	}

	command := os.Args[1]

	switch command {
	case "create":
		if len(os.Args) < 3 {
			exitWithUsage()
		}
		must(createMigration(os.Args[2]))
	case "up", "down", "status":
		db := mustOpenDB()
		defer db.Close()

		switch command {
		case "up":
			must(runUp(context.Background(), db))
		case "down":
			must(runDown(context.Background(), db))
		case "status":
			must(printStatus(context.Background(), db))
		}
	default:
		exitWithUsage()
	}
}

func createMigration(name string) error {
	if err := os.MkdirAll(migrationsDir, 0755); err != nil {
		return err
	}

	safeName := strings.ToLower(strings.TrimSpace(name))
	safeName = strings.ReplaceAll(safeName, " ", "_")
	if safeName == "" {
		return errors.New("nome da migration é obrigatório")
	}

	filename := fmt.Sprintf("%s_%s.sql", time.Now().Format("20060102150405"), safeName)
	path := filepath.Join(migrationsDir, filename)
	content := "-- +migrate Up\n\n-- +migrate Down\n"

	return os.WriteFile(path, []byte(content), 0644)
}

func mustOpenDB() *sql.DB {
	must(database.LoadEnvFile(".env"))

	config := database.MySQLConfigFromEnv()
	db, err := sql.Open("mysql", config.DSN())
	must(err)

	must(db.Ping())
	return db
}

func runUp(ctx context.Context, db *sql.DB) error {
	if err := ensureMigrationsTable(ctx, db); err != nil {
		return err
	}

	migrations, err := readMigrations()
	if err != nil {
		return err
	}

	applied, err := appliedMigrations(ctx, db)
	if err != nil {
		return err
	}

	for _, migration := range migrations {
		if applied[migration.Version] {
			continue
		}

		if err := runStatements(ctx, db, migration.UpSQL); err != nil {
			return fmt.Errorf("migration %s up: %w", migration.Version, err)
		}

		if _, err := db.ExecContext(ctx, "INSERT INTO schema_migrations (version) VALUES (?)", migration.Version); err != nil {
			return err
		}

		fmt.Printf("applied %s\n", migration.Version)
	}

	return nil
}

func runDown(ctx context.Context, db *sql.DB) error {
	if err := ensureMigrationsTable(ctx, db); err != nil {
		return err
	}

	migrations, err := readMigrations()
	if err != nil {
		return err
	}

	applied, err := appliedMigrations(ctx, db)
	if err != nil {
		return err
	}

	for i := len(migrations) - 1; i >= 0; i-- {
		migration := migrations[i]
		if !applied[migration.Version] {
			continue
		}

		if err := runStatements(ctx, db, migration.DownSQL); err != nil {
			return fmt.Errorf("migration %s down: %w", migration.Version, err)
		}

		if _, err := db.ExecContext(ctx, "DELETE FROM schema_migrations WHERE version = ?", migration.Version); err != nil {
			return err
		}

		fmt.Printf("rolled back %s\n", migration.Version)
		return nil
	}

	fmt.Println("no migration to roll back")
	return nil
}

func printStatus(ctx context.Context, db *sql.DB) error {
	if err := ensureMigrationsTable(ctx, db); err != nil {
		return err
	}

	migrations, err := readMigrations()
	if err != nil {
		return err
	}

	applied, err := appliedMigrations(ctx, db)
	if err != nil {
		return err
	}

	for _, migration := range migrations {
		status := "pending"
		if applied[migration.Version] {
			status = "applied"
		}
		fmt.Printf("%s %s\n", migration.Version, status)
	}

	return nil
}

type migrationFile struct {
	Version string
	UpSQL   string
	DownSQL string
}

func readMigrations() ([]migrationFile, error) {
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		return nil, err
	}

	var migrations []migrationFile
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".sql") {
			continue
		}

		path := filepath.Join(migrationsDir, entry.Name())
		content, err := os.ReadFile(path)
		if err != nil {
			return nil, err
		}

		upSQL, downSQL, err := splitMigration(string(content))
		if err != nil {
			return nil, fmt.Errorf("%s: %w", entry.Name(), err)
		}

		version := strings.TrimSuffix(entry.Name(), ".sql")
		migrations = append(migrations, migrationFile{
			Version: version,
			UpSQL:   upSQL,
			DownSQL: downSQL,
		})
	}

	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	return migrations, nil
}

func splitMigration(content string) (string, string, error) {
	parts := strings.Split(content, "-- +migrate Down")
	if len(parts) != 2 {
		return "", "", errors.New("marcador -- +migrate Down não encontrado")
	}

	upSQL := strings.TrimSpace(strings.Replace(parts[0], "-- +migrate Up", "", 1))
	downSQL := strings.TrimSpace(parts[1])

	return upSQL, downSQL, nil
}

func runStatements(ctx context.Context, db *sql.DB, sqlText string) error {
	for _, statement := range strings.Split(sqlText, ";") {
		statement = strings.TrimSpace(statement)
		if statement == "" {
			continue
		}

		if _, err := db.ExecContext(ctx, statement); err != nil {
			return err
		}
	}

	return nil
}

func ensureMigrationsTable(ctx context.Context, db *sql.DB) error {
	_, err := db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version VARCHAR(255) PRIMARY KEY,
			applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)
	`)
	return err
}

func appliedMigrations(ctx context.Context, db *sql.DB) (map[string]bool, error) {
	rows, err := db.QueryContext(ctx, "SELECT version FROM schema_migrations")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	applied := make(map[string]bool)
	for rows.Next() {
		var version string
		if err := rows.Scan(&version); err != nil {
			return nil, err
		}
		applied[version] = true
	}

	return applied, rows.Err()
}

func must(err error) {
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func exitWithUsage() {
	fmt.Fprintln(os.Stderr, "uso: go run ./backend/cmd/migrate <create|up|down|status> [nome]")
	os.Exit(1)
}
