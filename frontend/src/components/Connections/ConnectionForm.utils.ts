import type { BackendConnection, UpdateConnectionInput } from '../../services/connectionsService';

export type FormState = {
    name: string;
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
    savePassword: boolean;
    color: string;
};

export const defaultPorts: Record<string, string> = {
    postgres: '5432',
    mysql: '3306',
    sqlserver: '1433',
    sqlite: '',
};

export function createInitialForm(driverName: string, connection?: BackendConnection | null): FormState {
    if (connection) {
        return {
            name: connection.name || '',
            host: connection.host || '',
            port: connection.port || '',
            database: connection.database || '',
            username: connection.username || '',
            password: connection.password || '',
            ssl: Boolean(connection.ssl),
            savePassword: Boolean(connection.password),
            color: connection.colorHex || '#ec4899',
        };
    }

    return {
        name: '',
        host: driverName === 'sqlite' ? '' : 'localhost',
        port: defaultPorts[driverName] ?? '',
        database: '',
        username: '',
        password: '',
        ssl: false,
        savePassword: true,
        color: '#ec4899',
    };
}

export function createUpdateInput(connection: BackendConnection, form: FormState): UpdateConnectionInput {
    const input: UpdateConnectionInput = {
        id: connection.id,
    };
    const password = form.savePassword ? form.password : '';

    if (form.name !== connection.name) {
        input.name = form.name;
    }

    if (form.host !== connection.host) {
        input.host = form.host;
    }

    if (form.port !== connection.port) {
        input.port = form.port;
    }

    if (form.database !== connection.database) {
        input.database = form.database;
    }

    if (form.username !== connection.username) {
        input.username = form.username;
    }

    if (password !== connection.password) {
        input.password = password;
    }

    if (form.ssl !== connection.ssl) {
        input.ssl = form.ssl;
    }

    if (form.color !== connection.colorHex) {
        input.colorHex = form.color;
    }

    return input;
}

export function savingLabel(creatingConnection: boolean, updatingConnection: boolean, isEditingConnection: boolean) {
    if (creatingConnection) {
        return 'Conectando...';
    }

    if (updatingConnection) {
        return 'Conectando...';
    }

    return isEditingConnection ? 'Reconectar' : 'Conectar';
}

export function formatDriverName(name: string) {
    const normalized = name.toLowerCase();

    if (normalized === 'postgres' || normalized === 'postgresql') {
        return 'PostgreSQL';
    }

    if (normalized === 'mysql') {
        return 'MySQL';
    }

    if (normalized === 'sqlite') {
        return 'SQLite';
    }

    return name;
}
