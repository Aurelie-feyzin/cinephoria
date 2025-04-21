// tokenService.ts
import Cookies from 'js-cookie';

let store: any = null;

export const isTauri = () => '__TAURI__' in window;

async function loadStore() {
    if (isTauri() && !store) {
        const plugin = await import('@tauri-apps/plugin-store');
        store = await plugin.Store.load('.jwt-store.dat');
    }
}

export const saveToken = async (token: string) => {
    if (isTauri()) {
        await loadStore();
        await store.set('jwt_token', token);
        await store.save();
    } else {
        Cookies.set('jwt_token', token, {
            expires: 1 / 24,
            path: '',
            secure: false,
            sameSite: 'Strict',
        });
    }
};

export const getToken = async (): Promise<string | undefined> => {
    if (isTauri()) {
        await loadStore();
        return await store.get('jwt_token');
    } else {
        return Cookies.get('jwt_token');
    }
};

export const removeToken = async () => {
    if (isTauri()) {
        await loadStore();
        await store.delete('jwt_token');
        await store.save();
    } else {
        Cookies.remove('jwt_token');
    }
};
