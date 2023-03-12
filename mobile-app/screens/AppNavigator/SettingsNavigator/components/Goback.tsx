import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";
import {StyleProp, TextProps} from "react-native";

export function GoBackButton ({onPress, style}: {onPress: () => void, style?: StyleProp<TextProps>}) : JSX.Element  {
    return (
        <IconButton
            iconName='arrow-left'
            iconType='Feather'
            iconSize={24}
            iconStyle={tailwind('text-brand-black-500')}
            style={[tailwind('my-2 bg-gray-200 p-2 rounded-full h-10 w-10'), style]}
            onPress={onPress}
        />
    )
}
