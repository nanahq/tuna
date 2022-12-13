import {createStackNavigator} from "@react-navigation/stack";
import {OrdersScreen} from "@screens/AppNavigator/OrdersNavigator/screens/Orders.screen";
import {OrderScreenName} from "@screens/AppNavigator/OrdersNavigator/OrderScreenName.enum";
import {PendingOrders} from "@screens/AppNavigator/OrdersNavigator/screens/PendingOrders";
import {DeliveredOrders} from "@screens/AppNavigator/OrdersNavigator/screens/DeliveredOrders";


export interface OrderParamsList {
    GetOrders: {
       orderid: string
    } | undefined,
   DeliveredOrders: {
        orders: Array<any>
    } | undefined,

    PendingOrders: {
        orders: Array<any>
    } | undefined,
    [key: string]: undefined | object;
}
const HomeStack = createStackNavigator<OrderParamsList>();

export function OrderNavigator(): JSX.Element {
    return (
        <HomeStack.Navigator
            initialRouteName={OrderScreenName.ORDERS}
            screenOptions={{
               headerShown: false
            }}
        >

            <HomeStack.Screen
                component={OrdersScreen}
                name={OrderScreenName.ORDERS}
                options={{
                   headerShown: false
                }}
            />

            <HomeStack.Screen
                component={OrdersScreen}
                name={OrderScreenName.GET_ORDER}
                options={{
                    headerShown: false
                }}
            />
            <HomeStack.Screen
                component={PendingOrders}
                name={OrderScreenName.PENDING_ORDERS}
                options={{
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                component={DeliveredOrders}
                name={OrderScreenName.DELIVERED_ORDERS}
                options={{
                    headerShown: false
                }}
            />
        </HomeStack.Navigator>
    );
}
