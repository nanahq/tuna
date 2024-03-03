import {createStackNavigator} from "@react-navigation/stack";
import {tailwind} from "@tailwind";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {WalletScreenName} from "@screens/AppNavigator/WalletNavigator/WalletScreenName";
import {WalletScreen} from "@screens/AppNavigator/WalletNavigator/screen/Wallet.screen";
import {WalletPayoutScreen} from "@screens/AppNavigator/WalletNavigator/screen/WalletPayout.screen";
import {VendorPayoutI} from "@nanahq/sticky";


export interface WalletParamsList {
    [WalletScreenName.WALLET_PAYOUT]: {
        payout: VendorPayoutI
    }
    [key: string]: undefined | object;
}
const WalletStack = createStackNavigator<WalletParamsList>();

export function WalletNavigator(): JSX.Element {
    const insets = useSafeAreaInsets()
    return (
        <WalletStack.Navigator
            initialRouteName={WalletScreenName.WALLET}
            screenOptions={{
                headerBackTitleVisible: false,
                headerShown: true

            }}
        >

            <WalletStack.Screen
                component={WalletScreen}
                name={WalletScreenName.WALLET}
                options={{
                    headerTitle: 'Wallet',
                    headerTitleAlign: 'left',
                    headerTitleStyle: tailwind('text-xl')
                }}
            />

            <WalletStack.Screen
                component={WalletPayoutScreen}
                name={WalletScreenName.WALLET_PAYOUT}
                options={{
                    headerTitleAlign: 'left',
                    headerTitleStyle: tailwind('text-xl')
                }}
            />
        </WalletStack.Navigator>
    );
}
