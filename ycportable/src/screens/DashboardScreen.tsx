import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Campaign, CampaignConfiguration } from '../..';
import { RootTabScreenProps } from '../../types';
import { CampaignImageComponent } from '../components/CampaignImageComponent';
import { EmailCampaignImageComponent } from '../components/EmailCampaignImageComponent';
import { Input } from '../components/Input';
import { TabSelector } from '../components/TabSelector';
import { Header } from '../components/Header';
import { isEmailCampaign, returnImageProps } from '../components/utils';
import { useAuth } from '../hooks/useAuth';
import { fetchCampaigns } from '../utils/fetchCampaigns';
import RBSheet from 'react-native-raw-bottom-sheet';

export default function DashboardScreen({
  navigation,
}: RootTabScreenProps<'Dashboard'>) {
  const [campaigns, setCampaigns] = useState<CampaignConfiguration[]>([]);
  const [pageNumber, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignState, setCampaignState] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<
    CampaignConfiguration | undefined
  >(undefined);
  const { token } = useAuth();
  const refRBSheet = useRef();


  useEffect(() => {
    onPressTouch();
    if (token) {
      fetchCampaigns({ token, pageNumber, searchTerm, campaignState }).then(
        (campaigns) => setCampaigns(campaigns)
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

  const handleUpdateClick = (campaign: Campaign, option: string) => {
    refRBSheet.current.close()

    // TODO: Update state on click

    if(campaign.testing_mode && option == "Launch"){
      updateCampaign(campaign, 'stop_testing_mode');
    }else{
    switch (option) {
      case "Launch":
        updateCampaign(campaign, 'apply_revision');
        return;
      case "Pause":
        updateCampaign(campaign, 'pause');
        return;
      case "Preview Mode":
        updateCampaign(campaign, 'start_testing_mode');
      return;
    }

  }
  };

  const updateCampaign = (campaign: Campaign, action: string) => {
    fetch(
      `https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns/${campaign.id}/${action}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }),
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      })
      .catch((err) => console.error(err));
  };



  const formatCampaignState = (campaign: Campaign): string => {
    const campaignState = campaign.state;

    if (campaign.testing_mode && campaignState === "live") {
      return "Preview Mode";
    }

    if (isCampaignExpired(campaign)) {
      return "Campaign Expired";
    }

    if (campaignState === "paused") {
      return "Off";
    }

    if (campaign.is_scheduled && campaign.state !== "live") {
      return "Scheduled";
    }

    return campaignState;
  };

  const isCampaignExpired = (campaign: Campaign): boolean =>
    campaign.end_at !== undefined &&
    campaign.end_at !== null &&
    new Date(campaign.end_at) < new Date();

  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <Header headerText="Dashboard" />
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
                <Button
                title={formatCampaignState(campaign)}
                onPress={() => {
                  setSelectedCampaign(campaign);
                  refRBSheet.current.open();
                }}
              ></Button>
              <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  wrapper: {
                    backgroundColor: "transparent",
                  },
                  draggableIcon: {
                    backgroundColor: "#000",
                  },
                }}
              >
                  <Text>
                    {selectedCampaign?.name} {selectedCampaign?.id}
                  </Text>
                  {<UpdateOptions campaign={selectedCampaign!} />}
              </RBSheet>
              </View>
            );
          })}

          <Button onPress={clickedPreviousPageButton} title="PreviousPage">
            Previous Page
          </Button>

          <Text>{pageNumber}</Text>

          <Button onPress={clickedNextPageButton} title="NextPage">
            Next Page
          </Button>
        </ScrollView>
      </View>
    </View>
  );





  interface updateOptionsProps {
    campaign: CampaignConfiguration;
  }

  function UpdateOptions({ campaign }: updateOptionsProps) {
    const startOption: string = "Launch";

    const pauseOption: string = "Pause";

    const previewOption: string = "Preview Mode";

    if (
      campaign.end_at !== undefined &&
      campaign.end_at !== null &&
      new Date(campaign.end_at) < new Date()
    ) {
      return <></>;
    }

    if (campaign.state === "paused") {

      if (isEmailCampaign(campaign)) {
        // You can't set email standalone campaigns to preview mode
        return (
          <>
            <Button title={startOption} onPress={()=>handleUpdateClick(campaign,startOption)}></Button>
          </>
        );
      }

      return (
        <>
          <Button title={startOption} onPress={()=>handleUpdateClick(campaign,startOption)}></Button>
          <Button title={previewOption} onPress={()=>handleUpdateClick(campaign,previewOption)}></Button>
        </>
      );
    }

    if ((campaign as Campaign).testing_mode) {
      return (
        <>
          <Button title={startOption} onPress={()=>handleUpdateClick(campaign,startOption)}></Button>
          <Button title={pauseOption} onPress={()=>handleUpdateClick(campaign,pauseOption)}></Button>
        </>
      );
    }

    if (isEmailCampaign(campaign)) {
      // You can't set email standalone campaigns to preview mode
      return (<Button title={pauseOption} onPress={()=>handleUpdateClick(campaign,pauseOption)}></Button>);
    }

    return (
      <>
        <Button title={pauseOption} onPress={()=>handleUpdateClick(campaign,pauseOption)}></Button>
        <Button title={previewOption} onPress={()=>handleUpdateClick(campaign,previewOption)}></Button>
      </>
    );
  }

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

