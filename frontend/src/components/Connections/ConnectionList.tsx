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
        <div className="w-full min-w-0 max-w-full space-y-1.5 overflow-hidden">
            {connections.map((connection) => {
                const connectionId = String(connection.id);
                const isSelected = connectionId === selectedConnectionId;
                const color = connection.colorHex || '#ec4899';
                const hostLabel = `${connection.host || 'localhost'}:${connection.port || '-'}`;
                const databaseLabel = connection.database || '-';
                const driverLabel = connection.driver?.name || 'driver';

                return (
                    <button
                        key={connection.id}
                        className={[
                            'relative grid min-h-[52px] w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded border py-2 pl-4 pr-3 text-left transition cursor-pointer',
                            isSelected
                                ? 'border-[#30384b] bg-[#263047]'
                                : 'border-transparent bg-transparent hover:border-[#30384b] hover:bg-[#1a2030]',
                        ].join(' ')}
                        onClick={() => onSelectConnection(connectionId)}
                        type="button"
                    >
                        <span
                            className="absolute left-0 top-0 h-full w-1"
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                        />
                        <span className="block min-w-0 overflow-hidden">
                            <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-white">{connection.name}</span>
                            <span className="mt-0.5 flex min-w-0 items-center gap-1.5 overflow-hidden text-[11px] text-slate-400">
                                <span
                                    className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                                    title={hostLabel}
                                >
                                    {hostLabel}
                                </span>
                            </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-[#5d6470] px-2 py-0.5 text-[11px] font-semibold lowercase leading-4 text-white">
                            {driverLabel}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
