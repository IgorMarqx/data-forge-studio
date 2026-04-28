import {FormEvent, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import type {ConnectionForm} from '../../types/ConnectionForm';
import type {Driver} from '../../types/Driver';
import {SavedConnection, saveConnection, testConnection} from '../../services/connectionsService';

const defaultPorts: Record<Driver, string> = {
    postgres: '5432',
    mysql: '3306',
    sqlite: '',
    sqlserver: '1433',
};

const driverLabels: Record<Driver, string> = {
    postgres: 'PostgreSQL',
    mysql: 'MySQL',
    sqlite: 'SQLite',
    sqlserver: 'SQL Server',
};

const initialForm: ConnectionForm = {
    name: '',
    driver: 'postgres',
    host: 'localhost',
    port: defaultPorts.postgres,
    database: '',
    username: '',
    password: '',
    ssl: false,
};

const initialConnections: SavedConnection[] = [
    {
        id: 'local-postgres',
        name: 'Postgres local',
        driver: 'postgres',
        host: 'localhost',
        port: '5432',
        database: 'app_dev',
        username: 'postgres',
        password: '',
        ssl: false,
    },
];

export function Connection() {
    const navigate = useNavigate();
    const [form, setForm] = useState<ConnectionForm>(initialForm);
    const [connections, setConnections] = useState<SavedConnection[]>(initialConnections);
    const [feedback, setFeedback] = useState<string>('');
    const [isTesting, setIsTesting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const requiredMessage = useMemo(() => {
        if (!form.name.trim()) {
            return 'Informe um nome para a conexão.';
        }

        if (!form.database.trim()) {
            return form.driver === 'sqlite'
                ? 'Informe o caminho do arquivo SQLite.'
                : 'Informe o nome do banco de dados.';
        }

        if (form.driver !== 'sqlite' && !form.host.trim()) {
            return 'Informe o host do banco.';
        }

        return '';
    }, [form]);

    function updateField<T extends keyof ConnectionForm>(field: T, value: ConnectionForm[T]) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateDriver(driver: Driver) {
        setForm((current) => ({
            ...current,
            driver,
            port: defaultPorts[driver],
            host: driver === 'sqlite' ? '' : current.host || 'localhost',
        }));
    }

    async function handleTestConnection() {
        if (requiredMessage) {
            setFeedback(requiredMessage);
            return;
        }

        setIsTesting(true);
        setFeedback('');

        try {
            const message = await testConnection(form);
            setFeedback(message);
        } finally {
            setIsTesting(false);
        }
    }

    async function handleSaveConnection(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (requiredMessage) {
            setFeedback(requiredMessage);
            return;
        }

        setIsSaving(true);
        setFeedback('');

        try {
            const connection = await saveConnection(form);
            setConnections((current) => [connection, ...current]);
            setForm(initialForm);
            setFeedback(`Conexão "${connection.name}" salva.`);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main className="grid min-h-0 grid-cols-[320px_1fr] bg-zinc-900">
            <aside className="min-h-0 border-r border-zinc-800 bg-zinc-950">
                <div className="border-b border-zinc-800 p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Banco de dados</p>
                    <h1 className="mt-1 text-lg font-semibold text-zinc-100">Conexões</h1>
                </div>

                <div className="space-y-2 overflow-y-auto p-3">
                    {connections.map((connection) => (
                        <button
                            key={connection.id}
                            className="w-full rounded border border-zinc-800 bg-zinc-900 p-3 text-left transition hover:border-cyan-700 hover:bg-zinc-800"
                            onClick={() => navigate(`/workspace/${connection.id}`)}
                            type="button"
                        >
                            <span className="block text-sm font-medium text-zinc-100">{connection.name}</span>
                            <span className="mt-1 block text-xs text-zinc-500">
                                {driverLabels[connection.driver]} · {connection.database}
                            </span>
                        </button>
                    ))}
                </div>
            </aside>

            <section className="min-h-0 overflow-y-auto p-6">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-wide text-cyan-400">Nova conexão</p>
                        <h2 className="mt-1 text-2xl font-semibold text-zinc-50">
                            Cadastre o acesso ao banco
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                            Esta tela ainda usa um service mockado no front-end. Depois, as funções de teste
                            e salvamento serão trocadas por chamadas Wails para o Go.
                        </p>
                    </div>

                    <form className="rounded border border-zinc-800 bg-zinc-950 p-5" onSubmit={handleSaveConnection}>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="md:col-span-2">
                                <span className="mb-1.5 block text-sm font-medium text-zinc-300">Nome</span>
                                <input
                                    className="h-10 w-full rounded border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500"
                                    onChange={(event) => updateField('name', event.target.value)}
                                    placeholder="Ex: Produção PostgreSQL"
                                    value={form.name}
                                />
                            </label>

                            <label>
                                <span className="mb-1.5 block text-sm font-medium text-zinc-300">Driver</span>
                                <select
                                    className="h-10 w-full rounded border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-500"
                                    onChange={(event) => updateDriver(event.target.value as Driver)}
                                    value={form.driver}
                                >
                                    {Object.entries(driverLabels).map(([driver, label]) => (
                                        <option key={driver} value={driver}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span className="mb-1.5 block text-sm font-medium text-zinc-300">
                                    {form.driver === 'sqlite' ? 'Arquivo' : 'Database'}
                                </span>
                                <input
                                    className="h-10 w-full rounded border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500"
                                    onChange={(event) => updateField('database', event.target.value)}
                                    placeholder={form.driver === 'sqlite' ? '/data/app.db' : 'app_dev'}
                                    value={form.database}
                                />
                            </label>

                            {form.driver !== 'sqlite' && (
                                <>
                                    <label>
                                        <span className="mb-1.5 block text-sm font-medium text-zinc-300">Host</span>
                                        <input
                                            className="h-10 w-full rounded border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500"
                                            onChange={(event) => updateField('host', event.target.value)}
                                            placeholder="localhost"
                                            value={form.host}
                                        />
                                    </label>

                                    <label>
                                        <span className="mb-1.5 block text-sm font-medium text-zinc-300">Porta</span>
                                        <input
                                            className="h-10 w-full rounded border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500"
                                            onChange={(event) => updateField('port', event.target.value)}
                                            placeholder={defaultPorts[form.driver]}
                                            value={form.port}
                                        />
                                    </label>

                                    <label>
                                        <span className="mb-1.5 block text-sm font-medium text-zinc-300">Usuário</span>
                                        <input
                                            className="h-10 w-full rounded border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500"
                                            onChange={(event) => updateField('username', event.target.value)}
                                            placeholder="postgres"
                                            value={form.username}
                                        />
                                    </label>

                                    <label>
                                        <span className="mb-1.5 block text-sm font-medium text-zinc-300">Senha</span>
                                        <input
                                            className="h-10 w-full rounded border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500"
                                            onChange={(event) => updateField('password', event.target.value)}
                                            placeholder="Senha do banco"
                                            type="password"
                                            value={form.password}
                                        />
                                    </label>

                                    <label className="flex items-center gap-2 md:col-span-2">
                                        <input
                                            checked={form.ssl}
                                            className="size-4 accent-cyan-500"
                                            onChange={(event) => updateField('ssl', event.target.checked)}
                                            type="checkbox"
                                        />
                                        <span className="text-sm text-zinc-300">Usar SSL</span>
                                    </label>
                                </>
                            )}
                        </div>

                        {feedback && (
                            <div className="mt-4 rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
                                {feedback}
                            </div>
                        )}

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                className="h-10 rounded border border-zinc-700 px-4 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={isTesting || isSaving}
                                onClick={handleTestConnection}
                                type="button"
                            >
                                {isTesting ? 'Testando...' : 'Testar conexão'}
                            </button>

                            <button
                                className="h-10 rounded bg-cyan-500 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={isSaving || isTesting}
                                type="submit"
                            >
                                {isSaving ? 'Salvando...' : 'Salvar conexão'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}
