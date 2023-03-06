import {View, Text} from 'react-native'
import {tailwind} from '@tailwind'

export function NotComplete (): JSX.Element {
    return (
        <View style={tailwind('border-0.5 border-brand-green-500 rounded-lg flex flex-row justify-center py-1 px-3')}>
                <Text style={tailwind('text-brand-green-500 font-medium text-xs')}>Not Complete</Text>
        </View>
    )
}