import {GetDrivers} from '../../wailsjs/go/main/App';
import type {models} from '../../wailsjs/go/models';

export type BackendDriver = models.Driver;

export async function getDrivers(): Promise<BackendDriver[]> {
    const wailsWindow = window as typeof window & {
        go?: {
            main?: {
                App?: {
                    GetDrivers?: () => Promise<BackendDriver[]>;
                };
            };
        };
    };

    console.log('[driversService] window.go disponível:', Boolean(wailsWindow.go?.main?.App?.GetDrivers));

    if (!wailsWindow.go?.main?.App?.GetDrivers) {
        return Promise.reject(
            new Error('Backend Wails indisponível. Rode o app com "wails dev" para buscar drivers do Go.'),
        );
    }

    const response = await GetDrivers();
    console.log('[driversService] resposta GetDrivers:', response);

    return response ?? [];
}
