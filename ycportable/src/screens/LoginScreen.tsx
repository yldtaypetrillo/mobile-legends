import * as React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LoginButton } from '../components/LoginButton';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        resizeMode='cover'
        style={styles.background}
      >
        <View style={styles.backgroundDarken} />
      </ImageBackground>

      <View style={styles.loginButtonContainer}>
        <Image
          source={require('../assets/images/logo.svg')}
          style={styles.logo}
        />
        <LoginButton onPress={login} isLoading={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundDarken: {
    backgroundColor: 'rgba(0,0,0, 0.40)',
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    flex: 1,
  },

  loginButtonContainer: {
    height: 340,

    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,

    borderRadius: 24,

    marginTop: -50,

    backgroundColor: theme.colors.white,
  },

  logo: {
    height: 48,
    width: 162,
  },
});
