import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {useRouter} from "next/router";
import {fetchRefreshToken} from "../request/auth";

type ProfileContext = {
    user?: Profile | null;
    login: (tokenResponse:TokenResponse) => void
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
    const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';

    useEffect(() => {
        const token = Cookies.get('jwt_token');

        if (token) {
            fetch('/api/profile', {
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
            router.push('/signIn');
        }
    }, []);

    const login = (tokenResponse: TokenResponse) => {
        Cookies.set('jwt_token', tokenResponse.token, {expires: 1 / 24, path: '', secure: isProduction, sameSite: 'Strict'});
        Cookies.set('refresh_token', tokenResponse.refresh_token, {expires: 7, path: '', secure: isProduction, sameSite: 'Strict'});
        fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenResponse.token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
                setError(null);
                router.back();
            })
            .catch(() => {
                setError('Erreur lors de la récupération du profil après la connexion');
            });
    };

    const refreshAccessToken = async () => {
        return await fetchRefreshToken()
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    Cookies.set('jwt_token', data.token, {expires: 1 / 24, path: '', secure: isProduction, sameSite: 'Strict'});
                    Cookies.set('refresh_token', data.refresh_token, {expires: 7, path: '', secure: isProduction, sameSite: 'Strict'});
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
        Cookies.remove('jwt_token');
        Cookies.remove('refresh_token');
        localStorage.clear();
        setUser(null);
        setError(null);
        router.push('/');
    };

    return (
        <UserContext.Provider value={{user, error, login, logout, refreshAccessToken}}>
            {children}
        </UserContext.Provider>
    );
};
