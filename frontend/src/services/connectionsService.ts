import type {ConnectionForm} from '../types/ConnectionForm';

export type SavedConnection = ConnectionForm & {
    id: string;
};

export async function testConnection(form: ConnectionForm): Promise<string> {
    await wait(250);
    return `Conexão "${form.name}" validada no front-end.`;
}

export async function saveConnection(form: ConnectionForm): Promise<SavedConnection> {
    await wait(250);

    return {
        ...form,
        id: crypto.randomUUID(),
        password: '',
    };
}

function wait(milliseconds: number) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}
