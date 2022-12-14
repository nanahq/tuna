import {createStackNavigator} from "@react-navigation/stack";
import {ListingsScreenName} from "@screens/AppNavigator/ListingsNavigator/ListingsScreenName.enum";
import {ListingsScreen} from "@screens/AppNavigator/ListingsNavigator/screens/ListingsScreen";
import {SingleListingScreen} from "@screens/AppNavigator/ListingsNavigator/screens/SingleListingScreen";
import {AddListingsScreen} from "@screens/AppNavigator/ListingsNavigator/screens/AddListingsScreen";


export interface ListingsParams {
    GetListing: {
        listings: string
    } | undefined,

    AddListing: undefined,

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
                component={SingleListingScreen}
                name={ListingsScreenName.GET_LISTING}
                options={{
                    headerShown: false
                }}
            />

            <ListingsStack.Screen
                component={AddListingsScreen}
                name={ListingsScreenName.ADD_LISTING}
                options={{
                    headerShown: false
                }}
            />
        </ListingsStack.Navigator>
    );
}
