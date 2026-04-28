import {Link, useParams} from 'react-router-dom';

export function Workspace() {
    const {connectionId} = useParams();

    return (
        <main className="grid min-h-0 grid-cols-[280px_1fr]">
            <aside className="border-r border-zinc-800 bg-zinc-950 p-4">
                <Link className="text-sm text-cyan-300 hover:text-cyan-200" to="/connections">
                    Voltar para conexões
                </Link>

                <div className="mt-6">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Conexão ativa</p>
                    <h1 className="mt-1 text-lg font-semibold text-zinc-100">{connectionId}</h1>
                </div>
            </aside>

            <section className="min-w-0 bg-zinc-900 p-6">
                <div className="rounded border border-zinc-800 bg-zinc-950 p-5">
                    <h2 className="text-base font-semibold text-zinc-100">Workspace SQL</h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        Esta área fica preparada para editor SQL, schemas, tabelas e resultados.
                    </p>
                </div>
            </section>
        </main>
    );
}
