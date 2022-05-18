import React from 'react';
import { Image } from 'react-native';
import { EmailCampaign } from '../..';
import { returnImageProps } from './utils';

export function EmailCampaignImageComponent({ campaign }: returnImageProps) {
  return (
    <Image
      source={{
        uri: `${
          (campaign as EmailCampaign).specs.emailConfiguration[0].previewUrl
        }`,
      }}
      style={{ width: 134, height: 84 }}
    ></Image>
  );
}
