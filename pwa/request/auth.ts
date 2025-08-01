import {API_PATH} from "./utils";
import {LoginInput} from "../model/User";
import Cookies from "js-cookie";
export const fetchGetToken = async (data: LoginInput): Promise<Response> =>
{
 return   await fetch(`${API_PATH}auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(data)
    })};


export const fetchRefreshToken = async () =>
{
    return   await fetch(`${API_PATH}token/refresh`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${Cookies.get('refresh_token')}`,
        },
    })};


export const fetchWithAuth = async (  url: string,
                                      options: RequestInit = {},
                                      refreshAccessToken: () => Promise<string | null>
): Promise<Response> => {
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${Cookies.get('jwt_token')}`,
        },
    });

    if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken)  {
            return response;
        }

        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${Cookies.get('jwt_token')}`,
            },
        });
    }

    return response;
};