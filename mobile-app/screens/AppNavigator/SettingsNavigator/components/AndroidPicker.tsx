import React, {memo} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import moment from 'moment';
import {tailwind} from "@tailwind";

 function Component  (props: {time: Date, onPress: () => void}): JSX.Element {
    const choosenDate = moment(props.time).format('HH:mm')
    return (
        <View
            style={tailwind('w-1/3 ml-3')}
        >
            <TouchableOpacity
                style={tailwind('flex  flex-row w-full items-center bg-primary-200 p-2.5 rounded')}
                onPress={props.onPress}
            >
                <Text style={tailwind('text-center text-sm w-full font-medium')}>{choosenDate}</Text>
            </TouchableOpacity>
        </View>
    )
}

export const AndroidPicker = memo(Component)
