import {useCallback, useState} from 'react';
import {getConnections as getConnectionsService, type BackendConnection} from '../../services/connectionsService';

export function useGetConnections() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connections, setConnections] = useState<BackendConnection[]>([]);

    const getConnections = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getConnectionsService();

            setConnections(response);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, connections, error, getConnections };
}
