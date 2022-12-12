import {Text, TouchableOpacity, View} from "react-native";
import {tailwind} from "@tailwind";
import {PropsWithChildren} from "react";
import {IconComponent, IconName} from "@components/commons/IconComponent";
import * as Device from "expo-device";

export function QuickActions ({children}: PropsWithChildren<{}>): JSX.Element {
    return (
        <View style={tailwind('flex flex-col', {
            ' mt-4': Device.osName === 'Android',
            'mt-5': Device.osName === 'iOS'
        })} testID="QuickActions">
            <Text testID="QuickActions.Title" style={tailwind('font-bold mb-5  text-brand-black-500 text-lg')}>Quick Actions</Text>
            <View style={tailwind('flex w-full items-center justify-between flex-row')}>
                {children}
            </View>
        </View>

    )
}
interface ActionProps {
    label: string
    iconName: IconName
    onPress: () => void
    testId: string

}
function Action (props: ActionProps): JSX.Element {
    return (
       <View style={tailwind('flex flex-col w-20 items-center')}>
           <TouchableOpacity
               testID={`Action-${props.testId}`}
               style={tailwind('bg-brand-gray-400 rounded-full h-12 w-12 flex items-center justify-center')}
               onPress={props.onPress}
           >
               <IconComponent
                   size={20}
                   name={props.iconName}
                   iconType='Feather'
                   style={tailwind('text-white')}
               />
           </TouchableOpacity>
           <Text style={tailwind('text-xs text-center mt-1 font-medium text-brand-black-500')}>{props.label}</Text>
       </View>

    )
}

QuickActions.Action = Action
