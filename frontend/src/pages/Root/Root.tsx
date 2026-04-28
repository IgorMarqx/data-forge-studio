import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NewConnections } from '../../components/NewConnections';
import { ConnectionList } from '../../components/Connections/ConnectionList';
import { useGetConnections } from '../../hooks/Connections/useGetConnections';
import type { BackendDriver } from '../../services/driversService';
import { ConnectionForm } from '../../components/Connections/ConnectionForm';
import { ConnectionExplorerControls } from '../../components/Connections/ConnectionExplorerControls';
import { sortValue, type SortDirection, type SortField } from './Root.utils';
import { useConnectionsSummary } from '../../contexts/ConnectionsSummaryContext';

const NEW_CONNECTION_ID = '__new_connection__';

export function Root() {
    const { loading, connections, error, getConnections } = useGetConnections();
    const { setConnectionCount } = useConnectionsSummary();
    const [selectedConnectionId, setSelectedConnectionId] = useState('');
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [selectedDriver, setSelectedDriver] = useState<BackendDriver | null>(null);
    const [connectionsExpanded, setConnectionsExpanded] = useState(true);
    const [connectionSearch, setConnectionSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [sortMenuOpen, setSortMenuOpen] = useState(false);

    useEffect(() => {
        getConnections();
    }, [getConnections]);

    useEffect(() => {
        if (!selectedConnectionId && connections.length > 0) {
            setSelectedConnectionId(String(connections[0].id));
        }
    }, [connections, selectedConnectionId]);

    useEffect(() => {
        setConnectionCount(connections.length);
    }, [connections.length, setConnectionCount]);

    const selectedConnection = connections.find((connection) => String(connection.id) === selectedConnectionId) ?? null;
    const activeDriver = selectedConnection?.driver ?? selectedDriver;
    const isConnectionSelected = Boolean(selectedConnection);
    const visibleConnections = useMemo(() => {
        const search = connectionSearch.trim().toLowerCase();

        return connections
            .filter((connection) => connection.name.toLowerCase().includes(search))
            .sort((current, next) => {
                const currentValue = sortValue(current, sortField);
                const nextValue = sortValue(next, sortField);
                const result = currentValue.localeCompare(nextValue, undefined, {
                    numeric: true,
                    sensitivity: 'base',
                });

                return sortDirection === 'asc' ? result : -result;
            });
    }, [connectionSearch, connections, sortDirection, sortField]);

    return (
        <main
            className={[
                'grid min-h-0 bg-[#080d14]',
                isConnectionSelected ? 'grid-cols-[280px_1fr]' : 'grid-cols-[280px_288px_1fr]',
            ].join(' ')}
        >
            <aside className="grid min-h-0 grid-rows-[1fr_45px] border-r border-[#2b3140] bg-[#090e15]">
                <div className="min-h-0">
                    <div className="px-2 py-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">Explorer</p>
                    </div>

                    <ConnectionExplorerControls
                        connectionCount={visibleConnections.length}
                        connectionSearch={connectionSearch}
                        connectionsExpanded={connectionsExpanded}
                        onChangeConnectionSearch={setConnectionSearch}
                        onChangeSortDirection={setSortDirection}
                        onChangeSortField={(field) => {
                            setSortField(field);
                            setSortMenuOpen(false);
                        }}
                        onReloadConnections={() => void getConnections()}
                        onToggleConnectionsExpanded={() => setConnectionsExpanded((current) => !current)}
                        onToggleSortMenu={() => setSortMenuOpen((current) => !current)}
                        sortDirection={sortDirection}
                        sortField={sortField}
                        sortMenuOpen={sortMenuOpen}
                    />

                    {connectionsExpanded && (
                        <div className="mt-5 min-w-0 overflow-hidden px-4 text-xs text-slate-400">
                            <ConnectionList
                                connections={visibleConnections}
                                error={error}
                                loading={loading}
                                onSelectConnection={setSelectedConnectionId}
                                selectedConnectionId={selectedConnectionId}
                            />
                        </div>
                    )}
                </div>

                <div className="border-t border-[#2b3140] p-2">
                    <button
                        className="h-7 w-full rounded bg-[#d9480b] text-xs font-semibold text-white transition hover:bg-[#f05a14] cursor-pointer"
                        onClick={() => {
                            setSelectedConnectionId(NEW_CONNECTION_ID);

                            if (isConnectionSelected) {
                                setSelectedDriver(null);
                                setSelectedDriverId('');
                            }
                        }}
                        type="button"
                    >
                        <Plus className="mr-1 inline size-3.5" aria-hidden="true" />
                        Nova Conexão
                    </button>
                </div>
            </aside>

            {!isConnectionSelected && (
                <NewConnections
                    onSelectDriver={(driver) => {
                        setSelectedDriver(driver);
                        setSelectedDriverId(String(driver.id));
                    }}
                    selectedDriverId={selectedDriverId}
                />
            )}

            <section className="min-h-0 overflow-y-auto bg-[#090e15] px-16 py-8">
                <div className="mx-auto max-w-[674px]">
                    {activeDriver ? (
                        <ConnectionForm
                            connection={selectedConnection}
                            driver={activeDriver}
                            key={selectedConnection ? `connection-${selectedConnection.id}` : `driver-${activeDriver.id}`}
                            onSaved={(connection) => {
                                setSelectedConnectionId(String(connection.id));
                                void getConnections();
                            }}
                        />
                    ) : (
                        <div className="pt-6">
                            <p className="text-xs uppercase tracking-wide text-[#ff5a14]">Nova conexão</p>
                            <h2 className="mt-3 text-lg font-semibold text-white">Selecione um driver</h2>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
