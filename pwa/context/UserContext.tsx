import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {useRouter} from "next/router";
import {Profile} from "../model/User";
import {getProfile} from "../request/user";

type ProfileContext = {
    user?: Profile | null;
    login: (token:string) => void
    logout: () => void;
    error?: string | null;
}

const UserContext = createContext<ProfileContext>({} as ProfileContext);

export const useUser = () => useContext(UserContext); // Hook personnalisé pour accéder au contexte

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<Profile | null>(null);
    const [error, setError] = useState<string|null>(null);
    const router = useRouter();


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

    const login = (token: string) => {
        const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
        Cookies.set('jwt_token', token, {expires: 1 / 24, path: '', secure: isProduction, sameSite: 'Strict'});
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

    const logout = () => {
        Cookies.remove('jwt_token');
        localStorage.clear();
        setUser(null);
        router.push('/');
    };

    return (
        <UserContext.Provider value={{user, error, login, logout}}>
            {children}
        </UserContext.Provider>
    );
};
