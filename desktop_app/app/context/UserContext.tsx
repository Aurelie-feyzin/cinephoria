'use client'
import React, {createContext, useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {getToken, removeToken, saveToken} from "@/app/service/tokenService";

type Profile = {
    firstName: string;
    lastName: string;
    email: string;
    role?:string;
}

type ProfileContext = {
    user?: Profile | null;
    login: (token:string) => void
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
        const getProfile = async () => {
            try {
                const token = await getToken();

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
            }
            catch (error: any) {
                setError(error.message);
            }
        }

        getProfile().then();

    }, [router]);

    const login = (token: string) => {
        setError(null);
        saveToken(token).then();
        fetch(`${process.env.NEXT_PUBLIC_API_PATH}profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
                if (data.role === null) {
                    throw new Error('Vous n\'avez pas les droits pour utiliser l\'application', { cause: 'unauthorized' });
                }
                router.push('/installations');
            })
            .catch((error) => {
                setError(error.cause === 'unauthorized' ? error.message : 'Erreur lors de la récupération du profil après la connexion');
            });
    };

    const logout = () => {
        removeToken().then();
        setUser(null);
        router.push('/');
    };

    return (
        <UserContext.Provider value={{user, error, login, logout}}>
            {children}
        </UserContext.Provider>
    );
};
