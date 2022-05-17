import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Button } from 'react-native';
import { CampaignConfiguration } from '../..';
import { RootTabScreenProps } from '../../types';
import { CampaignImageComponent } from '../components/CampaignImageComponent';
import { EmailCampaignImageComponent } from '../components/EmailCampaignImageComponent';
import { Input } from '../components/Input';
import { returnImageProps, isEmailCampaign } from '../components/utils';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [pageNumber, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('')
  const [state, setState] = useState<CampaignConfiguration[]>([])

  useEffect(() => {
    onPressTouch
    fetch(
      `https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns?page=${pageNumber}&per_page=15&order[name]=asc${searchTerm}`,
      {
        headers: new Headers({
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1rUkRNVFk0UTBZd1FqSTROa1F3T1RrMFJUTkNORU5FTnpRMk1EY3hOVEl5UVRORlJFUXpNZyJ9.eyJodHRwczovL2F1dGgueWllbGRpZnkuY29tL3VzZXJEYXRhIjp7ImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJBZG1pblVzZXIiXX0sImlzcyI6Imh0dHBzOi8veWllbGRpZnktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHwxMDA3MTAiLCJhdWQiOlsieWNwIiwiaHR0cHM6Ly95aWVsZGlmeS1kZXYuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY1MjgwNTE4NiwiZXhwIjoxNjUyODA2OTg2LCJhenAiOiJ4REZ1WklNM1FGRHEzOUNPcm82RndpMlBIQzVhejRkciIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJwZXJtaXNzaW9ucyI6W119.GCiYua0mPGnoj60SnmYkLG97AG0MquRMAcD5CPokLfxNjd6mWeKzS9JBMjz4khjFXmjq6Hwa67Sveh-mfIYp_U_wjCbL5-QRfAPPU76cG-y-Y9q0R7dkgfAx0W1XI0HdV26RGfbXn6hsI4nVt8Xbq-FDdICbDeHDshHL3lOanfeW3NbXz3wVLX7EVvACnDN9_Yxjiz7ha_ODxsgFd_1sO9RN9n_RuupuSkaww-ISRCfs1UfqSSAam1llMPF4ISeOywm-exsCdvKyb4O_P0Ts3107NOVhSRclJxb0dh9OnXgSbmYdcjBRi-VWFfhrw8CxN1Btx-h0eaA0rigFnbTamA',
          'Content-Type': 'application/json'
        }),
      }
    )
      .then(response => response.json())
      .then(json => {
        setState(json); // access json.body here
      }).catch((err) => alert(err))
  }, [pageNumber]);

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

  const scrollRef = useRef<ScrollView>(null)
  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef}>
      <Input error={false} placeholder={'Search campaigns by name or ID'} isPassword={false} />
        {state.map((campaign) => {
          return (
            <View key={campaign.id}>
              <Text>{campaign.name}</Text>
              <ReturnImage campaign={campaign}></ReturnImage>
            </View>)
        })}

        <Button
          onPress={clickedPreviousPageButton}
          title='PreviousPage'
        >
          Previous Page
        </Button>

        <Text>{pageNumber}</Text>

        <Button
          onPress={
            clickedNextPageButton
          }
          title='NextPage'
        >
          Next Page
        </Button>
      </ScrollView>
    </View>
  );
}

function ReturnImage({ campaign }: returnImageProps) {
  return isEmailCampaign(campaign) ?
    <EmailCampaignImageComponent campaign={campaign} />
    :
    <CampaignImageComponent campaign={campaign} />
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

