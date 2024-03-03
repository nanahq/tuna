import {ScrollView, View, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {WalletParamsList} from "@screens/AppNavigator/WalletNavigator/WalletNavigator";
import {WalletScreenName} from "@screens/AppNavigator/WalletNavigator/WalletScreenName";
import {useEffect} from "react";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {tailwind} from "@tailwind";


type WalletPayoutScreenProps = StackScreenProps<WalletParamsList, WalletScreenName.WALLET_PAYOUT>
export const WalletPayoutScreen: React.FC<WalletPayoutScreenProps> = ({navigation, route}) => {
    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Payout #${route.params.payout.refId}`,
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />
        })
    }, [])
    return (
        <ScrollView style={tailwind('flex-1 bg-white px-5 pt-5')}>
            <View style={tailwind('flex flex-row items-center')}>
                <Text>Orders</Text>
            </View>
        </ScrollView>
    )
}
