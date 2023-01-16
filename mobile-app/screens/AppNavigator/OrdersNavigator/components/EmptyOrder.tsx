import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'

export function EmptyOrder (props: {msg: string}): JSX.Element {
    return (
        <View style={tailwind('flex flex-row w-full justify-center items-center py-20')}>
            <Text style={tailwind('text-brand-gray-800 text-center font-semibold text-lg')}>{props.msg}</Text>
        </View>
    )
}
