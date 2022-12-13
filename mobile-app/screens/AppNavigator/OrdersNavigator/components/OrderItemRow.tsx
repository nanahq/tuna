import {StyleProp, Text, TextProps, View, ViewProps} from 'react-native'
import {tailwind} from '@tailwind'
import {PropsWithChildren} from "react";

interface OrderItemRowProps{
    title: string
    text: string
    titleStyle?: StyleProp<TextProps>
    textStyle?: StyleProp<TextProps>
    containerStyle?: StyleProp<ViewProps>
}

 function OrderItemRow (props: OrderItemRowProps): JSX.Element {
    return (
        <View style={[tailwind('flex flex-row items-center'), props.containerStyle]}>
            <Text style={[tailwind('text-brand-black-500 text-sm font-medium'), props.textStyle]}>{props.title}</Text>
            <Text style={[tailwind('text-brand-black-500 ml-1 text-sm font-normal'), props.titleStyle]}>{props.text}</Text>
        </View>
    )
}


export function OrderSection (props:PropsWithChildren<{width?: StyleProp<ViewProps>, heading: string, testId: string, fullWidth?: boolean}>): JSX.Element {
    const {heading , children, fullWidth = true} = props
    return (
        <View style={[tailwind('flex flex-col', {
            'w-full': fullWidth
        }), props.width]}>
            <Text style={tailwind('font-semibold text-xl text-brand-black-500 mb-2.5')}>{heading}</Text>
            {children}
        </View>
    )
}

OrderSection.Row = OrderItemRow
