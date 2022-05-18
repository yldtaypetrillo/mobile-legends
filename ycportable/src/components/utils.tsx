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

export const getActiveVariantsFromExperiment = (experiment: Experiment): Variant[] => {
  const { splits } = experiment;

  return splits
    .filter(({ split_type, state }) => split_type !== 'control' && !state.isDeleted)
    .map((split: Split) => split.split_type);
};