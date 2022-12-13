import {createStackNavigator} from "@react-navigation/stack";
import {ListingsScreenName} from "@screens/AppNavigator/ListingsNavigator/ListingsScreenName.enum";
import {ListingsScreen} from "@screens/AppNavigator/ListingsNavigator/screens/ListingsScreen";


export interface ListingsParams {
    GetListings: {
        listings: string
    } | undefined,

    [key: string]: undefined | object;
}
const ListingsStack = createStackNavigator<ListingsParams>();

export function ListingsNavigator(): JSX.Element {
    return (
        <ListingsStack.Navigator
            initialRouteName={ListingsScreenName.Listings}
            screenOptions={{
                headerShown: false
            }}
        >

            <ListingsStack.Screen
                component={ListingsScreen}
                name={ListingsScreenName.Listings}
                options={{
                    headerShown: false
                }}
            />

            <ListingsStack.Screen
                component={ListingsScreen}
                name={ListingsScreenName.GET_LISTING}
                options={{
                    headerShown: false
                }}
            />
        </ListingsStack.Navigator>
    );
}
