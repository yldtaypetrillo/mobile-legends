import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CampaignConfiguration } from '../..';
import { RootTabScreenProps } from '../../types';
import { CampaignImageComponent } from '../components/CampaignImageComponent';
import { EmailCampaignImageComponent } from '../components/EmailCampaignImageComponent';
import { Input } from '../components/Input';
import { TabSelector } from '../components/TabSelector';
import { Header } from '../components/Header';
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
      <Header headerText='Dashboard' />
      <View style={styles.main}>
        <TabSelector onSelect={setCampaignState} />
        <View style={styles.input}>
          <Input
            error={false}
            placeholder={'Search campaigns by name or ID'}
            onChangeText={(text: string) => setSearchTerm(text)}
          />
        </View>
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
    paddingTop: '15%',
  },
  main: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',

    borderRadius: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
