import {tailwind} from '@tailwind'

import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {PropsWithChildren, useCallback} from "react";

import {DeliveredOrderCard, OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";
import {EmptyAnimation} from "@components/lottie/Empty";
import {DeliveryI, OrderI, OrderStatus, OrderType, VendorSettingsI} from '@nanahq/sticky';
import {ScrollView} from 'react-native-gesture-handler';
import {RootState, useAppSelector} from "@store/index";

interface OrderCatergoryProps {
    vendorSetting?: VendorSettingsI
    orders: OrderI[]
    type: OrderStatus | OrderType

}
export function OrderCategory (props: PropsWithChildren<OrderCatergoryProps>): JSX.Element {
    const navigation = useNavigation<NavigationProp<OrderParamsList>>()
    const {deliveries, hasFetchedDeliveries} = useAppSelector((state: RootState) => state.deliveries )

    const onPress = (order: OrderI): void => navigation.navigate("GetOrder", {order})

    const findDeliveryInfo = useCallback<(id: string) => DeliveryI | undefined>((id: string) => {
        return deliveries.find(d => d.order._id === id)
    }, [hasFetchedDeliveries, deliveries ])

    return (

            <ScrollView style={[tailwind('px-3 h-full'),{

            }]}>
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

