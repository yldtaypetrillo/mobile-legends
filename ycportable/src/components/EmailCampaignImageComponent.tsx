import { returnImageProps } from "./utils"
import { Image } from 'react-native';
import { EmailCampaign } from '../..';
export function EmailCampaignImageComponent({ campaign }: returnImageProps) {
    return (
        <Image source={{ uri: `${(campaign as EmailCampaign).specs.emailConfiguration[0].previewUrl}` }} style={{ width: 30, height: 15 }} ></Image>
    )
}
