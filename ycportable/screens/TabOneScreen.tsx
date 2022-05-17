import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [state, setState] = useState<any[]>([])

  useEffect(() => {
    fetch(
      "https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns",
      {headers: new Headers({
        // TODO: populate from auth state (currently requires a manual enter)
        'Authorization': '',
        'Content-Type': 'application/json'
    }), }
    )
    .then(response => response.json())
    .then(json => {
      setState(json); // access json.body here
    })
  }, []);

  return (
    <View style={styles.container}>
      {state.map((campaign) => {
        return (
        <View>
          <Text>{`name: ${campaign.name}`}</Text>
        </View>);
      })}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
