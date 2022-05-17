import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../theme';

interface Props extends TouchableOpacityProps {
  isLoading?: boolean;
}
export function LoginButton({ disabled, isLoading, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, (disabled || isLoading) && styles.disabled]}
      disabled={disabled || isLoading}
      {...rest}
    >
      <Text style={styles.text}>LOG IN</Text>
      {isLoading && <ActivityIndicator size={16} color={theme.colors.orange} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,

    width: 300,
    height: 51,
    borderRadius: 4,

    backgroundColor: theme.colors.orange,
  },
  text: {
    fontSize: 16,
    color: theme.colors.white,
  },
  disabled: {
    backgroundColor: theme.colors.grey,
  },
});
