import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import {
    getAccessToken,
    getAccessTokenExpiresAt,
    removeAccessToken,
} from '@/services/tokenStorage';

const SESSION_EXPIRED_MESSAGE = 'Giriş süreniz doldu. Lütfen tekrar giriş yapınız.';

type AuthSessionContextValue = {
    isCheckingAuth: boolean;
    isAuthenticated: boolean;
    sessionMessage: string | null;
    markAuthenticated: () => void;
    refreshSession: () => Promise<void>;
    clearSessionMessage: () => void;
    signOut: (message?: string) => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionMessage, setSessionMessage] = useState<string | null>(null);

    const refreshSession = useCallback(async () => {
        const token = await getAccessToken();
        const expiresAt = await getAccessTokenExpiresAt();
        const isExpired = !expiresAt || new Date(expiresAt).getTime() <= Date.now();

        if (!token || isExpired) {
            await removeAccessToken();
            setIsAuthenticated(false);
            return;
        }

        setIsAuthenticated(true);
    }, []);

    const markAuthenticated = useCallback(() => {
        setSessionMessage(null);
        setIsAuthenticated(true);
    }, []);

    const clearSessionMessage = useCallback(() => {
        setSessionMessage(null);
    }, []);

    const signOut = useCallback(async (message?: string) => {
        await removeAccessToken();
        setSessionMessage(message ?? null);
        setIsAuthenticated(false);
    }, []);

    useEffect(() => {
        let isActive = true;

        async function loadSession() {
            try {
                const token = await getAccessToken();
                const expiresAt = await getAccessTokenExpiresAt();
                const isExpired = !expiresAt || new Date(expiresAt).getTime() <= Date.now();

                if (!isActive) return;

                if (!token || isExpired) {
                    await removeAccessToken();
                    if (isActive) {
                        setIsAuthenticated(false);
                    }
                    return;
                }

                setIsAuthenticated(true);
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

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        let isActive = true;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        async function scheduleExpiration() {
            const expiresAt = await getAccessTokenExpiresAt();
            if (!isActive) return;

            const expirationTime = expiresAt ? new Date(expiresAt).getTime() : Number.NaN;
            const remainingMilliseconds = expirationTime - Date.now();

            if (!Number.isFinite(remainingMilliseconds) || remainingMilliseconds <= 0) {
                await signOut(SESSION_EXPIRED_MESSAGE);
                return;
            }

            timeoutId = setTimeout(() => {
                void signOut(SESSION_EXPIRED_MESSAGE);
            }, remainingMilliseconds);
        }

        void scheduleExpiration();

        const appStateSubscription = AppState.addEventListener('change', nextState => {
            if (nextState === 'active') {
                if (timeoutId) clearTimeout(timeoutId);
                void scheduleExpiration();
            }
        });

        return () => {
            isActive = false;
            if (timeoutId) clearTimeout(timeoutId);
            appStateSubscription.remove();
        };
    }, [isAuthenticated, signOut]);

    const value = useMemo(
        () => ({
            isCheckingAuth,
            isAuthenticated,
            sessionMessage,
            markAuthenticated,
            refreshSession,
            clearSessionMessage,
            signOut,
        }),
        [
            isCheckingAuth,
            isAuthenticated,
            sessionMessage,
            markAuthenticated,
            refreshSession,
            clearSessionMessage,
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
