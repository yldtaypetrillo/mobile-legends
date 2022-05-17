import * as React from "react";
import { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Input } from '../components/Input';

import { AuthContext } from '../context/authContext';
import { theme } from '../theme';

import { AuthSessionResult, makeRedirectUri, startAsync } from "expo-auth-session";

// Source: https://github.dev/GuyAvraham/expo-auth0-example-2020
interface StringMap {
  [key: string]: string;
}

const toQueryString = (params: StringMap) =>
  "?" +
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);

  const loginWithAuth0 = async (): Promise<boolean> => {
    const auth0Domain = `<DO_NOT_COMMIT_ACTUAL_VALUE>`;
    const auth0ClientId = `<DO_NOT_COMMIT_ACTUAL_VALUE>`;

    const redirectUrl = makeRedirectUri({ useProxy: true });
    const queryString = {
      client_id: auth0ClientId,
      response_type: "token",
      redirect_uri: redirectUrl,
    };

    let authUrl = `https://${auth0Domain}/authorize` + toQueryString(queryString);

    console.log(`Redirect URL => ${redirectUrl}`);
    console.log(`Auth URL => ${authUrl}`);

    const result = await startAsync({
      authUrl: authUrl,
    });

    console.log(`result => ${JSON.stringify(result, null, 2)}`);

    return handleLoginResult(result);
  };

  const handleLoginResult = (result: AuthSessionResult): boolean => {
    if (result.type !== 'success') {
      return false;
    }

    // TODO: share token around the app
    const token = result.params['access_token'];

    return true;
  }

  const login = async () => {
    console.log(`BEGIN login()`);
    const authenticated = await loginWithAuth0();
    if(authenticated) {
      signIn();
    }
    console.log(`END login()`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <View>
        <Text style={styles.label}>Email Address</Text>
        <Input error={false} placeholder={'Enter your email'} />
      </View>

      <View>
        <Text style={styles.label}>Password</Text>
        <Input error={false} placeholder={'Enter your password'} isPassword />
      </View>

      <Button onPress={login} title={'Click here to login'} />
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
