import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import PerformanceCard from '@/components/performance/PerformanceCard';
import { getCategories, isAuthRequiredError } from '@/services/categoryService';
import { useAuthSession } from '@/services/authSession';
import { getAccessTokenExpiresAt } from '@/services/tokenStorage';
import { Category, Performance } from '@/types/category';

export default function IndexScreen() {
    const router = useRouter();
    const { signOut } = useAuthSession();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasHandledSessionExpiredRef = useRef(false);

    const handleSessionExpired = useCallback(() => {
        if (hasHandledSessionExpiredRef.current) {
            return;
        }

        hasHandledSessionExpiredRef.current = true;

        void signOut(
            'Giriş süreniz doldu. Lütfen tekrar giriş yapınız.',
        );
    }, [signOut]);

    useEffect(() => {
        let isActive = true;

        async function loadCategories() {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getCategories();

                if (!isActive) return;

                setCategories(data);
            } catch (err) {
                if (!isActive) return;

                if (isAuthRequiredError(err)) {
                    handleSessionExpired();
                    return;
                }

                console.error(err);
                setError('Performans verileri alınamadı.');
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        loadCategories();

        return () => {
            isActive = false;
        };
    }, [handleSessionExpired]);

    useEffect(() => {
        let isActive = true;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        async function scheduleSessionExpirationAlert() {
            const expiresAt = await getAccessTokenExpiresAt();

            if (!isActive || !expiresAt) {
                return;
            }

            const remainingMilliseconds = new Date(expiresAt).getTime() - Date.now();

            if (remainingMilliseconds <= 0) {
                handleSessionExpired();
                return;
            }

            timeoutId = setTimeout(handleSessionExpired, remainingMilliseconds);
        }

        scheduleSessionExpirationAlert();

        return () => {
            isActive = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [handleSessionExpired]);

    const performances = useMemo<Performance[]>(() => {
        return categories.flatMap(category => category.performances ?? []);
    }, [categories]);

    async function handleSignOut() {
        try {
            setIsSigningOut(true);
            await signOut();
        } finally {
            setIsSigningOut(false);
        }
    }

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Veriler yükleniyor...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Performanslar</Text>

                <Pressable
                    style={[
                        styles.signOutButton,
                        isSigningOut && styles.disabledButton,
                    ]}
                    onPress={handleSignOut}
                    disabled={isSigningOut}
                >
                    <Text style={styles.signOutButtonText}>
                        {isSigningOut ? 'Çıkılıyor...' : 'Çıkış Yap'}
                    </Text>
                </Pressable>
            </View>

            <FlatList
                data={performances}
                keyExtractor={(item, index) => `${item.uniqueCode}-${index}`}
                renderItem={({ item }) => (
                    <PerformanceCard performance={item} />
                )}
                ListEmptyComponent={
                    <Text>Gösterilecek performans bulunamadı.</Text>
                }
                ListFooterComponent={
                    <Pressable
                        style={styles.chartButton}
                        onPress={() => router.push('./charts')}
                    >
                        <Text style={styles.chartButtonText}>Charts sayfasına git</Text>
                    </Pressable>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 16,
        paddingTop: 48,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
    },
    title: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#16a34a',
    },
    signOutButton: {
        minHeight: 32,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#dc2626',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    signOutButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    chartButton: {
        minHeight: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#16a34a',
        marginTop: 10,
    },
    chartButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
});
