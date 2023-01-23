import {Dimensions, Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {EarningsOverview} from "@screens/AppNavigator/WalletNavigator/component/EarningsOVerview";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {PayoutCard} from "@screens/AppNavigator/WalletNavigator/component/PayoutCard";
import {useSelector} from "react-redux";
import {RootState} from "@store/index";
import {EmptyWallet} from "@components/Empty/Wallet";

const mock = [
    {
        payoutNumber: '090',
        payoutDate: '25-dec-2022',
        payoutAmount: '3000',
    },

    {
        payoutNumber: '450',
        payoutDate: '25-dec-2022',
        payoutAmount: '56000',
    },

    {
        payoutNumber: '11',
        payoutDate: '25-dec-2022',
        payoutAmount: '3000',
    },

    {
        payoutNumber: '868',
        payoutDate: '25-dec-2022',
        payoutAmount: '63305',
    },

    {
        payoutNumber: '234',
        payoutDate: '25-dec-2022',
        payoutAmount: '3000',
    },
]

export function WalletScreen (): JSX.Element {
    const {payoutHistory, lifeTimeEarnings, dailyEarnings, hasFetchedWallet} = useSelector((state: RootState) => state.wallet )

    return (
        <View style={tailwind('px-5 flex-1 flex bg-white')}>
           <EarningsOverview lifeTimeEarnings={lifeTimeEarnings} dailyEarnings={dailyEarnings} />

            <View style={tailwind('flex  flex-col mt-10')}>
                <Text style={tailwind('text-xl text-brand-black-500 font-semibold mb-4')}>Payout history</Text>
                {hasFetchedWallet && payoutHistory.length >= 1 ? (
                    <PayoutHistory />
                ): (
                    <EmptyWallet />
                )}
            </View>
        </View>
    )
}

export function PayoutHistory (): JSX.Element {
    const screen = Dimensions.get('screen')
    const renderItem = ({item}: ListRenderItemInfo<any>) => (
        <PayoutCard {...item}/>
    )

    return (
        <View style={[tailwind(''), {
            height: screen.height / 2
        }]}>
            <FlashList
                data={mock}
                renderItem={renderItem}
                keyExtractor={item => item.payoutNumber}
                estimatedItemSize={30}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}
