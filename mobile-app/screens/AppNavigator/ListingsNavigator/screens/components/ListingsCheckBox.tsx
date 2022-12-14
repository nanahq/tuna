import Checkbox from 'expo-checkbox';
import {Text, View} from 'react-native'
import {getColor, tailwind} from '@tailwind'


export function ListingsCheckBox (props: {onChange: () => void, text:  'CUSTOM' | 'ADDON', checked: boolean }): JSX.Element {
    return (
        <View style={tailwind('flex flex-row items-center mr-2 mb-2')}>
            <Checkbox
                style={tailwind('m-2 p-1')}
                onValueChange={props.onChange}
                value={props.checked}
                color={props.checked ? getColor('green-500') : undefined}
            />
            <Text>{props.text}</Text>
        </View>
    )
}
