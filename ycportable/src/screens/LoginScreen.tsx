import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LoginButton } from '../components/LoginButton';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>

      <LoginButton onPress={login} isLoading={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: theme.colors.black,
    fontSize: 12,
    marginBottom: 4,
  },
});
