import {tailwind} from '@tailwind'

import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {PropsWithChildren, useCallback, useMemo} from "react";
import {RefreshControl, ScrollView} from 'react-native'
import {DeliveredOrderCard, OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";
import {EmptyAnimation} from "@components/lottie/Empty";
import {DeliveryI, OrderI, OrderStatus, OrderType, VendorSettingsI} from '@nanahq/sticky';
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {fetchOrders} from "@store/orders.reducer";

interface OrderCatergoryProps {
    vendorSetting?: VendorSettingsI
    orders: OrderI[]
    type: OrderStatus | OrderType

    fetchingOrders: boolean

}
export function OrderCategory (props: PropsWithChildren<OrderCatergoryProps>): JSX.Element {
    const navigation = useNavigation<NavigationProp<OrderParamsList>>()
    const {deliveries, hasFetchedDeliveries} = useAppSelector((state: RootState) => state.deliveries )
    const dispatch = useAppDispatch()
    const onPress = (order: OrderI): void => navigation.navigate("GetOrder", {order})

    const findDeliveryInfo = useCallback<(id: string) => DeliveryI | undefined>((id: string) => {
        return deliveries.find(d => d.order._id === id)
    }, [hasFetchedDeliveries, deliveries ])


    const handleRefresh = () => {
        dispatch(fetchOrders())
    }

    return (

            <ScrollView
                refreshControl={<RefreshControl refreshing={props.fetchingOrders} onRefresh={handleRefresh} />}
                style={tailwind('px-3 h-full')}>
                {props.orders.length === 0 && (
                    <EmptyAnimation text='No orders yet.' />
                )}

                {props.orders.length > 0 && props.orders.map((order) =>  {
                    switch (props.type) {
                        case OrderStatus.PROCESSED:
                        case 'ON_DEMAND':
                        case 'PRE_ORDER':
                            return (
                                    <OrdersCard vendorSettings={props.vendorSetting}  order={order} key={order.refId} onPress={onPress}/>
                            )
                        case OrderStatus.FULFILLED:
                            return (
                                    <DeliveredOrderCard order={order} onPress={onPress}  key={order.refId} />
                            )

                        case OrderStatus.COLLECTED:
                        case OrderStatus.COURIER_PICKUP:
                            return (
                                <OrdersCard deliveryInfo={findDeliveryInfo(order._id)}  order={order} onPress={onPress}  key={order.refId} />
                            )
                        default:
                           return <></>
                    }
                })}
            </ScrollView>
    )
}

