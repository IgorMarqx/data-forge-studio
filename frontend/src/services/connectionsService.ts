import {CreateConnection, GetConnections, GetProjectDatabaseStatus, UpdateConnection} from '../../wailsjs/go/main/App';
import type {database, models} from '../../wailsjs/go/models';
import type {ConnectionForm} from '../types/ConnectionForm';

export type SavedConnection = ConnectionForm & {
    id: string | number;
};

export type ProjectDatabaseStatus = database.Status;
export type BackendConnection = models.Connection;
export type CreateConnectionInput = models.CreateConnectionInput;
export type UpdateConnectionInput = models.UpdateConnectionInput;

export function getProjectDatabaseStatus(): Promise<ProjectDatabaseStatus> {
    return GetProjectDatabaseStatus();
}

export function getConnections(): Promise<BackendConnection[]> {
    return GetConnections();
}

export function createConnection(form: CreateConnectionInput): Promise<BackendConnection> {
    return CreateConnection(form);
}

export function updateConnection(form: UpdateConnectionInput): Promise<BackendConnection> {
    return UpdateConnection(form);
}

export async function testConnection(form: ConnectionForm): Promise<string> {
    await wait(250);
    return `Conexão "${form.name}" validada no front-end.`;
}

export async function saveConnection(form: ConnectionForm): Promise<SavedConnection> {
    await wait(250);

    return {
        ...form,
        id: crypto.randomUUID(),
        password: '',
    };
}

function wait(milliseconds: number) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}
