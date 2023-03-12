import {tailwind} from '@tailwind'

import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {PropsWithChildren} from "react";

import {DeliveredOrderCard, OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";
import { EmptyAnimation } from "@components/lottie/Empty";
import { OrderI, OrderType } from '@imagyne/eatlater-types';
import { ScrollView } from 'react-native-gesture-handler';

export enum OrderStatus {
    PROCESSED = "ORDER_PLACED",
    COLLECTED = "COLLECTED_FROM_VENDOR",
    IN_ROUTE = "OUT_FOR_DELIVERY",
    FULFILLED = "DELIVERED_TO_CUSTOMER"
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

                {props.orders.length > 0 && props.orders.map((order, index) =>  {
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

