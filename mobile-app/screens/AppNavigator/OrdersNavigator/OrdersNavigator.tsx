import {createStackNavigator} from "@react-navigation/stack";
import {OrdersScreen} from "@screens/AppNavigator/OrdersNavigator/screens/Orders.screen";
import {OrderScreenName} from "@screens/AppNavigator/OrdersNavigator/OrderScreenName.enum";
import {PendingOrders} from "@screens/AppNavigator/OrdersNavigator/screens/PendingOrders";
import {DeliveredOrders} from "@screens/AppNavigator/OrdersNavigator/screens/DeliveredOrders";
import {GetOrder} from "@screens/AppNavigator/OrdersNavigator/screens/GetOrders";
import {tailwind} from "@tailwind";
import { OrderI } from "@imagyne/eatlater-types";


export interface OrderParamsList {
    OrdersScreen: undefined,
    GetOrder: {
       order: OrderI
    },
   DeliveredOrders: {
        orders: Array<any>
    } | undefined,

    [key: string]: undefined | object;
}
const OrderStack = createStackNavigator<OrderParamsList>();

export function OrderNavigator(): JSX.Element {
    return (
        <OrderStack.Navigator
            initialRouteName={OrderScreenName.ORDERS}
            screenOptions={{
               headerShown: false,
            }}
        >
            <OrderStack.Screen
                component={OrdersScreen}
                name={OrderScreenName.ORDERS}
                options={{
                    headerTitleStyle: tailwind('hidden'),
                   headerShown: false,
                }}
            />

            <OrderStack.Screen
                component={GetOrder}
                name={OrderScreenName.GET_ORDER}
                options={{
                    headerShown: false
                }}
            />
            <OrderStack.Screen
                component={PendingOrders}
                name={OrderScreenName.PENDING_ORDERS}
                options={{
                    headerShown: false,
                }}
            />
            <OrderStack.Screen
                component={DeliveredOrders}
                name={OrderScreenName.DELIVERED_ORDERS}
                options={{
                    headerShown: false
                }}
            />
        </OrderStack.Navigator>
    );
}
