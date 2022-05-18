import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { CampaignConfiguration } from '../..';
import { RootTabScreenProps } from '../../types';
import { CampaignImageComponent } from '../components/CampaignImageComponent';
import { EmailCampaignImageComponent } from '../components/EmailCampaignImageComponent';
import { Input } from '../components/Input';
import { PageChangeButtonComponent } from '../components/PageChangeButton';
import { isEmailCampaign, returnImageProps } from '../components/utils';
import { useAuth } from '../hooks/useAuth';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [pageNumber, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('')
  const [state, setState] = useState<CampaignConfiguration[]>([])
  const { token } = useAuth();

  useEffect(() => {
    fetch(
      `https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns?page=${pageNumber}&per_page=15&order[name]=asc${searchTerm}`,
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
      }).catch((err) => alert(err))
  }, [pageNumber, searchTerm]);

  const clickedNextPageButton = () => {
    if (state.map((campaign) => { campaign }).length < 15) {
      console.log('Last page')
      return
    }
    onPressTouch()
    setPage(pageNumber + 1);
  }

  const clickedPreviousPageButton = () => {
    if (pageNumber === 1) {
      return
    }
    onPressTouch()
    setPage(pageNumber - 1);
  }

  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  function returnSearchTerm(changedText: string) {
    return changedText != '' ? setSearchTerm(`&search[filter]=${changedText}`) : setSearchTerm('')
  }
  const scrollRef = useRef<ScrollView>(null)
  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef}>
        <Input error={false} placeholder={'Search campaigns by name or ID'} isPassword={false} onChangeText={returnSearchTerm} />
        {state.map((campaign) => {
          return (
            <View key={campaign.id} style={{ flexDirection: "row", marginBottom: 50 }}>
              <View style={{ flexDirection: "column", marginLeft: 10, marginRight: 10 }}>
                <Text style={{ flex: 2, fontSize: 20 }}>{campaign.name}</Text>
                <Text style={{ flex: 2, marginBottom: 10 }}>{`#${campaign.id}`}</Text>
              </View>
              {/* <View style={{alignContent:'flex-end'}}> */}
              <ReturnImage campaign={campaign}></ReturnImage>
              {/* </View> */}
            </View>)
        })}

        <PageChangeButtonComponent onPress={clickedPreviousPageButton}
          title='PreviousPage'>
          Previous Page
        </PageChangeButtonComponent>

        <Text>{pageNumber}</Text>

        <PageChangeButtonComponent
          onPress={clickedNextPageButton}
          title='NextPage'>
          Next Page
        </PageChangeButtonComponent>
      </ScrollView>
    </View >
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
