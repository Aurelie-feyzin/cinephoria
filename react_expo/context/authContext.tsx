import {useContext, createContext, type PropsWithChildren, useState} from 'react';
import {setStorageItemAsync} from "@/state/useStorageState";
import {API_PATH} from "@/api/utils";

interface Profile  {
    firstName: string;
    lastName: string;
    email: string;
}

const AuthContext = createContext<{
    signIn: (token: string) => void;
    signOut: () => void;
    user: Profile | null;
    isLoading: boolean;
    error: string | null,
}>({
    signIn: () => null,
    signOut: () => null,
    user: null,
    isLoading: false,
    error: null,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<Profile | null>(null);
    const [error, setError] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <AuthContext.Provider
            value={{
                signIn: (token: string) => {
                    setIsLoading(true);
                    setStorageItemAsync('jwt_token', token).then();

                    fetch(`${API_PATH}profile`, {
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
                            setIsLoading(false);
                        })
                        .catch((err) => {
                            setUser(null);
                            setError(err.message);
                            setIsLoading(false);
                        });
                },
                signOut: () => {
                    setStorageItemAsync('jwt_token', null).then();
                },
                user,
                isLoading,
                error
            }}>
            {children}
        </AuthContext.Provider>
    );
}
