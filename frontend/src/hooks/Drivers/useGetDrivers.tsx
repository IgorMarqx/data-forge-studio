import {useCallback, useEffect, useState} from 'react';
import {getDrivers, type BackendDriver} from '../../services/driversService';

export function useGetDrivers() {
    const [drivers, setDrivers] = useState<BackendDriver[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadDrivers = useCallback(async () => {
        try {
            console.log('[useGetDrivers] buscando drivers...');
            setLoading(true);
            setError(null);

            const response = await getDrivers();
            console.log('[useGetDrivers] drivers retornados:', response);
            setDrivers(response);
        } catch (err) {
            console.error('[useGetDrivers] erro ao buscar drivers:', err);
            setError(normalizeError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDrivers();
    }, [loadDrivers]);

    return {
        drivers,
        loading,
        error,
        reload: loadDrivers,
    };
}

function normalizeError(err: unknown) {
    if (err instanceof Error) {
        return err.message;
    }

    if (typeof err === 'string') {
        return err;
    }

    try {
        return JSON.stringify(err);
    } catch {
        return 'Erro desconhecido ao buscar drivers.';
    }
}
