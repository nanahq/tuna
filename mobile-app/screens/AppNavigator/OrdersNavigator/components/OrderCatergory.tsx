import {Order} from "../../../../../types/Orders.type";
import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {ShowAllButton} from "@screens/AppNavigator/OrdersNavigator/components/ShowAllButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {PropsWithChildren, useCallback} from "react";
import {OrderScreenName} from "@screens/AppNavigator/OrdersNavigator/OrderScreenName.enum";
import {IconComponent} from "@components/commons/IconComponent";

type CategoryType = 'PENDING' | 'DELIVERED'

interface OrderCatergoryProps {
    testId: string
    orders?: Order[]
    type: CategoryType
}
export function OrderCategory (props: PropsWithChildren<OrderCatergoryProps>): JSX.Element {
    const navigation = useNavigation<NavigationProp<OrderParamsList>>()

    const onShowAll = useCallback((): void => {
        const route = props.type === 'PENDING' ? OrderScreenName.PENDING_ORDERS : OrderScreenName.DELIVERED_ORDERS
        navigation.navigate({
            name: route,
            params: {
                orders: props.orders
            },
            merge: true
        })
    }, [props.type])
    return (
        <View testID={props.testId} style={tailwind('my-5')}>
            <View style={tailwind('flex flex-row  w-full items-center justify-between mb-2')}>
                <Text style={tailwind('font-bold text-lg text-brand-black-500')}>{props.type === 'PENDING' ? 'New Orders' : 'Delivered Orders'}</Text>
                <ShowAllButton onPress={onShowAll} testID={`showall-${props.testId}`} />
            </View>
            <View style={tailwind('border-0.5 border-brand-black-500')}>
                <OrdersCard  type={props.type}/>
                <OrdersCard  type={props.type}/>
                <OrdersCard  type={props.type}/>
                <OrdersCard  type={props.type}/>
                <OrdersCard  type={props.type} border={false}/>
            </View>
        </View>
    )
}

function OrdersCard (props: {order?: Partial<Order>, type: CategoryType, border?: boolean}): JSX.Element {
    const {border = true} = props

    return (
        <View style={tailwind('flex p-1.5 flex-row justify-between items-center w-full border-b-0.5 border-brand-black-500', {
            'border-0': !border
        })}>
            <View style={tailwind('flex flex-col')}>
                <Text>Tasty Shawarma</Text>
                <Text>NGN 2000</Text>
            </View>
            <View style={tailwind('flex flex-col')}>
                <View style={tailwind('bg-secondary-500 p-1 w-20 rounded-lg')}>
                    <Text style={tailwind('text-center text-white uppercase')}>MONDAY</Text>
                </View>
                <Text>Time: 2AM</Text>
            </View>
            <IconComponent iconType='Feather' name='check-square'  size={26} style={tailwind({
                'text-brand-black-500': props.type === 'PENDING',
                'text-green-500': props.type === 'DELIVERED'
            })}/>
        </View>
    )
}
