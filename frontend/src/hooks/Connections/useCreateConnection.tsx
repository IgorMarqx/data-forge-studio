import {useCallback, useState} from 'react';
import {createConnection, type BackendConnection, type CreateConnectionInput} from '../../services/connectionsService';

export function useCreateConnection() {
    const [connection, setConnection] = useState<BackendConnection | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (input: CreateConnectionInput) => {
        try {
            setLoading(true);
            setError(null);

            const response = await createConnection(input);
            setConnection(response);

            return response;
        } catch (err) {
            const message = normalizeError(err);
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        connection,
        create,
        error,
        loading,
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
        return 'Erro desconhecido ao criar conexão.';
    }
}
