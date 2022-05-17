import { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Input } from '../components/Input';

import { AuthContext } from '../context/authContext';
import { theme } from '../theme';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);

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

      <Button onPress={signIn} title={'Click here to login'} />
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
