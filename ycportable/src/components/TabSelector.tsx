import React, { useState } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { theme } from '../theme';

interface TabSelectorProps {
  onSelect: (value: string) => void;
}

export function TabSelector({ onSelect }: TabSelectorProps) {
  const filters = [
    {
      id: 1,
      name: 'All',
      value: '',
    },
    {
      id: 2,
      name: 'Live',
      value: 'live',
    },
    {
      id: 3,
      name: 'Preview Mode',
      value: 'preview',
    },
    {
      id: 4,
      name: 'Scheduled',
      value: 'scheduled',
    },
    {
      id: 5,
      name: 'Off',
      value: 'paused',
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState(filters[0].id);

  function handleSelectTab(filter: typeof filters[0]) {
    onSelect(filter.value);
    setSelectedFilter(filter.id);
  }

  return (
    <View>
      <ScrollView
        horizontal={true}
        style={styles.container}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
        }}
      >
        {filters.map((filter) => {
          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => handleSelectTab(filter)}
              style={[
                styles.tabSelector,
                selectedFilter === filter.id && styles.selectedTab,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  selectedFilter === filter.id && { color: theme.colors.white },
                ]}
              >
                {filter.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    maxHeight: 50,
    maxWidth: '93%',
  },
  tabSelector: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 4,
    borderRadius: 100,

    borderWidth: 1,
    borderColor: theme.colors.grey,

    marginLeft: 8,
    height: 25,
  },
  text: {
    color: theme.colors.grey,
  },
  selectedTab: {
    backgroundColor: theme.colors.orange,
    borderWidth: 0,
  },
});
