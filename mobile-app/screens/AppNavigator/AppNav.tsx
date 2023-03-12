import {createStackNavigator} from "@react-navigation/stack";
import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {AppLinking, BottomTabNavigator} from "@screens/AppNavigator/BottomNavigator";
import * as Linking from "expo-linking"
import {useEffect} from "react";
import {fetchProfile} from "@store/profile.reducer";
import {fetchOrders} from "@store/orders.reducer";
import { useAppDispatch} from "@store/index";
import {fetchAllListings} from "@store/listings.reducer";
import { fetchWallet } from "@store/wallet.reducer";

const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    App: undefined
    [key: string]: undefined | Object
}
export function AppNavigator(): JSX.Element {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchProfile() as any)
        dispatch(fetchOrders() as any)
        dispatch(fetchAllListings())
        dispatch(fetchWallet())
    }, [])



    return (
        <NavigationContainer linking={LinkingConfiguration}>
            <App.Navigator   screenOptions={{ headerShown: false}}>
                <App.Screen component={BottomTabNavigator} name="App" />
            </App.Navigator>
        </NavigationContainer>
    );
}

const LinkingConfiguration: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [Linking.createURL("/")],
    config: {
        screens: {
            App: {
                path: "app",
                screens: AppLinking,
            }
        },
    },
};
