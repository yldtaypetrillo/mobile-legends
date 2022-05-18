import { Button } from 'react-native';
import { pageButtonProps } from './utils';

export function PageChangeButtonComponent({ onPress, title }: pageButtonProps) {
    return (
        <Button
            onPress={onPress}
            title={`${title}`}
        />
    )
} 
