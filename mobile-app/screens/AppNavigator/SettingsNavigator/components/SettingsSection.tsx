import {PropsWithChildren} from "react";
import {StyleProp, Text, TouchableOpacity, TouchableOpacityProps, View} from 'react-native'
import {tailwind} from '@tailwind'
import { NotComplete } from "./NotCompleted";

export function SettingsSection (props: PropsWithChildren<{title: string}>):JSX.Element {
    return  (
        <View style={tailwind('mb-12')}>
            <Text style={tailwind('font-semibold text-lg text-brand-black-500 mb-4')}>{props.title}</Text>
            <View style={tailwind('border-0.5 border-brand-black-500 bg-white')}>
                {props.children}
            </View>
        </View>
    )
}


function Item (props: {onPress: () => void,  disabled?: boolean, isComplete?: boolean,  subtitle?: string, title: string, style?: StyleProp<TouchableOpacityProps>, hasBorder?: boolean}): JSX.Element {
   const { title, disabled = false,  hasBorder = true,  style, ...rest} = props
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[tailwind('flex flex-col w-full px-2.5 py-4', {
                'border-b-0.5 border-brand-black-500': hasBorder
            }), style]}
            {...rest}
        >
            <View style={tailwind('flex flex-row items-center justify-between')}>
                <Text style={tailwind('font-semibold text-sm text-brand-black-500', {'text-brand-gray-400': disabled})}>{title}</Text>
                {props.isComplete !==undefined &&  !props.isComplete && (<NotComplete />)}
            </View>
            {props.subtitle && (<Text style={tailwind('font-normal text-xs text-brand-gray-800 mt-1')}>{props.subtitle}</Text>)}
        </TouchableOpacity>
    )
}

SettingsSection.Item = Item


