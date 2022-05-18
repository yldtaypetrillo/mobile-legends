import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Campaign, CampaignConfiguration } from '../..';
import { RootTabScreenProps } from '../../types';
import { CampaignImageComponent } from '../components/CampaignImageComponent';
import { EmailCampaignImageComponent } from '../components/EmailCampaignImageComponent';
import { Input } from '../components/Input';
import { TabSelector } from '../components/TabSelector';
import { Header } from '../components/Header';
import { CampaignButton } from '../components/CampaignButton';
import { isEmailCampaign, returnImageProps } from '../components/utils';
import { useAuth } from '../hooks/useAuth';
import { fetchCampaigns } from '../utils/fetchCampaigns';
import RBSheet from 'react-native-raw-bottom-sheet';
import { theme } from '../theme';
import { CaretDown, Eye } from 'phosphor-react-native';

export default function DashboardScreen({
  navigation,
}: RootTabScreenProps<"Dashboard">) {
  const [campaigns, setCampaigns] = useState<CampaignConfiguration[]>([]);
  const [pageNumber, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [campaignState, setCampaignState] = useState("");
  const [campaignUpdateStatus, setCampaignUpdateStatus] = useState("");

  const [selectedCampaign, setSelectedCampaign] = useState<
    CampaignConfiguration | undefined
  >(undefined);
  const refRBSheet = useRef();

  // TODO: remove mocked Token
  const { token } = useAuth();
  // const token = 'mocked!';

  useEffect(() => {
    onPressTouch();
    if (token) {

      setCampaignUpdateStatus('');
      fetchCampaigns({ token, pageNumber, searchTerm, campaignState }).then(
        (campaigns) => setCampaigns(campaigns)
      );
    }
  }, [pageNumber, searchTerm, campaignState, campaignUpdateStatus]);

  const clickedNextPageButton = () => {
    if (
      campaigns.map((campaign) => {
        campaign;
      }).length < 15
    ) {
      console.log("Last page");
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

    if (campaign.testing_mode && option == "Launch") {
      updateCampaign(campaign, "stop_testing_mode");
    } else {
      switch (option) {
        case "Launch":
          updateCampaign(campaign, "apply_revision");
          break;
        case "Pause":
          updateCampaign(campaign, "pause");
          break;
        case "Preview Mode":
          updateCampaign(campaign, "start_testing_mode");
          break;
      }
    }
    refRBSheet.current.close();
  };

  const updateCampaign = (campaign: Campaign, action: string) => {
    fetch(
      `https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns/${campaign.id}/${action}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
        method: 'POST',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setCampaignUpdateStatus("updated");
      })
      .catch((err) => console.error(err));
  };

  const formatCampaignState = (campaign: Campaign): string => {
    const campaignState = campaign.state;

    if (campaign.testing_mode && campaignState === 'live') {
      return 'Preview Mode';
    }

    if (isCampaignExpired(campaign)) {
      return 'Campaign Expired';
    }

    if (campaignState === 'paused') {
      return 'Off';
    }

    if (campaign.is_scheduled && campaign.state !== 'live') {
      return 'Scheduled';
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
            placeholder={"Search campaigns by name or ID"}
            onChangeText={(text: string) => setSearchTerm(text)}
          />
        </View>
        <ScrollView ref={scrollRef}>
          {campaigns.map((campaign) => {
            return (
              <View key={campaign.id}>
                <View key={campaign.id}>
                  <View key={campaign.id} style={styles.campaignInfoContainer}>
                    <View style={styles.campaignTextsContainer}>
                      <View style={styles.campaignTitleContainer}>
                        <Text style={styles.campaignTitle}>
                          {campaign.name}
                        </Text>
                        <Text style={styles.campaignId}>#{campaign.id}</Text>
                      </View>
                      <View style={styles.campaignType}>
                        <Text style={styles.campaignTypeText}>
                          Multi Variant
                        </Text>
                      </View>
                    </View>
                    <ReturnImage campaign={campaign}></ReturnImage>
                  </View>
                  <CampaignButton
                    campaign={campaign}
                    onPress={() => {
                      setSelectedCampaign(campaign);
                      refRBSheet.current.open();
                    }}
                  />
                  {/* <TouchableOpacity
                    onPress={() => {
                      setSelectedCampaign(campaign);
                      refRBSheet.current.open();
                    }}
                    style={styles.changeCampaignStateButton}
                  >
                    <Eye size={16} color={theme.colors.white} weight='thin' />
                    <Text style={{ color: theme.colors.white }}>
                      {formatCampaignState(campaign)}
                    </Text>
                    <CaretDown size={16} color={theme.colors.white} />
                  </TouchableOpacity> */}
                  <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                      container: { borderTopEndRadius: 40, borderTopStartRadius: 40, height: 200 },
                      wrapper: {
                        backgroundColor: "rgba(1,1,1,0.5)",
                      },
                      draggableIcon: {
                        backgroundColor: "#000",
                      },
                    }}
                  >
                    <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 20, borderBottomColor: '#F4F4F4', borderBottomWidth: 1 }}>
                      <Text style={{ fontSize: 19, fontWeight: '500' }}>{selectedCampaign?.name}</Text>
                      <Text style={{ color: '#AFAFAF', fontSize: 14, fontWeight: '400' }}>#{selectedCampaign?.id}</Text>
                    </View>
                    {<UpdateOptions campaign={selectedCampaign!} />}
                  </RBSheet>
                </View>
                <View style={styles.separator} />

              </View>
            );
          })}

          <View style={styles.pagination}>
            <Button onPress={clickedPreviousPageButton} title={"<"}>
            </Button>

            <Text>Page: {pageNumber}</Text>

            <Button onPress={clickedNextPageButton} title={">"}>
            </Button>
          </View>
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

    const startButton = (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? 'rgb(210, 230, 255)'
              : 'white'
          },
          styles.button
        ]}
        onPress={() => handleUpdateClick(campaign, startOption)}
      >
        <Text style={{ fontSize: 19 }}>{startOption}</Text>
      </Pressable>
    );

    const pauseButton = (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? 'rgb(210, 230, 255)'
              : 'white'
          },
          styles.button
        ]} onPress={() => handleUpdateClick(campaign, pauseOption)}
      >
        <Text style={{ fontSize: 19 }}>{pauseOption}</Text>
      </Pressable>
    );

    const previewButton = (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? 'rgb(210, 230, 255)'
              : 'white'
          },
          styles.button
        ]}
        onPress={() => handleUpdateClick(campaign, previewOption)}
      >
        <Text style={{ fontSize: 19 }}>{previewOption}</Text>
      </Pressable>
    );

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
        return <>{startButton}</>;
      }

      return (
        <>

          {startButton}
          {previewButton}
        </>
      );
    }

    if ((campaign as Campaign).testing_mode) {
      return (
        <>

          {startButton}
          {pauseButton}
        </>
      );
    }

    if (isEmailCampaign(campaign)) {
      // You can't set email standalone campaigns to preview mode
      {
        pauseButton;
      }
    }

    return (
      <>
        {pauseButton}
        {previewButton}
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
    paddingTop: '8%',
    flex: 1
  },
  main: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    flex: 1
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
    backgroundColor: theme.colors.lightgrey,
  },
  campaignInfoContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  campaignTextsContainer: {
    marginBottom: 19,
    justifyContent: 'space-around',
    width: 162,
    height: 84,
  },
  campaignTitle: {
    fontSize: 16,
    color: theme.colors.black,
  },
  campaignId: {
    fontSize: 12,
    color: theme.colors.grey,
  },
  campaignTitleContainer: {},
  campaignType: {
    backgroundColor: theme.colors.lightblue,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '80%',

    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    color: 'gray',
  },
  campaignTypeText: {
    color: theme.colors.blue,
  },
  changeCampaignStateButton: {
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'space-between',
    width: 312,
    borderRadius: 100,
    paddingHorizontal: 16,

    backgroundColor: '#55BB70',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
