import Checkbox from 'expo-checkbox';
import {DaysList} from "@typings/Days";
import {Text, View} from 'react-native'
import {getColor, tailwind} from '@tailwind'

export function ListingDateCheckBox (props: {onChange: () => void, date: keyof DaysList | 'EVERYDAY', checked: boolean }): JSX.Element {
    return (
        <View style={tailwind('flex flex-row items-center mr-2 mb-2')}>
            <Checkbox
                style={tailwind('m-2 p-1')}
                onValueChange={props.onChange}
                value={props.checked}
                color={props.checked ? getColor('green-500') : undefined}
            />
            <Text>{props.date}</Text>
        </View>
    )
}
