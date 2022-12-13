import {Order} from "@typings/Orders.type";
import {StyleProp, Text, TouchableOpacity, TouchableOpacityProps, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {NavigationProp, useNavigation} from "@react-navigation/native";

export function OrdersCard (props: {order?: Partial<Order>, border?: boolean, onPress?: (navigation: NavigationProp<any>) => void, style?: StyleProp<TouchableOpacityProps>}): JSX.Element {
    const {border = true} = props
    const navigation = useNavigation()
    return (
        <TouchableOpacity
            onPress={() => {
                if(props.onPress !== undefined) {
                    props.onPress(navigation)
                }
            }}
            style={[
            tailwind('flex p-1.5 flex-row justify-between items-center w-full border-b-0.5 border-brand-black-500', {
                'border-0': !border
            }),
            props.style
        ]}>
            <View style={tailwind('flex flex-col')}>
                <Text>Tasty Shawarma</Text>
                <Text>NGN 2000</Text>
            </View>
            <View style={tailwind('flex flex-col')}>
                <View style={tailwind('bg-brand-gray-400 p-1 w-20 rounded-lg')}>
                    <Text style={tailwind('text-center text-white uppercase')}>MONDAY</Text>
                </View>
                <Text>Time: 2AM</Text>
            </View>
            <IconComponent iconType='Feather' name='clock'  size={26} style={tailwind('text-brand-gray-800')}/>
        </TouchableOpacity>
    )
}

export function DeliveredOrderCard (props: {order?: Partial<Order>, border?: boolean, onPress?: (navigation: NavigationProp<any>) => void, style?: StyleProp<TouchableOpacityProps>}): JSX.Element {
    const {border = true} = props
    const navigation = useNavigation()
    return (
        <TouchableOpacity
            onPress={() => {
                if(props.onPress !== undefined) {
                    props.onPress(navigation)
                }
            }}
            style={[
            tailwind('flex p-1.5 flex-row justify-between items-center w-full border-b-0.5 border-brand-black-500', {
                'border-0': !border
            }),
            props.style
        ]}>
            <View style={tailwind('flex flex-col')}>
                <Text>Tasty Shawarma</Text>
                <Text>NGN 2000</Text>
            </View>
            <View style={tailwind('flex flex-col')}>
                <Text>Delivered: Tuesday</Text>
                <Text>Time: 2AM</Text>
            </View>
            <IconComponent iconType='Feather' name='check-square'  size={26} style={tailwind('text-green-500')}/>
        </TouchableOpacity>
    )
}

