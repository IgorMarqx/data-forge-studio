import {
    ArrowDownAZ,
    ArrowUpAZ,
    Check,
    ChevronDown,
    ChevronRight,
    Database,
    ListFilter,
    RefreshCw,
    Search,
} from 'lucide-react';
import type { SortDirection, SortField } from '../../pages/Root/Root.utils';
import { sortOptions } from '../../pages/Root/Root.utils';

type ConnectionExplorerControlsProps = {
    connectionsExpanded: boolean;
    connectionSearch: string;
    connectionCount: number;
    sortDirection: SortDirection;
    sortField: SortField;
    sortMenuOpen: boolean;
    onChangeConnectionSearch: (search: string) => void;
    onChangeSortDirection: (sortDirection: SortDirection) => void;
    onChangeSortField: (sortField: SortField) => void;
    onReloadConnections: () => void;
    onToggleConnectionsExpanded: () => void;
    onToggleSortMenu: () => void;
};

export function ConnectionExplorerControls({
    connectionsExpanded,
    connectionSearch,
    connectionCount,
    sortDirection,
    sortField,
    sortMenuOpen,
    onChangeConnectionSearch,
    onChangeSortDirection,
    onChangeSortField,
    onReloadConnections,
    onToggleConnectionsExpanded,
    onToggleSortMenu,
}: ConnectionExplorerControlsProps) {
    return (
        <>
            <div className="px-3">
                <label className="relative block">
                    <Search
                        className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-slate-500"
                        aria-hidden="true"
                    />
                    <input
                        className="h-8 w-full rounded border border-[#30384b] bg-[#0f1520] pl-7 pr-2 text-xs text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-[#d9480b]"
                        onChange={(event) => onChangeConnectionSearch(event.target.value)}
                        placeholder="Pesquisar conexão"
                        type="search"
                        value={connectionSearch}
                    />
                </label>
            </div>

            <div className="mt-4 flex items-center justify-between px-3 text-xs">
                <button
                    className="flex min-w-0 items-center gap-2 font-semibold text-white"
                    onClick={onToggleConnectionsExpanded}
                    type="button"
                >
                    {connectionsExpanded ? (
                        <ChevronDown className="size-3 shrink-0 text-slate-400 cursor-pointer" aria-hidden="true" />
                    ) : (
                        <ChevronRight className="size-3 shrink-0 text-slate-400 cursor-pointer" aria-hidden="true" />
                    )}
                    <Database className="size-3.5 text-[#ff5a14]" aria-hidden="true" />
                    <span>Conexões</span>
                </button>

                <div className="relative flex items-center gap-1">
                    <span className="mr-1 rounded bg-[#20283a] px-1.5 py-0.5 text-[10px] text-slate-300">
                        {connectionCount}
                    </span>
                    <button
                        aria-label="Recarregar conexões"
                        className="grid size-6 place-items-center rounded text-slate-400 transition hover:bg-[#1a2030] hover:text-white cursor-pointer"
                        onClick={onReloadConnections}
                        type="button"
                    >
                        <RefreshCw className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                        aria-label="Alternar ordenação ascendente e descendente"
                        className="grid size-6 place-items-center rounded text-slate-400 transition hover:bg-[#1a2030] hover:text-white cursor-pointer"
                        onClick={() => onChangeSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        type="button"
                    >
                        {sortDirection === 'asc' ? (
                            <ArrowUpAZ className="size-4" aria-hidden="true" />
                        ) : (
                            <ArrowDownAZ className="size-4" aria-hidden="true" />
                        )}
                    </button>
                    <button
                        aria-label="Escolher campo de ordenação"
                        className="grid size-6 place-items-center rounded text-slate-400 transition hover:bg-[#1a2030] hover:text-white cursor-pointer"
                        onClick={onToggleSortMenu}
                        type="button"
                    >
                        <ListFilter className="size-4" aria-hidden="true" />
                    </button>

                    {sortMenuOpen && (
                        <div className="absolute right-0 top-full z-40 mt-1 w-44 overflow-hidden rounded bg-[#242424] py-1 shadow-xl shadow-black/40">
                            {sortOptions.map((option) => (
                                <button
                                    className="flex h-8 w-full items-center gap-2 px-3 text-left text-sm text-slate-200 transition hover:bg-[#303030]"
                                    key={option.field}
                                    onClick={() => onChangeSortField(option.field)}
                                    type="button"
                                >
                                    <span className="grid size-3 place-items-center">
                                        {sortField === option.field && (
                                            <Check className="size-3.5 text-slate-200" aria-hidden="true" />
                                        )}
                                    </span>
                                    <span>{option.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
