import {Database} from 'lucide-react';

type SaveConnectionSectionProps = {
    color: string;
    connectionName: string;
    database: string;
    driverName: string;
    host: string;
    isSQLite: boolean;
    onChangeColor: (color: string) => void;
    onChangeSavePassword: (savePassword: boolean) => void;
    onSave: () => void;
    port: string;
    savePassword: boolean;
};

const connectionColors = [
    '#7b8494',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
];

const defaultPorts: Record<string, string> = {
    postgres: '5432',
    mysql: '3306',
    sqlserver: '1433',
    sqlite: '',
};

export function SaveConnectionSection({
    color,
    connectionName,
    database,
    driverName,
    host,
    isSQLite,
    onChangeColor,
    onChangeSavePassword,
    onSave,
    port,
    savePassword,
}: SaveConnectionSectionProps) {
    return (
        <section className="mt-7 rounded border border-[#30384b] bg-[#0d121b] p-4">
            <h3 className="text-sm font-semibold text-white">Salvar Conexão</h3>

            <div className="mt-6 flex items-end justify-between gap-6">
                <div>
                    <p className="mb-2 text-xs text-slate-300">Cor</p>
                    <div className="flex flex-wrap gap-2">
                        {connectionColors.map((optionColor) => {
                            const isSelected = color === optionColor;

                            return (
                                <button
                                    aria-label={`Selecionar cor ${optionColor}`}
                                    className={[
                                        'size-6 rounded-full border transition',
                                        isSelected
                                            ? 'border-white ring-2 ring-[#d9480b] ring-offset-2 ring-offset-[#0d121b]'
                                            : 'border-transparent hover:border-slate-300',
                                    ].join(' ')}
                                    key={optionColor}
                                    onClick={() => onChangeColor(optionColor)}
                                    style={{backgroundColor: optionColor}}
                                    type="button"
                                />
                            );
                        })}
                    </div>
                </div>

                <label className="flex shrink-0 items-center gap-2 pb-0.5">
                    <input
                        checked={savePassword}
                        className="size-4 accent-[#d9480b]"
                        onChange={(event) => onChangeSavePassword(event.target.checked)}
                        type="checkbox"
                    />
                    <span className="text-sm font-semibold text-white">Salvar Senha</span>
                </label>
            </div>

            <div className="mt-5 rounded border border-[#30384b] bg-[#0b1018] p-3">
                <div className="flex items-center gap-3">
                    <span
                        className="h-10 w-1 shrink-0 rounded-full"
                        style={{backgroundColor: color}}
                        aria-hidden="true"
                    />
                    <span className="grid size-10 shrink-0 place-items-center rounded bg-[#1a2030]">
                        <Database className="size-5" style={{color}} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                            {connectionName || 'Nome da conexão'}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                            {formatDriverName(driverName)} · {isSQLite ? database || 'arquivo.db' : `${host || 'localhost'}:${port || defaultPorts[driverName] || '-'}`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex justify-end">
                <button
                    className="h-9 rounded bg-[#d9480b] px-4 text-sm font-semibold text-white transition hover:bg-[#f05a14] cursor-pointer"
                    onClick={onSave}
                    type="button"
                >
                    Salvar
                </button>
            </div>
        </section>
    );
}

function formatDriverName(name: string) {
    const normalized = name.toLowerCase();

    if (normalized === 'postgres' || normalized === 'postgresql') {
        return 'PostgreSQL';
    }

    if (normalized === 'mysql') {
        return 'MySQL';
    }

    if (normalized === 'sqlite') {
        return 'SQLite';
    }

    return name;
}
