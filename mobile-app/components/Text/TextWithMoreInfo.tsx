import {StyleProp, Text, TextStyle, View, ViewStyle} from "react-native";
import {tailwind} from '@tailwind'

interface TextWithMoreInfoProps {
    moreInfo: string
    moreInfoStyle?: StyleProp<TextStyle>
    containerStyle?: StyleProp<ViewStyle>
    text: string
}
export function TextWithMoreInfo (props: TextWithMoreInfoProps): JSX.Element {
    return (
        <View style={[tailwind('flex flex-col w-full my-3'), props.containerStyle]}>
            <Text style={tailwind('font-medium text-brand-black-500')}>{props.text}</Text>
            <Text style={[tailwind('text-xs text-brand-gray-700 mt-2'), props.moreInfoStyle]}>{props.moreInfo}</Text>
        </View>
    )
}
