import { CampaignConfiguration, EmailCampaign } from '..'

const EMAIL_CAMPAIGN_TYPE = 'EmailCampaign';

export const isEmailCampaign = (
  campaign: CampaignConfiguration,
): campaign is EmailCampaign => campaign.type === EMAIL_CAMPAIGN_TYPE;

export interface returnImageProps {
  campaign: CampaignConfiguration;
};

// create email campaign component
// create normal campaign component


// if 
