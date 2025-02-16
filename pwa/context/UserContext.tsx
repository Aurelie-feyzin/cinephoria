import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {useRouter} from "next/router";

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
        }
    }, []);

    const login = (token: string) => {
        Cookies.set('jwt_token', token, {expires: 1 / 24, path: '', secure: true, sameSite: 'Strict'});
        fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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

    const logout = () => {
        Cookies.remove('jwt_token');
        localStorage.clear();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{user, error, login, logout}}>
            {children}
        </UserContext.Provider>
    );
};
