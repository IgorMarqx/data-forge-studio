import { useEffect, useMemo, useRef, useState } from 'react';
import type { Driver } from '../types/Driver';

type DriverOption = {
    value: Driver;
    label: string;
    description: string;
};

type DriversSelectableProps = {
    value?: Driver;
    onValueChange?: (value: Driver) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
};

const driverOptions: DriverOption[] = [
    {
        value: 'postgres',
        label: 'PostgreSQL',
        description: 'Banco relacional robusto para producao e analytics',
    },
    {
        value: 'mysql',
        label: 'MySQL',
        description: 'Banco relacional popular para aplicacoes web',
    },
    {
        value: 'sqlite',
        label: 'SQLite',
        description: 'Arquivo local leve para testes e prototipos',
    },
    {
        value: 'sqlserver',
        label: 'SQL Server',
        description: 'Banco Microsoft para ambientes corporativos',
    },
];

export function DriversSelectable({
    value,
    onValueChange,
    label = 'Driver',
    placeholder = 'Selecione um driver',
    disabled = false,
}: DriversSelectableProps) {
    const [internalValue, setInternalValue] = useState<Driver | undefined>(value);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedValue = value ?? internalValue;
    const selectedOption = driverOptions.find((option) => option.value === selectedValue);

    const filteredOptions = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return driverOptions;
        }

        return driverOptions.filter((option) =>
            `${option.label} ${option.description} ${option.value}`
                .toLowerCase()
                .includes(normalizedSearch),
        );
    }, [search]);

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        }

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, []);

    function handleSelect(optionValue: Driver) {
        setInternalValue(optionValue);
        onValueChange?.(optionValue);
        setIsOpen(false);
        setSearch('');
    }

    return (
        <div className="relative" ref={containerRef}>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</label>

            <button
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className={[
                    'flex h-10 w-full items-center justify-between rounded border px-3 text-left text-sm outline-none transition',
                    disabled
                        ? 'cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-600 focus:border-cyan-500',
                ].join(' ')}
                disabled={disabled}
                onClick={() => setIsOpen((current) => !current)}
                type="button"
            >
                <span className={selectedOption ? 'text-zinc-100' : 'text-zinc-500'}>
                    {selectedOption?.label ?? placeholder}
                </span>
                <span
                    aria-hidden="true"
                    className={[
                        'ml-3 text-xs text-zinc-500 transition-transform',
                        isOpen ? 'rotate-180' : '',
                    ].join(' ')}
                >
                    v
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded border border-zinc-700 bg-zinc-950 shadow-xl shadow-black/30">
                    <div className="border-b border-zinc-800 p-2">
                        <input
                            autoFocus
                            className="h-9 w-full rounded border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-500"
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Escape') {
                                    setIsOpen(false);
                                    setSearch('');
                                }
                            }}
                            placeholder="Pesquisar driver..."
                            value={search}
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1" role="listbox">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = option.value === selectedValue;

                                return (
                                    <button
                                        aria-selected={isSelected}
                                        className={[
                                            'flex w-full items-start gap-3 rounded px-2.5 py-2 text-left text-sm outline-none transition',
                                            isSelected
                                                ? 'bg-cyan-950/60 text-cyan-100'
                                                : 'text-zinc-200 hover:bg-zinc-900 focus:bg-zinc-900',
                                        ].join(' ')}
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        role="option"
                                        type="button"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={[
                                                'mt-1 h-2 w-2 shrink-0 rounded-full',
                                                isSelected ? 'bg-cyan-400' : 'bg-zinc-700',
                                            ].join(' ')}
                                        />
                                        <span className="min-w-0">
                                            <span className="block font-medium">{option.label}</span>
                                            <span className="mt-0.5 block text-xs text-zinc-500">
                                                {option.description}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <p className="px-3 py-4 text-sm text-zinc-500">Nenhum driver encontrado.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
