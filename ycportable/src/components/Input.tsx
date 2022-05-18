import { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Pressable,
} from 'react-native';
import { theme } from '../theme';

import { Eye, EyeSlash } from 'phosphor-react-native';

interface Props extends TextInputProps {
  error: boolean;
  isPassword?: boolean;
}

export function Input({ error, isPassword, ...rest }: Props) {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <View style={[styles.container, isInputFocus && styles.focusedInput]}>
      <TextInput
        placeholderTextColor={theme.colors.grey}
        style={[styles.input, error && styles.error]}
        onFocus={() => {
          setIsInputFocus(true);
        }}
        onBlur={() => {
          setIsInputFocus(false);
        }}
        secureTextEntry={!isPassword ? false : !showPassword}
        {...rest}
      />

      {isPassword && (
        <View style={styles.icon}>
          <Pressable onPress={togglePasswordVisibility}>
            {showPassword ? (
              <EyeSlash size={24} color={theme.colors.grey} />
            ) : (
              <Eye size={24} color={theme.colors.grey} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: 300,
    height: 43,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.grey,
    color: theme.colors.black,
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flex: 1,
    outlineWidth: 0,
  },
  focusedInput: {
    backgroundColor: theme.colors.lightblue,
    borderColor: theme.colors.blue,
  },
  icon: {
    marginRight: 10,
  },
  error: {
    borderColor: theme.colors.error_red,
  },
});
