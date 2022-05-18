import React,{ useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { Campaign, CampaignConfiguration } from '../..';
import { RootTabScreenProps } from '../../types';
import { CampaignImageComponent } from '../components/CampaignImageComponent';
import { EmailCampaignImageComponent } from '../components/EmailCampaignImageComponent';
import { Input } from '../components/Input';
import { isEmailCampaign, returnImageProps } from '../components/utils';
import { useAuth } from '../hooks/useAuth';
import ModalDropdown from "react-native-modal-dropdown";

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [pageNumber, setPage] = useState(1);
  const [val, setVal] = useState(1);
  const [searchTerm, setSearchTerm] = useState('')
  const [state, setState] = useState<CampaignConfiguration[]>([])

  const { token } = useAuth();

  useEffect(() => {
    onPressTouch

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

  const updateCampaign = (campaign: Campaign, action: string) => {
    fetch(
      `https://viserion.yieldify-dev.com/v2/organizations/1/websites/1/campaigns/${campaign.id}/${action}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }), method:'POST',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      })
      .catch((err) => console.error(err));
  };

  const handleDropDownSelect = (campaign: Campaign, option: string) => {
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
        <Input error={false} placeholder={'Search campaigns by name or ID'} isPassword={false} onChangeText={(text: string) => text != '' ? setSearchTerm(`&search[filter]=${text}`) : setSearchTerm('')} />
        {state.map((campaign) => {
          const dropDownOption = getDropDownOptions(campaign);
          return (
            <View key={campaign.id}>
              <Text>{campaign.name}</Text>
              <ReturnImage campaign={campaign}></ReturnImage>
              <ModalDropdown
                style={styles.dropdown_2}
                textStyle={styles.dropdown_2_text}
                dropdownStyle={styles.dropdown_2_dropdown}
                onSelect={(e, o) => handleDropDownSelect(campaign, o)}
                options={dropDownOption}
                defaultValue={formatCampaignState(campaign)}
              />
            </View>
          );
        })}

        <Button
          onPress={clickedPreviousPageButton}
          title='PreviousPage'
        >
          Previous Page
        </Button>

        <Text>{pageNumber}</Text>

        <Button
          onPress={clickedNextPageButton}
          title='NextPage'
        >
          Next Page
        </Button>
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

const getDropDownOptions = (campaign: CampaignConfiguration) => {
  const startOption: string = "Launch";

  const pauseOption: string = "Pause";

  const previewOption: string = "Preview Mode";

  if (
    campaign.end_at !== undefined &&
    campaign.end_at !== null &&
    new Date(campaign.end_at) < new Date()
  ) {
    return [];
  }

  if (campaign.state === "paused") {
    if (isEmailCampaign(campaign)) {
      // You can't set email standalone campaigns to preview mode
      return [startOption];
    }

    return [startOption, previewOption];
  }

  if ((campaign as Campaign).testing_mode) {
    return [startOption, pauseOption];
  }

  if (isEmailCampaign(campaign)) {
    // You can't set email standalone campaigns to preview mode
    return [pauseOption];
  }

  return [pauseOption, previewOption];
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
campaign.end_at !== null && new Date(campaign.end_at) < new Date();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdown_2: {
    alignSelf: 'flex-end',
    width: 300,
    marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 30,
    backgroundColor: 'cornflowerblue',
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_2_dropdown: {
    width: 150,
    height: 80,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },
});
