import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '@/services/authService';
import { useAuthSession } from '@/services/authSession';

export default function LoginScreen() {
    const router = useRouter();
    const {
        isAuthenticated,
        sessionMessage,
        markAuthenticated,
        clearSessionMessage,
    } = useAuthSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, router]);

    async function handleLogin() {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            clearSessionMessage();

            await login({
                email,
                password,
            });

            markAuthenticated();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Giris yapilirken hata olustu.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.logo}>R</Text>

                <Text style={styles.title}>Giris yap</Text>

                <Text style={styles.description}>
                    Performans ekranina devam etmek icin hesabinizla giris yapin.
                </Text>

                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="E-posta adresi"
                    placeholderTextColor="#000000"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Sifre"
                    placeholderTextColor="#000000"
                    secureTextEntry
                />

                {errorMessage && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}

                {sessionMessage && !errorMessage && (
                    <Text style={styles.sessionMessageText}>{sessionMessage}</Text>
                )}

                <Pressable
                    style={[
                        styles.button,
                        isLoading && styles.disabledButton,
                    ]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={styles.buttonText}>GIRIS YAP</Text>
                    )}
                </Pressable>

                <Pressable
                    style={styles.secondaryAction}
                    onPress={() => router.push('./register')}
                    disabled={isLoading}
                >
                    <Text style={styles.secondaryActionText}>
                        Hesabiniz yok mu? Kayit olun
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const GREEN = '#2fb36d';

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 72,
        backgroundColor: '#ffffff',
    },
    logo: {
        alignSelf: 'center',
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: GREEN,
        color: '#ffffff',
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 52,
        marginBottom: 28,
        textAlign: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 10,
    },
    description: {
        fontSize: 13,
        lineHeight: 19,
        color: '#6b7280',
        marginBottom: 22,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 15,
        color: '#202124',
        marginBottom: 12,
    },
    errorText: {
        color: '#d93025',
        fontSize: 13,
        marginBottom: 12,
    },
    sessionMessageText: {
        color: '#b45309',
        fontSize: 13,
        marginBottom: 12,
    },
    button: {
        height: 52,
        backgroundColor: GREEN,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    secondaryAction: {
        alignItems: 'center',
        marginTop: 18,
        paddingVertical: 10,
    },
    secondaryActionText: {
        color: GREEN,
        fontSize: 14,
        fontWeight: '600',
    },
});
