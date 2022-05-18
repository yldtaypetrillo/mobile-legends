import { CampaignConfiguration, EmailCampaign, Experiment, Split, Variant } from '../..'

const EMAIL_CAMPAIGN_TYPE = 'EmailCampaign';

export const isEmailCampaign = (
  campaign: CampaignConfiguration,
): campaign is EmailCampaign => campaign.type === EMAIL_CAMPAIGN_TYPE;

export interface returnImageProps {
  campaign: CampaignConfiguration;
};

export interface pageButtonProps {
  children: string,
  onPress: Function;
  title: string;

}
