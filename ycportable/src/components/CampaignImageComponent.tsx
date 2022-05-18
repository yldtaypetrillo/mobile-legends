import React from 'react';
import { Image } from 'react-native';
import { Campaign } from '../..';
import { returnImageProps } from './utils';

export function CampaignImageComponent({ campaign }: returnImageProps) {
  return (
    <Image
      source={{
        uri: `${
          (campaign as Campaign).revision?.specs.creativeGroups[0].stages[0]
            .previewUrl
        }`,
      }}
      style={{ width: 134, height: 84 }}
    ></Image>
  );
}
