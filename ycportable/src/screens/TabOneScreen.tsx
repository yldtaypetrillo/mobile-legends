import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CampaignConfiguration } from '../..';
import { RootTabScreenProps } from '../../types';
import { CampaignImageComponent } from '../components/CampaignImageComponent';
import { EmailCampaignImageComponent } from '../components/EmailCampaignImageComponent';
import { isEmailCampaign, returnImageProps } from '../components/utils';
import { useAuth } from '../hooks/useAuth';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [state, setState] = useState<CampaignConfiguration[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetch(
      'https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns',
      {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setState(json); // access json.body here
      })
      .catch((err) => alert(err));
  }, []);

  return (
    <View style={styles.container}>
      {state.map((campaign) => {
        return (
          <View key={campaign.id}>
            <Text>{campaign.name}</Text>
            <ReturnImage campaign={campaign}></ReturnImage>
          </View>
        );
      })}
    </View>
  );
}

function ReturnImage({ campaign }: returnImageProps) {
  return isEmailCampaign(campaign) ? (
    <EmailCampaignImageComponent campaign={campaign} />
  ) : (
    <CampaignImageComponent campaign={campaign} />
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
