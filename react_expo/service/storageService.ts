import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";

export const getToken = async () => getStorageState('jwt_token');
export const getRefreshToken = async () => getStorageState('refresh_token');
export const setToken = async (token: string | null) => setStorageItemAsync('jwt_token', token);
export const setRefreshToken = async (refreshToken: string | null) => setStorageItemAsync('refresh_token', refreshToken);

export const setStorageItemAsync = async (key: string, value: string | null) => {
    if (Platform.OS === 'web') {
        try {
            // Check if localStorage is available
            if (typeof localStorage !== 'undefined') {
                if (value === null) {
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, value);
                }
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        // SecureStore for mobile platforms (iOS/Android)
        if (value == null) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    }
}

export const getStorageState = async (key: string): Promise<string | null | undefined> =>
{
    if (Platform.OS === 'web') {
        try {
            // Check for availability of localStorage
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(key);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    } else {
        return await SecureStore.getItemAsync(key);
    }
}