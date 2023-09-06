import {tailwind} from '@tailwind'

import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {PropsWithChildren} from "react";

import {DeliveredOrderCard, OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";
import { EmptyAnimation } from "@components/lottie/Empty";
import { OrderI, OrderType } from '@imagyne/eatlater-types';
import { ScrollView } from 'react-native-gesture-handler';

export enum OrderStatus {
    PROCESSED = 'ORDER_PLACED', // default order status
    ACCEPTED = 'ORDER_ACCEPTED', // default
    COLLECTED = 'COLLECTED_FROM_VENDOR', // Only vendors can updated/use this
    IN_ROUTE = 'OUT_FOR_DELIVERY', // Only admin/rider can update/use this
    FULFILLED = 'DELIVERED_TO_CUSTOMER',
    PAYMENT_PENDING = 'PAYMENT_PENDING',
    COURIER_PICKUP = 'COURIER_PICKUP'
}
export type CategoryType = 'PENDING' | 'DELIVERED'

interface OrderCatergoryProps {
    orders: OrderI[]
    type: OrderStatus | OrderType
}
export function OrderCategory (props: PropsWithChildren<OrderCatergoryProps>): JSX.Element {
    const navigation = useNavigation<NavigationProp<OrderParamsList>>()
    const onPress = (order: OrderI): void => navigation.navigate("GetOrder", {order})

    return (

            <ScrollView style={[tailwind('px-3 h-full'),{

            }]}>
                {props.orders.length === 0 && (
                    <EmptyAnimation text='No orders yet.' />
                )}

                {props.orders.length > 0 && props.orders.map((order) =>  {
                    switch (props.type) {
                        case OrderStatus.PROCESSED:
                        case OrderStatus.COLLECTED:
                        case 'ON_DEMAND':
                        case 'PRE_ORDER':
                            return (
                                    <OrdersCard  order={order} key={order.refId} onPress={onPress}/>
                            )
                        case OrderStatus.FULFILLED:
                            return (
                                    <DeliveredOrderCard order={order} onPress={onPress}  key={order.refId} />
                            )

                        default:
                           return <></>
                    }
                })}
            </ScrollView>
    )
}

