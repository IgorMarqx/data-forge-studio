import { useEffect, useState } from 'react';
import { NewConnections } from '../../components/NewConnections';
import { ConnectionList } from '../../components/Connections/ConnectionList';
import { useGetConnections } from '../../hooks/Connections/useGetConnections';

export function Root() {
    const { loading, connections, error, getConnections } = useGetConnections();
    const [selectedConnectionId, setSelectedConnectionId] = useState('');

    useEffect(() => {
        getConnections();
    }, [getConnections]);

    useEffect(() => {
        if (!selectedConnectionId && connections.length > 0) {
            setSelectedConnectionId(String(connections[0].id));
        }
    }, [connections, selectedConnectionId]);

    return (
        <main className="grid min-h-0 grid-cols-[320px_1fr] bg-zinc-900">
            <aside className="min-h-0 border-r border-zinc-800 bg-zinc-950">
                <div className="border-b border-zinc-800 p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Banco de dados</p>
                    <h1 className="mt-1 text-lg font-semibold text-zinc-100">Conexões</h1>
                </div>

                <div className="space-y-2 overflow-y-auto p-3">
                    <ConnectionList
                        connections={connections}
                        error={error}
                        loading={loading}
                        onSelectConnection={setSelectedConnectionId}
                        selectedConnectionId={selectedConnectionId}
                    />
                </div>
            </aside>

            <NewConnections
                connections={connections}
                onSelectConnection={setSelectedConnectionId}
                selectedConnectionId={selectedConnectionId}
            />
        </main>
    );
}
