'use client'
import React, {createContext, useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {getItem, KEY_REFRESH_TOKEN, KEY_TOKEN_JTW, removeItem, saveItem} from "@/app/service/storageService";
import {fetchRefreshToken} from "@/app/api/auth";

type Profile = {
    firstName: string;
    lastName: string;
    email: string;
    role?:string;
}

interface TokenResponse {
    token: string,
    refresh_token: string
}

type ProfileContext = {
    user?: Profile | null;
    login: (tokenResponse: TokenResponse) => void
    refreshAccessToken: () => Promise<string | null>
    logout: () => void;
    error?: string | null;
}

const UserContext = createContext<ProfileContext>({} as ProfileContext);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<Profile | null>(null);
    const [error, setError] = useState<string|null>(null);
    const router = useRouter();


    useEffect(() => {
        const token = getItem(KEY_TOKEN_JTW);

        if (token) {
            fetch(`${process.env.NEXT_PUBLIC_API_PATH}profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Impossible de récupérer le profil de l\'utilisateur');
                    }
                    return response.json();
                })
                .then((data) => {
                    setUser(data);
                    setError(null);
                    router.back();
                })
                .catch((err) => {
                    setError(err.message);
                });
        } else {
            setUser(null);
            router.push('/');
        }
    }, [router]);

    const login = (tokenResponse: TokenResponse) => {
        saveItem(KEY_TOKEN_JTW, tokenResponse.token);
        saveItem(KEY_REFRESH_TOKEN, tokenResponse.refresh_token);
        fetch(`${process.env.NEXT_PUBLIC_API_PATH}profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenResponse.token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
                setError(null);
                if (data.role === null) {
                    throw new Error('Vous n\'avez pas les droits pour utiliser l\'application', { cause: 'unauthorized' });
                }
                router.push('/installations');
            })
            .catch((error) => {
                setError(error.cause === 'unauthorized' ? error.message : 'Erreur lors de la récupération du profil après la connexion');
            });
    };

    const refreshAccessToken = async () => {
        console.log('refreshAccessToken');
        return await fetchRefreshToken()
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.token) {
                    saveItem(KEY_TOKEN_JTW, data.token);
                    saveItem(KEY_REFRESH_TOKEN, data.refresh_token);
                    setError(null);
                    return data.token as string;
                }

                return null;
            })
            .catch(() => {
                logout();
                return null;
            });
    };

    const logout = () => {
        removeItem(KEY_TOKEN_JTW);
        removeItem(KEY_REFRESH_TOKEN);
        setUser(null);
        router.push('/');
    };

    return (
        <UserContext.Provider value={{user, error, refreshAccessToken, login, logout}}>
            {children}
        </UserContext.Provider>
    );
};
