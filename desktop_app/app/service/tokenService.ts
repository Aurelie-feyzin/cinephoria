// tokenService.ts
import Cookies from 'js-cookie';
import {getVersion} from "@tauri-apps/api/app";
import {LazyStore} from "@tauri-apps/plugin-store";

const store : LazyStore= new LazyStore('settings.json');
export async function isTauri() {
    if (typeof window === "undefined") {
        return false;
    }

    if (!(window as any).__TAURI_INTERNALS__) {
        return false;
    }

    try {
        await getVersion();
        return true;
    } catch {
        return false;
    }
}

export const saveToken = async (token: string) => {
    const isTauriApp = await isTauri();

    if (isTauriApp) {
        await store?.set('jwt_token', token);
        await store?.save();
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
    const isTauriApp = await isTauri();
    if (isTauriApp) {
        return store?.get('jwt_token');
    } else {
        return Cookies.get('jwt_token');
    }
};

export const removeToken = async () => {
    const isTauriApp = await isTauri();
    if (isTauriApp) {
        await store?.delete('jwt_token');
        await store?.save();
    } else {
        Cookies.remove('jwt_token');
    }
};
