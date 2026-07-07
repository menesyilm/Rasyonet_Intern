import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { getAccessToken, removeAccessToken } from '@/services/tokenStorage';

type AuthSessionContextValue = {
    isCheckingAuth: boolean;
    isAuthenticated: boolean;
    markAuthenticated: () => void;
    refreshSession: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refreshSession = useCallback(async () => {
        const token = await getAccessToken();
        setIsAuthenticated(Boolean(token));
    }, []);

    const markAuthenticated = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    const signOut = useCallback(async () => {
        await removeAccessToken();
        setIsAuthenticated(false);
    }, []);

    useEffect(() => {
        let isActive = true;

        async function loadSession() {
            try {
                const token = await getAccessToken();

                if (!isActive) return;

                setIsAuthenticated(Boolean(token));
            } finally {
                if (isActive) {
                    setIsCheckingAuth(false);
                }
            }
        }

        loadSession();

        return () => {
            isActive = false;
        };
    }, []);

    const value = useMemo(
        () => ({
            isCheckingAuth,
            isAuthenticated,
            markAuthenticated,
            refreshSession,
            signOut,
        }),
        [
            isCheckingAuth,
            isAuthenticated,
            markAuthenticated,
            refreshSession,
            signOut,
        ],
    );

    return (
        <AuthSessionContext.Provider value={value}>
            {children}
        </AuthSessionContext.Provider>
    );
}

export function useAuthSession() {
    const context = useContext(AuthSessionContext);

    if (!context) {
        throw new Error('useAuthSession, AuthSessionProvider içinde kullanılmalıdır.');
    }

    return context;
}
