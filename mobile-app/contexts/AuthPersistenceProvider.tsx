import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
} from "react";


interface AuthPersistenceI {
    isAuthenticated: boolean;
    token: string | null;
    setToken: (token: string) => Promise<void>;
    clearToken: () => Promise<void>;
}

const AuthPersistenceContext = createContext<AuthPersistenceI>(
    undefined as any
);


export function useAuthPersistence(): AuthPersistenceI {
    return useContext(AuthPersistenceContext);
}

interface AuthPersistenceProviderI {
    api: {
        get: () => Promise<string | null>;
        set: (token: string) => Promise<void>;
    };
}

export function AuthPersistenceProvider(
    props:  PropsWithChildren<AuthPersistenceProviderI>
): JSX.Element | null {
    const { api } = props;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        api
            .get()
            .then((token: string | null) => {
                if (token !== null) {
                    setIsAuthenticated(true)
                    setToken(token)
                } else {
                    throw new Error()
                }

            })
            .catch(() => {
                setToken(null)
                setIsAuthenticated(false)
            })
    }, []);

    const management: AuthPersistenceI = {
        isAuthenticated,
        token,
        async setToken(token: string): Promise<void> {
            await api.set(token);
            setToken(await api.get());
            setIsAuthenticated(true)
        },
        async clearToken(): Promise<void> {
            await api.set('');
            setToken(await api.get());
        },
    };

    return (
        <AuthPersistenceContext.Provider value={management}>
            {props.children}
        </AuthPersistenceContext.Provider>
    );
}
