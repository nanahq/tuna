import {View, Text} from 'react-native'
import {tailwind} from '@tailwind'

export function NotComplete (): JSX.Element {
    return (
        <View style={tailwind('border-0.5 border-warning-600 rounded-lg flex flex-row justify-center py-1 px-3')}>
                <Text style={tailwind('text-warning-600 font-semibold text-xs')}>Not Complete</Text>
        </View>
    )
}