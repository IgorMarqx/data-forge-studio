import {AlertTriangle, CheckCircle2, Info, X, XCircle} from 'lucide-react';
import {useEffect} from 'react';

export type ToastVariant = 'info' | 'warning' | 'danger' | 'success';

type ToastProps = {
    message: string;
    variant: ToastVariant;
    duration?: number;
    onClose: () => void;
};

const variantStyles = {
    info: {
        container: 'border-sky-800/70 bg-sky-950/50 text-sky-100',
        icon: 'text-sky-300',
        progress: 'bg-sky-300',
        Icon: Info,
    },
    warning: {
        container: 'border-amber-800/70 bg-amber-950/50 text-amber-100',
        icon: 'text-amber-300',
        progress: 'bg-amber-300',
        Icon: AlertTriangle,
    },
    danger: {
        container: 'border-red-800/70 bg-red-950/50 text-red-100',
        icon: 'text-red-300',
        progress: 'bg-red-300',
        Icon: XCircle,
    },
    success: {
        container: 'border-emerald-800/70 bg-emerald-950/50 text-emerald-100',
        icon: 'text-emerald-300',
        progress: 'bg-emerald-300',
        Icon: CheckCircle2,
    },
};

export function Toast({message, variant, duration = 4000, onClose}: ToastProps) {
    const styles = variantStyles[variant];
    const Icon = styles.Icon;

    useEffect(() => {
        const timeoutId = window.setTimeout(onClose, duration);

        return () => window.clearTimeout(timeoutId);
    }, [duration, onClose]);

    return (
        <div
            className={[
                'fixed right-5 top-14 z-50 min-w-80 max-w-md overflow-hidden rounded border shadow-xl shadow-black/30',
                styles.container,
            ].join(' ')}
            role="status"
        >
            <div className="flex items-start gap-3 px-4 py-3 pr-10">
                <Icon className={['mt-0.5 size-4 shrink-0', styles.icon].join(' ')} aria-hidden="true" />
                <p className="text-sm leading-5">{message}</p>
            </div>

            <button
                aria-label="Fechar notificação"
                className="absolute right-2 top-2 rounded p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
                onClick={onClose}
                type="button"
            >
                <X className="size-4" aria-hidden="true" />
            </button>

            <div className="h-1 bg-black/20">
                <div
                    className={['h-full origin-left animate-toast-progress', styles.progress].join(' ')}
                    style={{animationDuration: `${duration}ms`}}
                />
            </div>
        </div>
    );
}
