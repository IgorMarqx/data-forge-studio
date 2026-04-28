import { createContext, useContext } from 'react';

type ConnectionsSummaryContextValue = {
    connectionCount: number;
    setConnectionCount: (connectionCount: number) => void;
};

export const ConnectionsSummaryContext = createContext<ConnectionsSummaryContextValue | null>(null);

export function useConnectionsSummary() {
    const context = useContext(ConnectionsSummaryContext);

    if (!context) {
        throw new Error('useConnectionsSummary must be used inside ConnectionsSummaryContext.Provider');
    }

    return context;
}
