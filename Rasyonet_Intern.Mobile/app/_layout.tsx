import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { AuthSessionProvider, useAuthSession } from '@/services/authSession';

export default function RootLayout() {
  return (
    <AuthSessionProvider>
      <RootNavigator />
    </AuthSessionProvider>
  );
}

function RootNavigator() {
  const { isCheckingAuth, isAuthenticated } = useAuthSession();

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen
          name="auth/login"
          options={{
            title: 'Giris Yap',
          }}
        />
        <Stack.Screen
          name="auth/register"
          options={{
            title: 'Kayit Ol',
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Performanslar',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
