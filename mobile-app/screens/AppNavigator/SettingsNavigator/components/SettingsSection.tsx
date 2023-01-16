import {PropsWithChildren} from "react";
import {StyleProp, Text, TouchableOpacity, TouchableOpacityProps, View} from 'react-native'
import {tailwind} from '@tailwind'

export function SettingsSection (props: PropsWithChildren<{title: string}>):JSX.Element {
    return  (
        <View style={tailwind('mb-12')}>
            <Text style={tailwind('font-semibold text-lg text-brand-black-500 mb-4')}>{props.title}</Text>
            <View style={tailwind('border-0.5 border-brand-black-500')}>
                {props.children}
            </View>
        </View>
    )
}

function Item (props: {onPress: () => void, title: string, style?: StyleProp<TouchableOpacityProps>, hasBorder?: boolean}): JSX.Element {
   const { title, hasBorder = true,  style, ...rest} = props
    return (
        <TouchableOpacity
            style={[tailwind('flex flex-row items-center w-full', {
                'border-b-0.5 border-brand-black-500': hasBorder
            }), style]}
            {...rest}
        >
            <Text style={tailwind('font-semibold text-sm text-brand-black-500 my-4 mx-2.5')}>{title}</Text>
        </TouchableOpacity>
    )
}

SettingsSection.Item = Item


