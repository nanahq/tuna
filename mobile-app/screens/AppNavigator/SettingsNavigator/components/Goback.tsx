import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";
import {StyleProp, TextProps} from "react-native";

export function GoBackButton ({onPress, style}: {onPress: () => void, style?: StyleProp<TextProps>}) : JSX.Element  {
    return (
        <IconButton
            iconName='arrow-left'
            iconType='Feather'
            iconSize={34}
            iconStyle={tailwind('text-black')}
            style={[tailwind('ml-2'), style]}
            onPress={onPress}
        />
    )
}
