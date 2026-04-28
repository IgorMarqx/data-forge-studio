import { useEffect, useMemo, useRef, useState } from 'react';
import type {BackendConnection} from '../services/connectionsService';

type NewConnectionsProps = {
    connections: BackendConnection[];
    selectedConnectionId: string;
    onSelectConnection: (connectionId: string) => void;
};

export function NewConnections({
    connections,
    selectedConnectionId,
    onSelectConnection,
}: NewConnectionsProps) {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [search, setSearch] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedConnection = useMemo(
        () => connections.find((connection) => String(connection.id) === selectedConnectionId),
        [connections, selectedConnectionId],
    );

    const filteredConnections = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return connections;
        }

        return connections.filter((connection) =>
            [
                connection.name,
                connection.driver.name,
                connection.database,
                connection.host,
                connection.port,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(normalizedSearch),
        );
    }, [connections, search]);

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!selectRef.current?.contains(event.target as Node)) {
                setIsSelectOpen(false);
                setSearch('');
            }
        }

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, []);

    function handleSelectConnection(connectionId: string) {
        onSelectConnection(connectionId);
        setIsSelectOpen(false);
        setSearch('');
    }

    return (
        <section className="min-h-0 overflow-y-auto p-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-wide text-cyan-400">Nova conexão</p>
                    <h2 className="mt-1 text-2xl font-semibold text-zinc-50">
                        Escolha uma conexão
                    </h2>
                </div>

                <div className="rounded border border-zinc-800 bg-zinc-950 p-5">
                    <div className="relative" ref={selectRef}>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-300">Conexão</label>

                        <button
                            aria-expanded={isSelectOpen}
                            aria-haspopup="listbox"
                            className="flex h-10 w-full items-center justify-between rounded border border-zinc-700 bg-zinc-900 px-3 text-left text-sm text-zinc-100 outline-none transition hover:border-zinc-600 focus:border-cyan-500"
                            onClick={() => setIsSelectOpen((current) => !current)}
                            type="button"
                        >
                            <span className={selectedConnection ? 'text-zinc-100' : 'text-zinc-500'}>
                                {selectedConnection?.name ?? 'Selecione uma conexão'}
                            </span>
                            <span
                                aria-hidden="true"
                                className={[
                                    'ml-3 text-xs text-zinc-500 transition-transform',
                                    isSelectOpen ? 'rotate-180' : '',
                                ].join(' ')}
                            >
                                v
                            </span>
                        </button>

                        {isSelectOpen && (
                            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded border border-zinc-700 bg-zinc-950 shadow-xl shadow-black/30">
                                <div className="border-b border-zinc-800 p-2">
                                    <input
                                        autoFocus
                                        className="h-9 w-full rounded border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500"
                                        onChange={(event) => setSearch(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Escape') {
                                                setIsSelectOpen(false);
                                                setSearch('');
                                            }
                                        }}
                                        placeholder="Pesquisar conexão..."
                                        value={search}
                                    />
                                </div>

                                <div className="max-h-64 overflow-y-auto p-1" role="listbox">
                                    {filteredConnections.length > 0 ? (
                                        filteredConnections.map((connection) => {
                                            const connectionId = String(connection.id);
                                            const isSelected = connectionId === selectedConnectionId;

                                            return (
                                                <button
                                                    aria-selected={isSelected}
                                                    className={[
                                                        'flex w-full items-start gap-3 rounded px-2.5 py-2 text-left text-sm outline-none transition',
                                                        isSelected
                                                            ? 'bg-cyan-950/60 text-cyan-100'
                                                            : 'text-zinc-200 hover:bg-zinc-900 focus:bg-zinc-900',
                                                    ].join(' ')}
                                                    key={connection.id}
                                                    onClick={() => handleSelectConnection(connectionId)}
                                                    role="option"
                                                    type="button"
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={[
                                                            'mt-1 h-2 w-2 shrink-0 rounded-full',
                                                            isSelected ? 'bg-cyan-400' : 'bg-zinc-700',
                                                        ].join(' ')}
                                                    />
                                                    <span className="min-w-0">
                                                        <span className="block font-medium">
                                                            {connection.name}
                                                        </span>
                                                        <span className="mt-0.5 block truncate text-xs text-zinc-500">
                                                            {connection.driver.name} · {connection.database}
                                                        </span>
                                                    </span>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <p className="px-3 py-4 text-sm text-zinc-500">
                                            Nenhuma conexão encontrada.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedConnection && (
                        <div className="mt-5 rounded border border-zinc-800 bg-zinc-900 p-4">
                            <p className="text-sm font-medium text-zinc-100">{selectedConnection.name}</p>
                            <p className="mt-1 text-sm text-zinc-400">
                                {selectedConnection.driver.name} · {selectedConnection.database}
                            </p>
                            {selectedConnection.driver.name !== 'sqlite' && (
                                <p className="mt-1 text-sm text-zinc-500">
                                    {selectedConnection.host}:{selectedConnection.port}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
