import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {useRouter} from "next/router";
import {Profile} from "../model/User";
import {getProfile} from "../request/user";
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
                getProfile()
                .then((data) => {
                    setUser(data);
                    setError(null);
                })
                .catch((err) => {
                    setError(err.message);
                });
        } else {
            setUser(null);
        }
    }, []);

    const login = (tokenResponse: TokenResponse) => {
        const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
        Cookies.set('jwt_token', tokenResponse.token, {expires: 1 / 24, path: '', secure: isProduction, sameSite: 'Strict'});
        Cookies.set('refresh_token', tokenResponse.refresh_token, {expires: 24, path: '', secure: isProduction, sameSite: 'Strict'});
        getProfile()
            .then((data) => {
                setUser(data);
                setError(null);
                const from = router.query.from;

                if (from === 'forgot-password') {
                    router.push('/');
                } else {
                    router.back();
                }
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
