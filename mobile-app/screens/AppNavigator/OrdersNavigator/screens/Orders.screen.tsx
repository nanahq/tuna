import {SafeAreaView} from "react-native-safe-area-context";
import {tailwind} from '@tailwind'
import {OrdersStats} from "@screens/AppNavigator/OrdersNavigator/components/OrdersStats";
import {OrderCategory} from "@screens/AppNavigator/OrdersNavigator/components/OrderCatergory";
import {ScrolledView} from "@components/views/ScrolledView";
import {useSelector} from "react-redux";
import {RootState} from "@store/index";
import {useCallback} from "react";
import {Order, OrderStatus} from "@store/orders.reducer";
import {OrderHeaderStatus} from "@screens/AppNavigator/OrdersNavigator/components/OrderHeader";

export function OrdersScreen (): JSX.Element {
    const {orders, hasFetchedOrders} = useSelector((state: RootState) => state.orders )

    const filterOrders = useCallback((type: 'completed' | 'pending' | 'cancelled'): number => {
        return orders.filter((order: Order) => {
            switch (type) {
                case "completed":
                    return order.orderStatus === OrderStatus.FULFILLED
                case "pending":
                    return order.orderStatus in [OrderStatus.IN_ROUTE, OrderStatus.COLLECTED, OrderStatus.PROCESSED]
                case "cancelled":
                    return order.orderStatus === OrderStatus.CANCELLED
            }
        }).length
    }, [orders, hasFetchedOrders])

    const getPendingOrders = useCallback(() => {
        return orders.filter((order: Order) =>  order.orderStatus in [OrderStatus.IN_ROUTE, OrderStatus.COLLECTED, OrderStatus.PROCESSED])
            .slice(0, 4)
    }, [hasFetchedOrders, orders])

    const getFulfilledOrders = useCallback(() => {
        return orders.filter((order: Order) =>  order.orderStatus === OrderStatus.FULFILLED)
            .slice(0, 4)
    }, [hasFetchedOrders, orders])

    return (
        <SafeAreaView
            style={tailwind('w-full bg-white h-full flex-col flex pb-5')}
        >
            <ScrolledView testId="OrdersScreen" style={[tailwind('px-3.5 py-5')]}>
                <OrderHeaderStatus />
                <OrdersStats
                    hasFetchedOrders={hasFetchedOrders}
                    completed={filterOrders('completed')}
                    cancelled={filterOrders('cancelled')}
                    pending={filterOrders('pending')}
                />
                <OrderCategory
                    orders={getFulfilledOrders()}
                    hasFetchedOrders={hasFetchedOrders}
                    type='PENDING'
                    testId='OrdersScreen.OrderCategory.PENDING'
                />
                <OrderCategory
                    orders={getPendingOrders()}
                    hasFetchedOrders={hasFetchedOrders}
                    type='DELIVERED'
                    testId='OrdersScreen.OrderCategory.DELIVERED'
                />
            </ScrolledView>
        </SafeAreaView>
    )
}
