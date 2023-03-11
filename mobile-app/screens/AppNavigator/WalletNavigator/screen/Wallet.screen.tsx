import {Dimensions, Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {EarningsOVerview} from "@screens/AppNavigator/WalletNavigator/component/EarningsOVerview";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {PayoutCard} from "@screens/AppNavigator/WalletNavigator/component/PayoutCard";
import {useSelector} from "react-redux";
import {RootState} from "@store/index";
import { VendorPayoutI } from '@imagyne/eatlater-types';
import { LoaderComponentScreen } from '@components/commons/LoaderComponent';
import { EmptyAnimation } from '@components/lottie/Empty';


export function WalletScreen (): JSX.Element {
    const {payouts, overview, hasFetchedWallet} = useSelector((state: RootState) => state.wallet )
    
    if(!hasFetchedWallet) {
        return (
            <LoaderComponentScreen />
        )
    }
    
    return (
        <View style={tailwind('px-5 flex-1 flex bg-brand-gray-500')}>
            <EarningsOVerview overview={overview} />  

            <Text style={tailwind('text-lg font-semibold text-brand-black-500 mt-4 mb-2')}>Payouts</Text>
            {payouts.length < 1  ? (
                <EmptyAnimation text='No transaction has been made' />
            ): (
                <PayoutHistory payouts={payouts} />
            )}  
        </View>
    )
}

export function PayoutHistory ({payouts}: {payouts: VendorPayoutI[]}): JSX.Element {
    const screen = Dimensions.get('screen')
    const renderItem = ({item, index}: ListRenderItemInfo<VendorPayoutI>) => (
        <PayoutCard payout={item} index={index} />
    )

    return (
        <View style={[tailwind(''), {
            height: screen.height / 2
        }]}>
            <FlashList
                data={payouts}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                estimatedItemSize={30}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}
