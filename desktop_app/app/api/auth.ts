import {getItem, KEY_REFRESH_TOKEN, KEY_TOKEN_JTW} from "@/app/service/storageService";

type LoginInput = {
    username: string;
    password: string;
}

export const fetchGetToken = async (data: LoginInput) =>
{
 return   await fetch(`${process.env.NEXT_PUBLIC_API_PATH}auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(data)
    })};

export const fetchRefreshToken = async () =>
{
    const refreshToken = await getItem(KEY_REFRESH_TOKEN);
    return   await fetch(`${process.env.NEXT_PUBLIC_API_PATH}token/refresh`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
    })};

export const fetchWithAuth = async (  url: string,
                                      options: RequestInit = {},
                                      refreshAccessToken: () => Promise<string | null>
): Promise<Response> => {
    const token = await getItem(KEY_TOKEN_JTW);
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken)  {
            return response;
        }

        const token = await getItem(KEY_TOKEN_JTW);
        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return response;
};