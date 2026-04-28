import type { BackendConnection } from '../../services/connectionsService';

type ConnectionListProps = {
    connections: BackendConnection[];
    selectedConnectionId: string;
    loading: boolean;
    error: string | null;
    onSelectConnection: (connectionId: string) => void;
};

export function ConnectionList({
    connections,
    selectedConnectionId,
    loading,
    error,
    onSelectConnection,
}: ConnectionListProps) {
    if (loading) {
        return <p className="px-1 py-2 text-sm text-zinc-500">Carregando conexões...</p>;
    }

    if (error) {
        return <p className="px-1 py-2 text-sm text-red-300">{error}</p>;
    }

    if (connections.length === 0) {
        return <p className="px-1 py-2 text-sm text-zinc-500">Nenhuma conexão cadastrada.</p>;
    }

    return (
        <>
            {connections.map((connection) => {
                const connectionId = String(connection.id);
                const isSelected = connectionId === selectedConnectionId;

                return (
                    <button
                        key={connection.id}
                        className={[
                            'w-full rounded border p-3 text-left transition',
                            isSelected
                                ? 'border-cyan-600 bg-cyan-950/40'
                                : 'border-zinc-800 bg-zinc-900 hover:border-cyan-700 hover:bg-zinc-800',
                        ].join(' ')}
                        onClick={() => onSelectConnection(connectionId)}
                        type="button"
                    >
                        <span className="block text-sm font-medium text-zinc-100">{connection.name}</span>
                        <span className="mt-1 block text-xs text-zinc-500">
                            {connection.driver.name} · {connection.database}
                        </span>
                    </button>
                );
            })}
        </>
    );
}
