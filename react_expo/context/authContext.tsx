import {useContext, createContext, type PropsWithChildren, useState} from 'react';
import {API_PATH} from "@/api/utils";
import {setRefreshToken, setToken} from "@/service/storageService";

interface Profile  {
    firstName: string;
    lastName: string;
    email: string;
}

const AuthContext = createContext<{
    signIn: (token: string, refreshToken: string) => void;
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
                signIn: async (token: string, refreshToken: string) => {
                    setIsLoading(true);
                    await setToken(token);
                    await setRefreshToken(refreshToken);

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
                        })
                        .catch((err) => {
                            setUser(null);
                            setError(err.message);
                        })
                        .finally(() => setIsLoading(false));
                },
                signOut: () => {
                    console.log('sigout');
                    setToken(null).then();
                    setRefreshToken( null).then();
                },
                user,
                isLoading,
                error
            }}>
            {children}
        </AuthContext.Provider>
    );
}
