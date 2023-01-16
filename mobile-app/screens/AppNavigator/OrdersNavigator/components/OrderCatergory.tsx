import {Order} from "@store/orders.reducer";
import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {ShowAllButton} from "@screens/AppNavigator/OrdersNavigator/components/ShowAllButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {PropsWithChildren, useCallback} from "react";
import {OrderScreenName} from "@screens/AppNavigator/OrdersNavigator/OrderScreenName.enum";
import {DeliveredOrderCard, OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";
import {EmptyOrder} from "@screens/AppNavigator/OrdersNavigator/components/EmptyOrder";

export type CategoryType = 'PENDING' | 'DELIVERED'

interface OrderCatergoryProps {
    testId: string
    orders: Order[]
    type: CategoryType
    hasFetchedOrders: boolean
}
export function OrderCategory (props: PropsWithChildren<OrderCatergoryProps>): JSX.Element {
    const navigation = useNavigation<NavigationProp<OrderParamsList>>()

    const onShowAll = useCallback((): void => {
        const route = props.type === 'PENDING' ? OrderScreenName.PENDING_ORDERS : OrderScreenName.DELIVERED_ORDERS
        navigation.navigate({
            name: route,
            params: {
                orders: props.orders ?? []
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
                {props.orders.length === 0 && (
                    <EmptyOrder msg='No orders yet.' />
                )}
                {props.orders.length > 0 && props.orders.map((order, index) =>  {
                    if( props.type === 'PENDING') {
                        return (
                            <OrdersCard  key={order.refId} border={index === props.orders.length - 1}/>
                        )
                    } else {
                        return (
                            <DeliveredOrderCard  key={order.refId} border={index === props.orders.length - 1}/>
                        )
                    }
                })}
            </View>
        </View>
    )
}

