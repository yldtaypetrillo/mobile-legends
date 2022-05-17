import { returnImageProps } from "./utils"
import { Image } from 'react-native';
import { Campaign } from "../..";

export function CampaignImageComponent({ campaign }: returnImageProps) {
    return (
        <Image source={{ uri: `${(campaign as Campaign).revision?.specs.creativeGroups[0].stages[0].previewUrl}` }} style={{ width: 305, height: 159 }} ></Image>
    )
}