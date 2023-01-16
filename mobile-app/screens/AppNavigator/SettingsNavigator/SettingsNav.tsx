import {createStackNavigator} from "@react-navigation/stack";
import {SettingsScreenName} from "@screens/AppNavigator/SettingsNavigator/SettingsScreenName.enum";
import {SettingsScreen} from "@screens/AppNavigator/SettingsNavigator/screens/Settings.screen";


export interface SettingsParamsList {
    AccountProfile: undefined,
    RestaurantProfile: | undefined,
    Payment: undefined,
    [key: string]: undefined | object;
}
const SettingsStack = createStackNavigator<SettingsParamsList>();

export function SettingsNavigator(): JSX.Element {
    return (
        <SettingsStack.Navigator
            initialRouteName={SettingsScreenName.SETTINGS}
            screenOptions={{
                headerShown: false
            }}
        >

            <SettingsStack.Screen
                component={SettingsScreen}
                name={SettingsScreenName.SETTINGS}
                options={{
                    headerShown: false
                }}
            />

            <SettingsStack.Screen
                component={SettingsScreen}
                name={SettingsScreenName.ACCOUNT_PROFILE}
                options={{
                    headerShown: false
                }}
            />
            <SettingsStack.Screen
                component={SettingsScreen}
                name={SettingsScreenName.RESTAURANT_PROFILE}
                options={{
                    headerShown: false
                }}
            />
            <SettingsStack.Screen
                component={SettingsScreen}
                name={SettingsScreenName.PAYMENT_PROFILE}
                options={{
                    headerShown: false
                }}
            />
        </SettingsStack.Navigator>
    );
}
