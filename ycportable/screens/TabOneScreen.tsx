import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { CampaignConfiguration } from '..';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { EmailCampaignImageComponent } from './EmailCampaignImageComponent';
import { CampaignImageComponent } from './CampaignImageComponent';
import { isEmailCampaign, returnImageProps } from './utils';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [state, setState] = useState<CampaignConfiguration[]>([])
  useEffect(() => {
    fetch(
      "https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns",
      {
        headers: new Headers({
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1rUkRNVFk0UTBZd1FqSTROa1F3T1RrMFJUTkNORU5FTnpRMk1EY3hOVEl5UVRORlJFUXpNZyJ9.eyJodHRwczovL2F1dGgueWllbGRpZnkuY29tL3VzZXJEYXRhIjp7ImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJBZG1pblVzZXIiXX0sImlzcyI6Imh0dHBzOi8veWllbGRpZnktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHwxMDA3MTAiLCJhdWQiOlsieWNwIiwiaHR0cHM6Ly95aWVsZGlmeS1kZXYuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY1Mjc5NTA4NSwiZXhwIjoxNjUyNzk2ODg1LCJhenAiOiJ4REZ1WklNM1FGRHEzOUNPcm82RndpMlBIQzVhejRkciIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJwZXJtaXNzaW9ucyI6W119.AWoj9WB6exd_UMZT0Nsnhz0I61alNAe_B2JnZ23AQ3eTSC7Wq5imqyHdOgcExagN4A8EU4wNJZhfLJSd2SUGIThinZ4-F00MK6MEzSfxiQIwvijpBixsXkNvOKS5V-1SNBN_2Nw3ZNyovs98y9kCsXguPJeaBxFR_vSuSgGSnJ56W4VIaNW1kpqEm0c1xHbOL3F9g9PB112DChOTxzE5-S3TW428P7pPgDCR3Djn24XQ4orb-cQnzjrTEc_bbpdOzY6AW0KtgaIF-4M0N9fGPQiYlqaSvhgKSzTAmIsvNsbEJYLC1p97uKtZ1WPY4XhfEXg3T5wZsRpVXZnhrOz87Q',
          'Content-Type': 'application/json'
        }),
      }
    )
      .then(response => response.json())
      .then(json => {
        setState(json); // access json.body here
      }).catch((err) => console.log('>>>>>', err))
  }, []);

  return (
    <View style={styles.container}>
      {state.map((campaign, index) => {
        return (
          <View key={campaign.id}>
            <Text>{campaign.name}</Text>
            <ReturnImage campaign={campaign}></ReturnImage>
          </View>)
      })}
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

