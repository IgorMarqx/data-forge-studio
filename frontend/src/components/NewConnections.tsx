import { Check, Circle, Database, Server, SquareStack, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useGetDrivers } from '../hooks/Drivers/useGetDrivers';
import type { BackendDriver } from '../services/driversService';

type NewConnectionsProps = {
    selectedDriverId?: string;
    onSelectDriver?: (driver: BackendDriver) => void;
};

export function NewConnections({
    selectedDriverId,
    onSelectDriver,
}: NewConnectionsProps) {
    const { drivers, loading, error, reload } = useGetDrivers();
    const [localSelectedDriverId, setLocalSelectedDriverId] = useState(selectedDriverId ?? '');

    useEffect(() => {
        if (selectedDriverId !== undefined) {
            setLocalSelectedDriverId(selectedDriverId);
        }
    }, [selectedDriverId]);

    const activeDriverId = selectedDriverId ?? localSelectedDriverId;
    const selectedDriver = useMemo(
        () => drivers.find((driver) => String(driver.id) === activeDriverId),
        [drivers, activeDriverId],
    );

    function handleSelectDriver(driverId: string) {
        const driver = drivers.find((item) => String(item.id) === driverId);

        setLocalSelectedDriverId(driverId);

        if (driver) {
            onSelectDriver?.(driver);
        }
    }

    return (
        <section className="min-h-0 border-r border-[#2b3140] bg-[#121722] px-4 py-6">
            <div>
                <p className="text-xs uppercase tracking-wide text-[#ff5a14]">Driver</p>
                <h2 className="mt-3 text-sm font-semibold text-white">Selecione o driver</h2>
            </div>

            <div className="mt-5 space-y-1.5">
                {loading && (
                    <p className="rounded border border-[#30384b] bg-[#1a2030] px-3 py-3 text-xs text-slate-400">
                        Carregando drivers...
                    </p>
                )}

                {error && (
                    <div className="rounded border border-red-900/70 bg-red-950/40 px-3 py-2">
                        <p className="text-xs text-red-200">{error}</p>
                        <button
                            className="mt-2 text-xs font-medium text-red-100 underline decoration-red-400 underline-offset-4"
                            onClick={reload}
                            type="button"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {!loading && !error && drivers.length === 0 && (
                    <p className="rounded border border-[#30384b] bg-[#1a2030] px-3 py-3 text-xs text-slate-400">
                        Nenhum driver cadastrado.
                    </p>
                )}

                {drivers.map((driver) => {
                    const driverId = String(driver.id);
                    const isSelected = selectedDriver?.id === driver.id;
                    const meta = driverMeta(driver.name);

                    return (
                        <button
                            className={[
                                'flex h-[54px] w-full items-center gap-3 rounded border px-3 text-left transition cursor-pointer',
                                isSelected
                                    ? 'border-[#d9480b] bg-[#21100f]'
                                    : 'border-[#30384b] bg-[#1a2030] hover:border-[#5b647a]',
                            ].join(' ')}
                            key={driver.id}
                            onClick={() => handleSelectDriver(driverId)}
                            type="button"
                        >
                            <span
                                className="grid size-8 shrink-0 place-items-center rounded bg-[#293247] text-slate-200"
                                aria-hidden="true"
                            >
                                <meta.Icon className="size-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="text-sm font-semibold text-white">{meta.label}</span>
                                {meta.port && <span className="ml-2 text-xs text-slate-400">:{meta.port}</span>}
                            </span>
                            {isSelected && <Check className="size-4 text-[#ff5a14]" aria-hidden="true" />}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function driverMeta(name: string) {
    const normalized = name.toLowerCase();

    if (normalized === 'mysql') {
        return { label: 'MySQL', port: '3306', Icon: Database };
    }

    if (normalized === 'postgres' || normalized === 'postgresql') {
        return { label: 'PostgreSQL', port: '5432', Icon: Database };
    }

    if (normalized === 'sqlite') {
        return { label: 'SQLite', port: '', Icon: SquareStack };
    }

    if (normalized === 'mongodb' || normalized === 'mongo') {
        return { label: 'MongoDB', port: '27017', Icon: Server };
    }

    if (normalized === 'redis') {
        return { label: 'Redis', port: '6379', Icon: Zap };
    }

    if (normalized === 'sqlserver') {
        return { label: 'SQL Server', port: '1433', Icon: Database };
    }

    return {
        label: name,
        port: '',
        Icon: Circle,
    };
}
