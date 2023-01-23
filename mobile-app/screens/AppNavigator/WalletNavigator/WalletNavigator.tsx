import {createStackNavigator} from "@react-navigation/stack";
import {tailwind} from "@tailwind";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {WalletScreenName} from "@screens/AppNavigator/WalletNavigator/WalletScreenName";
import {WalletScreen} from "@screens/AppNavigator/WalletNavigator/screen/Wallet.screen";


export interface SettingsParamsList {
    [key: string]: undefined | object;
}
const WalletStack = createStackNavigator<SettingsParamsList>();

export function WalletNavigator(): JSX.Element {
    const insets = useSafeAreaInsets()
    return (
        <WalletStack.Navigator
            initialRouteName={WalletScreenName.WALLET}
            screenOptions={{
                headerLeft: () => <></>,
                headerTitle: 'Wallet & Earnings',
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

            <WalletStack.Screen
                component={WalletScreen}
                name={WalletScreenName.WALLET}
                options={{
                    headerShown: true,
                }}
            />

        </WalletStack.Navigator>
    );
}
