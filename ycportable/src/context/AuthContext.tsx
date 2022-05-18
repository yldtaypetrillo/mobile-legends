import * as React from 'react';
import { createContext, ReactNode, useState } from 'react';
import {
  AuthSessionResult,
  makeRedirectUri,
  startAsync,
} from 'expo-auth-session';
import getSettings from '../config/GetSettings';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  isSignedIn: boolean;
  login: () => void;
  signOut: () => void;
  token?: string;
}

// Source: https://github.dev/GuyAvraham/expo-auth0-example-2020
const {
  auth0: { auth0Domain, clientId },
} = getSettings();

interface StringMap {
  [key: string]: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [token, setToken] = useState<string>();

  const toQueryString = (params: StringMap) =>
    '?' +
    Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

  function signIn() {
    setIsSignedIn(true);
  }

  function signOut() {
    setIsSignedIn(false);
  }

  const loginWithAuth0 = async (): Promise<boolean> => {
    const redirectUrl = makeRedirectUri({ useProxy: true });

    console.log(`redirectUrl => ${redirectUrl}`);
    const queryString = {
      client_id: clientId,
      response_type: 'token',
      redirect_uri: redirectUrl,
    };

    let authUrl =
      `https://${auth0Domain}/authorize` + toQueryString(queryString);

    const result = await startAsync({
      authUrl: authUrl,
    });

    return handleLoginResult(result);
  };

  const handleLoginResult = (result: AuthSessionResult): boolean => {
    if (result.type !== 'success') {
      return false;
    }

    const token = result.params['access_token'];
    setToken(token);

    return true;
  };

  const login = async () => {
    const authenticated = await loginWithAuth0();
    if (authenticated) {
      signIn();
    }
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, login, signOut, token }}>
      {children}
    </AuthContext.Provider>
  );
}
