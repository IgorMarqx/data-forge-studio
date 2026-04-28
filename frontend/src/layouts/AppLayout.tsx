import {NavLink, Outlet} from 'react-router-dom';

const navItems = [
    {to: '/Root', label: 'Conexões'},
    {to: '/settings', label: 'Configurações'},
];

export function AppLayout() {
    return (
        <div className="grid h-screen grid-rows-[48px_1fr] bg-zinc-950 text-zinc-100">
            <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
                <div className="flex items-center gap-3">
                    <div className="grid size-7 place-items-center rounded bg-cyan-500 text-sm font-bold text-zinc-950">
                        DF
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-zinc-100">
                        Data Forge Studio
                    </span>
                </div>

                <nav className="flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({isActive}) =>
                                [
                                    'rounded px-3 py-1.5 text-sm transition',
                                    isActive
                                        ? 'bg-zinc-800 text-zinc-50'
                                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
                                ].join(' ')
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </header>

            <Outlet/>
        </div>
    );
}
