import Cookies from 'js-cookie';

let store: any = null;

export const KEY_TOKEN_JTW = 'jtw_token';
export const KEY_REFRESH_TOKEN = 'refresh_token';

export const isTauri = () => '__TAURI__' in window;

async function loadStore() {
    if (isTauri() && !store) {
        const plugin = await import('@tauri-apps/plugin-store');
        store = await plugin.Store.load('.jwt-store.dat');
    }
}

export const saveItem = async (key: string, value: string) => {
    if (isTauri()) {
        await loadStore();
        await store.set(key, value);
        await store.save();
    } else {
        Cookies.set(key, value, {
            expires: KEY_TOKEN_JTW ? 1 / 24 : 1,
            path: '',
            secure: false,
            sameSite: 'Strict',
        });
    }
};

export const getItem = async (key: string): Promise<string | undefined> => {
    if (isTauri()) {
        await loadStore();
        return await store.get(key);
    } else {
        return Cookies.get(key);
    }
};

export const removeItem = async (key: string) => {
    if (isTauri()) {
        await loadStore();
        await store.delete(key);
        await store.save();
    } else {
        Cookies.remove(key);
    }
};
