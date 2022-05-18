import { Button } from 'react-native';

export function PageChangeButtonComponent(handler: Function, title: string) {
    return (
        <Button
            onPress={() => handler}
            title='Next Page'
        />
    )
} 
