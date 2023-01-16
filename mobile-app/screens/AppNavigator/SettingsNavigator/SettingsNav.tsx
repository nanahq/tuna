import {createStackNavigator} from "@react-navigation/stack";
import {SettingsScreenName} from "@screens/AppNavigator/SettingsNavigator/SettingsScreenName.enum";
import {SettingsScreen} from "@screens/AppNavigator/SettingsNavigator/screens/Settings.screen";
import {AccountProfile} from "@screens/AppNavigator/SettingsNavigator/screens/AccountProfile";
import {RestaurantProfile} from "@screens/AppNavigator/SettingsNavigator/screens/RestaurantProfile";
import {tailwind} from "@tailwind";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PaymentSettings} from "@screens/AppNavigator/SettingsNavigator/screens/PaymentSetting";
import {RestaurantSettings} from "@screens/AppNavigator/SettingsNavigator/screens/RestaurantSettings";


export interface SettingsParamsList {
    AccountProfile: undefined,
    RestaurantProfile: | undefined,
    Payment: undefined,
    [key: string]: undefined | object;
}
const SettingsStack = createStackNavigator<SettingsParamsList>();

export function SettingsNavigator(): JSX.Element {
    const insets = useSafeAreaInsets()
    return (
        <SettingsStack.Navigator
            initialRouteName={SettingsScreenName.SETTINGS}
            screenOptions={{
                headerLeft: () => <></>,
                headerTitle: 'Profile',
                headerTitleAlign: 'left',
                headerLeftContainerStyle: tailwind('pl-5'),
                headerTitleStyle: tailwind('font-semibold text-brand-black-500 text-lg'),
                headerStyle: [tailwind(''), {
                    shadowOpacity: 8,
                    height: insets.top + 40
                }],
                headerBackTitleVisible: false,
                headerShown: true
            }}
        >

            <SettingsStack.Screen
                component={SettingsScreen}
                name={SettingsScreenName.SETTINGS}
                options={{
                    headerShown: true,
                    headerTitle: 'Settings & Profile',
                }}
            />

            <SettingsStack.Screen
                component={AccountProfile}
                name={SettingsScreenName.ACCOUNT_PROFILE}
                options={{
                    headerShown: true,
                    headerTitle: 'Account Profile'

                }}
            />
            <SettingsStack.Screen
                component={RestaurantProfile}
                name={SettingsScreenName.RESTAURANT_PROFILE}
                options={{
                    headerShown: true,
                    headerTitle: 'Restaurant Profile'
                }}
            />
            <SettingsStack.Screen
                component={PaymentSettings}
                name={SettingsScreenName.PAYMENT_PROFILE}
                options={{
                    headerShown: true,
                    headerTitle: 'Payment settings'
                }}
            />
            <SettingsStack.Screen
                component={RestaurantSettings}
                name={SettingsScreenName.RESTAURANT_SETTINGS}
                options={{
                    headerShown: true,
                    headerTitle: 'Business Operations'
                }}
            />
        </SettingsStack.Navigator>
    );
}
