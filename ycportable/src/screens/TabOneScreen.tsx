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
          // Authorization: `Bearer ${token}`,
          Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1rUkRNVFk0UTBZd1FqSTROa1F3T1RrMFJUTkNORU5FTnpRMk1EY3hOVEl5UVRORlJFUXpNZyJ9.eyJodHRwczovL2F1dGgueWllbGRpZnkuY29tL3VzZXJEYXRhIjp7ImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJBZG1pblVzZXIiXX0sImlzcyI6Imh0dHBzOi8veWllbGRpZnktZGV2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHwxMDA3MTAiLCJhdWQiOlsieWNwIiwiaHR0cHM6Ly95aWVsZGlmeS1kZXYuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY1Mjg4MTQ4OCwiZXhwIjoxNjUyODgzMjg4LCJhenAiOiJ4REZ1WklNM1FGRHEzOUNPcm82RndpMlBIQzVhejRkciIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJwZXJtaXNzaW9ucyI6W119.Cm-y8Wahp1_xqVUAsCtJnNo48ZJBfQfVc0sQqPbLVnktRWpmM2Lbpd7VOlF4h6deed6rm31-z96Nvweb7COYoSE88k8X67l1Cq0EHzW7Vol1Emzgu4A-5eYH3BzmbeNqX6nlEBy4tyXoqrcbuXOsvXY8ItliaOvQxon4BiF9FZzPKZKPHYxUE4wdc_-HnIpdXxr7smYQISPpiMKU5wI4IupMizcijqsAq8NaJ91x5G8eGv7qDRe8SDTphldudO91EL1mjKRfv4OMMvjqig9ap5ISOUUgCJwDkBY7LEF-wU71CysZ01X75QzbFSGSZ6KO6va-aaQEqILTYBZrcTNfKQ`,
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

  // function experimentType(campaign:CampaignConfiguration) {
  //   const { experiments } = campaign;
  //   if (isMissing(experiments) || isEmpty(experiments)) {
  //     return ['a'];
  //   }

  //   return getActiveVariantsFromExperiment(experiments[0]);
  // }
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
