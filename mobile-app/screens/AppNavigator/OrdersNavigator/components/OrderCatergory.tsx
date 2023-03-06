import {Dimensions, View} from 'react-native'
import {tailwind} from '@tailwind'
import {ShowAllButton} from "@screens/AppNavigator/OrdersNavigator/components/ShowAllButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {PropsWithChildren, useCallback} from "react";
import {OrderScreenName} from "@screens/AppNavigator/OrdersNavigator/OrderScreenName.enum";
import {DeliveredOrderCard, OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";
import { EmptyAnimation } from "@components/lottie/Empty";
import { OrderI } from '@imagyne/eatlater-types';
import { ScrollView } from 'react-native-gesture-handler';

export enum OrderStatus {
    PROCESSED = "ORDER_PLACED",
    COLLECTED = "COLLECTED_FROM_VENDOR",
    IN_ROUTE = "OUT_FOR_DELIVERY",
    FULFILLED = "DELIVERED_TO_CUSTOMER"
}
export type CategoryType = 'PENDING' | 'DELIVERED'

interface OrderCatergoryProps {
    testId: string
    orders: OrderI[]
    type: OrderStatus
    hasFetchedOrders: boolean
}
export function OrderCategory (props: PropsWithChildren<OrderCatergoryProps>): JSX.Element {
    const navigation = useNavigation<NavigationProp<OrderParamsList>>()
    const {height: sreenHeight} = Dimensions.get('screen')
    // const onShowAll = useCallback((): void => {
    //     const route = props.type === 'PENDING' ? OrderScreenName.PENDING_ORDERS : OrderScreenName.DELIVERED_ORDERS
    //     navigation.navigate({
    //         name: route,
    //         params: {
    //             orders: props.orders ?? []
    //         },
    //         merge: true
    //     })
    // }, [props.type])


    return (
        <View testID={props.testId} style={tailwind('my-5')}>
            <ScrollView style={[tailwind('px-3'),{
                height: sreenHeight / 2 + 40
            }]}>
                {props.orders.length === 0 && (
                    <EmptyAnimation text='No orders yet.' />
                )}

                {props.orders.length > 0 && props.orders.map((order, index) =>  {
                    switch (props.type) {
                        case OrderStatus.PROCESSED:
                            return (
                                    <OrdersCard order={order} key={order.refId} border={index === props.orders.length - 1}/>
                            )
                        case OrderStatus.FULFILLED: 
                            return (
                                    <DeliveredOrderCard  key={order.refId} border={index === props.orders.length - 1}/>
                            )

                        case OrderStatus.COLLECTED:
                            return (
                                    <DeliveredOrderCard  key={order.refId} border={index === props.orders.length - 1}/>
                            )
                        default:
                            break;
                    }
                })}
            </ScrollView>
        </View>
    )
}

