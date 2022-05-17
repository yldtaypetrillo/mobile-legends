import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootTabScreenProps } from '../../types';


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
    }).catch((err) =>{
      alert(err);
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
