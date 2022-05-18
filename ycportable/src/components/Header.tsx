import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gear } from 'phosphor-react-native';
import { theme } from '../theme';

interface HeaderProps {
  headerText: string;
}

export function Header({ headerText }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{headerText}</Text>
      <Gear size={24} color={theme.colors.black} weight={'fill'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 72,
    paddingHorizontal: 24,
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: theme.colors.lightgrey,
  },
  headerText: {
    fontSize: 24,
    color: theme.colors.black,
    fontWeight: 'bold',
  },
});
