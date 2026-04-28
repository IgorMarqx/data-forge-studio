import type { BackendConnection } from '../../services/connectionsService';

export type SortField = 'name' | 'color' | 'createdAt' | 'type';
export type SortDirection = 'asc' | 'desc';

export const sortOptions: Array<{ field: SortField; label: string }> = [
    { field: 'color', label: 'Cores' },
    { field: 'createdAt', label: 'Criação' },
    { field: 'name', label: 'Nome' },
    { field: 'type', label: 'Tipo' },
];

export function sortValue(connection: BackendConnection, field: SortField) {
    if (field === 'color') {
        return connection.colorHex || '';
    }

    if (field === 'createdAt') {
        return String(new Date(connection.createdAt).getTime() || 0);
    }

    if (field === 'type') {
        return connection.driver?.name || '';
    }

    return connection.name || '';
}
