import {PropsWithChildren} from "react";
import {StyleProp, Text, TouchableOpacity, View} from 'react-native'
import {tailwind} from '@tailwind'
import { NotComplete } from "./NotCompleted";

export function SettingsSection (props: PropsWithChildren<{title: string}>):JSX.Element {
    return  (
        <View style={tailwind('mb-6')}>
            <Text style={tailwind('text-lg text-black mb-2')}>{props.title}</Text>
            <View style={tailwind('border-0.5 border-gray-300 bg-white')}>
                {props.children}
            </View>
        </View>
    )
}


function Item (props: {onPress: () => void,  disabled?: boolean, isComplete?: boolean,  subtitle?: string, title: string, style?: StyleProp<any>, hasBorder?: boolean}): JSX.Element {
   const { title, disabled = false,  hasBorder = true,  style, ...rest} = props
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[tailwind('flex flex-col w-full px-2.5 py-2', {
                'border-b-0.5 border-gray-300': hasBorder
            }), style]}
            {...rest}
        >
            <View style={tailwind('flex flex-row items-center justify-between')}>
                <Text style={tailwind('text-sm text-black', {'text-brand-gray-400': disabled})}>{title}</Text>
                {props.isComplete !==undefined &&  !props.isComplete && (<NotComplete />)}
            </View>
            {props.subtitle && (<Text style={tailwind('font-normal text-xs text-brand-gray-800 mt-1')}>{props.subtitle}</Text>)}
        </TouchableOpacity>
    )
}

SettingsSection.Item = Item


