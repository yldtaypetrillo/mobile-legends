import React, { useEffect, useState } from 'react';
import { Button, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Campaign } from '../..';
import { theme } from '../theme';
import { PauseCircle, CaretDown } from 'phosphor-react-native';

interface CampaignButtonProps {
  campaign: Campaign;
}

export function CampaignButton({ campaign }: CampaignButtonProps) {
  const [campaignStateDisplay, setCampaignStateDisplay] = useState('');

  useEffect(() => {
    setCampaignStateDisplay(formatCampaignStateDisplay(campaign));
  }, [campaign]);

  const isCampaignExpired = (campaign: Campaign): boolean =>
    campaign.end_at !== undefined &&
    campaign.end_at !== null &&
    new Date(campaign.end_at) < new Date();

  const formatCampaignStateDisplay = (campaign: Campaign): string => {
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

  const setIcon = (campaign: Campaign) => {
    const campaignState = campaign.state;

    if (campaignState === 'paused') {
      return <PauseCircle />;
    }
  };

  return (
    <TouchableOpacity style={styles.button}>
      <View style={styles.icon1}>{setIcon(campaign)}</View>
      <Text>{campaignStateDisplay}</Text>
      <CaretDown style={styles.icon2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon1: {
    // flex: 1,
    // alignSelf: 'flex-start'
    // backgroundColor: theme.colors.white,
  },
  icon2: {
    // flex: 1,
  },
  button: {
    flexDirection: 'row',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginVertical: 12,
    borderRadius: 100,

    borderWidth: 1,
    borderColor: theme.colors.neutralMediumDark,
    backgroundColor: theme.colors.neutralMediumDark,

    // marginLeft: 8,
  },
  text: {
    // flex: 2,
    marginHorizontal: '80%',
    color: theme.colors.white,
  },
  selectedTab: {
    backgroundColor: theme.colors.orange,
    borderWidth: 0,
  },
});
