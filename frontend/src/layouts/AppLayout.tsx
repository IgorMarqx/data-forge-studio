import { Database, Settings, SquareTerminal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ConnectionsSummaryContext } from '../contexts/ConnectionsSummaryContext';

const navItems = [
    { to: '/Root', label: 'Conexões', Icon: Database },
    { to: '/settings', label: 'Configurações', Icon: Settings },
];

export function AppLayout() {
    const [connectionCount, setConnectionCount] = useState(0);
    const connectionsSummary = useMemo(
        () => ({ connectionCount, setConnectionCount }),
        [connectionCount],
    );

    return (
        <div className="grid h-screen grid-rows-[40px_1fr_25px] bg-[#080b10] text-zinc-100">
            <header className="grid grid-cols-[220px_1fr_220px] items-center border-b border-[#2b3140] bg-[#181e2d]">
                <div className="flex h-full items-center gap-2 px-2">
                    <div className="grid size-7 place-items-center rounded bg-[#d94a08] text-xs font-bold text-white">
                        DF
                    </div>
                    <span className="text-sm font-semibold text-white">
                        Data Forge Studio
                    </span>
                </div>

                <nav className="flex h-full items-center justify-center gap-4">
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                [
                                    'flex h-full items-center gap-2 border-b px-3 text-xs transition',
                                    isActive
                                        ? 'border-[#ff5a14] text-white'
                                        : 'border-transparent text-slate-400 hover:text-slate-100',
                                ].join(' ')
                            }
                        >
                            <Icon className="size-3.5 text-slate-300" aria-hidden="true" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex justify-end px-4 text-slate-500">
                    <SquareTerminal className="size-4" aria-hidden="true" />
                </div>
            </header>

            <ConnectionsSummaryContext.Provider value={connectionsSummary}>
                <Outlet />
            </ConnectionsSummaryContext.Provider>

            <footer className="flex items-center justify-between border-t border-[#2b3140] bg-[#181e2d] px-2 text-xs text-slate-400">
                <span>{connectionCount} conexão(ões)</span>
                <span>v1.0.0</span>
            </footer>
        </div>
    );
}
