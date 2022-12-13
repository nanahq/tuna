import {Order} from "../../../../../types/Orders.type";
import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {ShowAllButton} from "@screens/AppNavigator/OrdersNavigator/components/ShowAllButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {PropsWithChildren, useCallback} from "react";
import {OrderScreenName} from "@screens/AppNavigator/OrdersNavigator/OrderScreenName.enum";
import {DeliveredOrderCard, OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";

export type CategoryType = 'PENDING' | 'DELIVERED'

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
                {props.type === 'PENDING' ? (
                    <>
                        <OrdersCard  />
                        <OrdersCard />
                        <OrdersCard />
                        <OrdersCard />
                        <OrdersCard border={false}/>
                    </>
                ): (
                    <>
                        <DeliveredOrderCard  />
                        <DeliveredOrderCard />
                        <DeliveredOrderCard />
                        <DeliveredOrderCard />
                        <DeliveredOrderCard border={false}/>
                    </>
                )}
            </View>
        </View>
    )
}

