import {TouchableOpacityProps, StyleProp, TouchableOpacity, Text, TextProps} from "react-native";
import {tailwind} from "@tailwind";

interface  GenericButtonProps {
    onClick: () => void,
    label: string
    style?: StyleProp<TouchableOpacityProps>
    backgroundColor: StyleProp<TouchableOpacityProps>
    labelColor?: StyleProp<TextProps>
    testId: string
}


type Props = GenericButtonProps & TouchableOpacity["props"]


export function GenericButton (props: Props): JSX.Element {
    const {
        backgroundColor,
        label,
        labelColor,
        style,
        ...rest
    } = props
    const activeOpacity = 0.7
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            style={[tailwind('rounded-xl'), backgroundColor, style]}
            {...rest}
        >
            <Text style={[tailwind('font-semibold text-center text-lg py-3.5'), labelColor]}>{label}</Text>
        </TouchableOpacity>
    )
}
