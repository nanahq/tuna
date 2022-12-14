import {PropsWithChildren} from "react";
import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from "react-native";
import {tailwind} from "@tailwind";
import * as Device from 'expo-device'
import {LinearGradient} from "expo-linear-gradient";

export function QuickLinks ({children}: PropsWithChildren<{}>): JSX.Element {
    return (
        <View style={tailwind('flex flex-col', {
            ' mt-4': Device.osName === 'Android',
            'mt-5': Device.osName === 'iOS'
        })} testID="QuickLinks">
            <Text testID="QuickActions.Title" style={tailwind('font-bold mb-5 text-brand-black-500 text-lg')}>Go to</Text>
            <View style={tailwind('flex w-full flex-row  justify-between items-center flex-wrap')}>
                {children}
            </View>
        </View>

    )
}

interface LinkProps {
    label: string
    testId: string
    onPress: () => void,
    style?: StyleProp<ViewStyle>
}

function Link (props: LinkProps): JSX.Element {
    return (
        <LinearGradient
            style={tailwind('h-28 w-28 flex items-center justify-center rounded-xl mt-2')}
            colors={['#000000', '#434343']}
        >
            <TouchableOpacity
                onPress={props.onPress}
                testID={props.testId}
                style={[tailwind(' flex items-center justify-center'), props.style]}
            >
                <Text style={tailwind('text-white text-center text-lg font-medium')}>{props.label}</Text>
            </TouchableOpacity>
        </LinearGradient>

    )
}

QuickLinks.Link = Link
