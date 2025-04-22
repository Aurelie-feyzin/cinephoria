import {API_PATH} from "./utils";
import {LoginInput} from "@/app/sign-in";
import {
    getRefreshToken,
    getToken,
    setRefreshToken,
    setToken
} from "@/service/storageService";

export const fetchGetToken = async (data: LoginInput) =>
{
    return   await fetch(`${API_PATH}auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(data)
    })
};

export const fetchRefreshToken = async () =>
{
    const refreshToken = await getRefreshToken();
    return   await fetch(`${API_PATH}token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify({refresh_token: refreshToken})
    })
};


export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let token = await getToken();
    const response = await fetch(`${API_PATH}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status !== 401) {
        return response;
    }

    // If 401 → try refresh
    const refreshResponse = await fetchRefreshToken();

    if (!refreshResponse.ok) {
        await setToken(null);
        await setRefreshToken(null);
        throw new Error('Session expired. Please login again.');
    }

    const data = await refreshResponse.json();
    const newToken = data.token;
    await setToken(newToken);
    await setRefreshToken( data.refresh_token);

    // Retry original request with new token
    return fetch(`${API_PATH}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
            'Content-Type': 'application/json',
        },
    });
};