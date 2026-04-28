import { Eye, EyeOff, Plug, Zap } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Toast, type ToastVariant } from '../Toast';
import type { BackendDriver } from '../../services/driversService';
import { SaveConnectionSection } from './SaveConnectionSection';
import { useCreateConnection } from '../../hooks/Connections/useCreateConnection';
import { updateConnection, type BackendConnection } from '../../services/connectionsService';
import {
    createInitialForm,
    createUpdateInput,
    defaultPorts,
    formatDriverName,
    type FormState,
    savingLabel,
} from './ConnectionForm.utils';

type ConnectionFormProps = {
    driver: BackendDriver;
    connection?: BackendConnection | null;
    onSaved?: (connection: BackendConnection) => void;
};

export function ConnectionForm({ driver, connection = null, onSaved }: ConnectionFormProps) {
    const [form, setForm] = useState<FormState>(() => createInitialForm(driver.name, connection));
    const [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [updatingConnection, setUpdatingConnection] = useState(false);
    const { create, loading: creatingConnection } = useCreateConnection();
    const isSQLite = driver.name === 'sqlite';
    const isEditingConnection = Boolean(connection);

    useEffect(() => {
        setForm(createInitialForm(driver.name, connection));
        setToast(null);
    }, [connection, driver.name]);

    const requiredMessage = useMemo(() => {
        if (!form.name.trim()) {
            return 'Informe um nome para a conexão.';
        }

        if (!form.database.trim()) {
            return isSQLite ? 'Informe o caminho do arquivo SQLite.' : 'Informe o banco de dados.';
        }

        if (!isSQLite && !form.host.trim()) {
            return 'Informe o host.';
        }

        return '';
    }, [form, isSQLite]);

    function updateField<T extends keyof FormState>(field: T, value: FormState[T]) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        connectToDatabase();
    }

    async function saveForm() {
        if (requiredMessage) {
            setToast({ message: requiredMessage, variant: 'warning' });
            return;
        }

        if (connection) {
            const input = createUpdateInput(connection, form);

            if (Object.keys(input).length === 1) {
                setToast({ message: 'Nenhuma alteração para salvar.', variant: 'info' });
                return;
            }

            try {
                setUpdatingConnection(true);
                const updatedConnection = await updateConnection(input);
                setToast({ message: 'Conexão atualizada com sucesso.', variant: 'success' });
                onSaved?.(updatedConnection);
            } catch (err) {
                setToast({
                    message: err instanceof Error ? err.message : 'Erro desconhecido ao atualizar conexão.',
                    variant: 'danger',
                });
            } finally {
                setUpdatingConnection(false);
            }

            return;
        }

        try {
            const createdConnection = await create({
                name: form.name,
                driver: driver.name,
                host: form.host,
                port: form.port,
                database: form.database,
                username: form.username,
                password: form.savePassword ? form.password : '',
                ssl: form.ssl,
                colorHex: form.color,
            });

            setToast({ message: 'Conexão criada com sucesso.', variant: 'success' });
            setForm(createInitialForm(driver.name));
            onSaved?.(createdConnection);
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : 'Erro desconhecido ao criar conexão.',
                variant: 'danger',
            });
        }
    }

    function handleTestConnection() {
        connectToDatabase();
    }

    function connectToDatabase() {
        if (requiredMessage) {
            setToast({ message: requiredMessage, variant: 'warning' });
            return;
        }

        setToast({ message: 'Conexão com o banco será integrada ao backend.', variant: 'info' });
    }

    return (
        <form onSubmit={handleSubmit}>
            {toast && (
                <Toast
                    message={toast.message}
                    onClose={() => setToast(null)}
                    variant={toast.variant}
                />
            )}

            <div className="pt-6">
                <p className="text-xs uppercase tracking-wide text-[#ff5a14]">
                    {isEditingConnection ? 'Conexão selecionada' : 'Nova conexão'}
                </p>
                <h2 className="mt-3 text-lg font-semibold text-white">{formatDriverName(driver.name)}</h2>
            </div>

            <div className="mt-8 grid gap-x-4 gap-y-7 md:grid-cols-2">
                <label className="md:col-span-2">
                    <span className="mb-1.5 block text-xs text-slate-300">Nome da Conexão</span>
                    <input
                        className="h-10 w-full rounded border border-[#30384b] bg-[#1a2030] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#d9480b]"
                        onChange={(event) => updateField('name', event.target.value)}
                        placeholder={`Ex: ${driver.name}_local`}
                        value={form.name}
                    />
                </label>

                <label className={isSQLite ? 'md:col-span-2' : ''}>
                    <span className="mb-1.5 block text-xs text-slate-300">
                        {isSQLite ? 'Arquivo' : 'Database'}
                    </span>
                    <input
                        className="h-10 w-full rounded border border-[#30384b] bg-[#1a2030] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#d9480b]"
                        onChange={(event) => updateField('database', event.target.value)}
                        placeholder={isSQLite ? '/tmp/app.db' : 'app_dev'}
                        value={form.database}
                    />
                </label>

                {!isSQLite && (
                    <>
                        <label>
                            <span className="mb-1.5 block text-xs text-slate-300">Host</span>
                            <input
                                className="h-10 w-full rounded border border-[#30384b] bg-[#1a2030] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#d9480b]"
                                onChange={(event) => updateField('host', event.target.value)}
                                placeholder="localhost"
                                value={form.host}
                            />
                        </label>

                        <label>
                            <span className="mb-1.5 block text-xs text-slate-300">Porta</span>
                            <input
                                className="h-10 w-full rounded border border-[#30384b] bg-[#1a2030] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#d9480b]"
                                onChange={(event) => updateField('port', event.target.value)}
                                placeholder={defaultPorts[driver.name]}
                                value={form.port}
                            />
                        </label>

                        <label>
                            <span className="mb-1.5 block text-xs text-slate-300">Usuário</span>
                            <input
                                className="h-10 w-full rounded border border-[#30384b] bg-[#1a2030] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#d9480b]"
                                onChange={(event) => updateField('username', event.target.value)}
                                placeholder="root"
                                value={form.username}
                            />
                        </label>

                        <label className="md:col-span-2">
                            <span className="mb-1.5 block text-xs text-slate-300">Senha</span>
                            <span className="relative block">
                                <input
                                    className="h-10 w-full rounded border border-[#30384b] bg-[#1a2030] px-3 pr-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#d9480b]"
                                    onChange={(event) => updateField('password', event.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                />
                                <button
                                    aria-label={showPassword ? 'Ocultar senha' : 'Visualizar senha'}
                                    className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-slate-400 transition hover:bg-[#293247] hover:text-white cursor-pointer"
                                    onClick={() => setShowPassword((current) => !current)}
                                    type="button"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" aria-hidden="true" />
                                    ) : (
                                        <Eye className="size-4" aria-hidden="true" />
                                    )}
                                </button>
                            </span>
                        </label>

                        <label className="flex items-center gap-2 md:col-span-2">
                            <input
                                checked={form.ssl}
                                className="size-4 accent-[#d9480b]"
                                onChange={(event) => updateField('ssl', event.target.checked)}
                                type="checkbox"
                            />
                            <span className="text-sm font-semibold text-white">Usar SSL</span>
                        </label>
                    </>
                )}
            </div>

            <SaveConnectionSection
                color={form.color}
                connectionName={form.name}
                database={form.database}
                driverName={driver.name}
                host={form.host}
                isSQLite={isSQLite}
                onChangeColor={(color) => updateField('color', color)}
                onChangeSavePassword={(savePassword) => updateField('savePassword', savePassword)}
                onSave={() => void saveForm()}
                port={form.port}
                savePassword={form.savePassword}
            />

            <div className="mt-6 border-t border-[#30384b] pt-6">
                <div className="flex justify-end gap-3">
                    <button
                        className="flex h-10 items-center gap-2 rounded border border-[#30384b] px-5 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white cursor-pointer"
                        onClick={handleTestConnection}
                        type="button"
                    >
                        <Zap className="size-4" aria-hidden="true" />
                        Testar Conexão
                    </button>
                    <button
                        className="flex h-10 items-center gap-2 rounded bg-[#d9480b] px-5 text-sm font-semibold text-white transition hover:bg-[#f05a14] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        disabled={Boolean(requiredMessage) || creatingConnection || updatingConnection}
                        type="submit"
                    >
                        <Plug className="size-4" aria-hidden="true" />
                        {savingLabel(creatingConnection, updatingConnection, isEditingConnection)}
                    </button>
                </div>
            </div>
        </form>
    );
}
