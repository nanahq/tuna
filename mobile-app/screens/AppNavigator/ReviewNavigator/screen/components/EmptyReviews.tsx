import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {IconComponent} from "@components/commons/IconComponent";

export function EmptyReviews (): JSX.Element {
    return (
        <View style={tailwind('flex flex-col items-center justify-center mt-3')}>
            <IconComponent iconType='Feather' name='info' style={tailwind('text-yellow-500')} size={35} />
            <Text style={tailwind('text-lg font-semibold text-brand-gray-800')}>No reviews yet.</Text>
        </View>
    )
}
