import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CampaignConfiguration } from '../..';
import { RootTabScreenProps } from '../../types';
import { CampaignImageComponent } from '../components/CampaignImageComponent';
import { EmailCampaignImageComponent } from '../components/EmailCampaignImageComponent';
import { Input } from '../components/Input';
import { TabSelector } from '../components/TabSelector';
import { isEmailCampaign, returnImageProps } from '../components/utils';
import { useAuth } from '../hooks/useAuth';
import { fetchCampaigns } from '../utils/fetchCampaigns';

export default function DashboardScreen({
  navigation,
}: RootTabScreenProps<'Dashboard'>) {
  const [campaigns, setCampaigns] = useState<CampaignConfiguration[]>([]);
  const [pageNumber, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignState, setCampaignState] = useState('');
  // TODO: remove mocked Token
  // const { token } = useAuth();

  const token = 'mocked!';

  useEffect(() => {
    onPressTouch();
    if (token) {
      fetchCampaigns({ token, pageNumber, searchTerm, campaignState }).then(
        (campaigns) => setCampaigns(campaigns),
      );
    }
  }, [pageNumber, searchTerm, campaignState]);

  const clickedNextPageButton = () => {
    if (
      campaigns.map((campaign) => {
        campaign;
      }).length < 15
    ) {
      console.log('Last page');
      return;
    }
    onPressTouch();
    setPage(pageNumber + 1);
  };

  const clickedPreviousPageButton = () => {
    if (pageNumber === 1) {
      return;
    }
    onPressTouch();
    setPage(pageNumber - 1);
  };

  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <TabSelector onSelect={setCampaignState}></TabSelector>
      <Input
        error={false}
        placeholder={'Search campaigns by name or ID'}
        onChangeText={(text: string) => setSearchTerm(text)}
      />
      <ScrollView ref={scrollRef}>
        {campaigns.map((campaign) => {
          return (
            <View key={campaign.id}>
              <Text>{campaign.name}</Text>
              <ReturnImage campaign={campaign}></ReturnImage>
            </View>
          );
        })}

        <Button onPress={clickedPreviousPageButton} title='PreviousPage'>
          Previous Page
        </Button>

        <Text>{pageNumber}</Text>

        <Button onPress={clickedNextPageButton} title='NextPage'>
          Next Page
        </Button>
      </ScrollView>
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
    marginTop: '20%',
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
