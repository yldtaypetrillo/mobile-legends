import React, { useEffect, useState } from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Campaign } from '../..';
import { theme } from '../theme';
import { PauseCircle, CaretDown } from 'phosphor-react-native';
import { Eye } from 'phosphor-react-native';

interface CampaignButtonProps {
  campaign: Campaign;
  onPress: () => void;
}

export function CampaignButton({ campaign, onPress }: CampaignButtonProps) {
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
      return <PauseCircle size={16} color={theme.colors.white} weight='thin' />;
    }

    if (campaignState === 'live') {
      return <Eye color={theme.colors.white} size={24} />;
    }
  };

  const setStyles = (campaign: Campaign): StyleProp<ViewStyle> => {
    const campaignState = campaign.state;

    if (campaignState === 'paused') {
      return;
    }

    if (campaign.testing_mode && campaignState === 'live') {
      return {
        borderColor: theme.colors.yellow,
        backgroundColor: theme.colors.yellow,
      };
    }

    if (campaign.is_scheduled && campaign.state !== 'live') {
      return {
        borderColor: theme.colors.darkblue,
        backgroundColor: theme.colors.darkblue,
      };
    }

    if (campaignState === 'live') {
      return {
        borderColor: theme.colors.green,
        backgroundColor: theme.colors.green,
      };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, setStyles(campaign)]}
      onPress={onPress}
    >
      <View>{setIcon(campaign)}</View>
      <Text style={styles.text}>{campaignStateDisplay}</Text>
      <CaretDown color={theme.colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
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
  },
  text: {
    color: theme.colors.white,
  },
  selectedTab: {
    backgroundColor: theme.colors.orange,
    borderWidth: 0,
  },
});
