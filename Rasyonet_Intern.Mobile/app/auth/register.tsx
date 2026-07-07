import { useState } from 'react';
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
import { register } from '@/services/authService';

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleRegister() {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            await register({
                name,
                surname,
                email,
                password,
            });

            router.replace('./login');
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Kayit olurken hata olustu.');
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

                <Text style={styles.title}>Kayit olun</Text>

                <Text style={styles.description}>
                    Hesap olusturmak icin bilgilerinizi girin.
                </Text>

                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ad"
                    placeholderTextColor="#000000"
                />

                <TextInput
                    style={styles.input}
                    value={surname}
                    onChangeText={setSurname}
                    placeholder="Soyad"
                    placeholderTextColor="#000000"
                />

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

                <Pressable
                    style={[
                        styles.button,
                        isLoading && styles.disabledButton,
                    ]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={styles.buttonText}>KAYIT OL</Text>
                    )}
                </Pressable>

                <Pressable
                    style={styles.secondaryAction}
                    onPress={() => router.push('./login')}
                    disabled={isLoading}
                >
                    <Text style={styles.secondaryActionText}>
                        Zaten hesabiniz var mi? Giris yapin
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
        paddingTop: 56,
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
        color: '#202124',
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
        color: '#000000',
        marginBottom: 12,
    },
    errorText: {
        color: '#d93025',
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
