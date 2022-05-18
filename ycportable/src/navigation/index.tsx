/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { RootStackParamList } from '../../types';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';

export default function Navigation({}: {}) {
  // TODO: remove mocked signedIn
  const { isSignedIn } = useAuth();
  // const isSignedIn = true;

  return (
    <NavigationContainer>
      {isSignedIn ? <DashboardNavigator /> : <LoginNavigator />}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function LoginNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function DashboardNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Dashboard'
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
