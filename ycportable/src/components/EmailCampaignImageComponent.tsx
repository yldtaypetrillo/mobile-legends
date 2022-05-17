import { returnImageProps } from "./utils"
import { Image } from 'react-native';
import { EmailCampaign } from '../..';
export function EmailCampaignImageComponent({ campaign }: returnImageProps) {
    return (
        <Image source={{ uri: `${(campaign as EmailCampaign).specs.emailConfiguration[0].previewUrl}` }} style={{ width: 305, height: 159 }}></Image>
    )
}
