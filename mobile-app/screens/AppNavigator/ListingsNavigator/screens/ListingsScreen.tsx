import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {SafeAreaView} from "react-native-safe-area-context";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {OrdersMock} from "@screens/AppNavigator/OrdersNavigator/components/OrderTabs";
import {ListingsCard} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsCard";
import {AddListingsButton} from "@screens/AppNavigator/ListingsNavigator/screens/components/AddListingsButton";
import {useNavigation} from "@react-navigation/native";

export function ListingsScreen (): JSX.Element {
    const navigation = useNavigation<any>()
    return (
        <SafeAreaView style={tailwind('bg-white')}>
            <View style={tailwind('h-full px-4 relative')}>
                <Text style={tailwind('font-semibold text-xl text-brand-black-500 my-3')}>Listings</Text>
                <ListingsList />
                <AddListingsButton  navigation={navigation}/>
            </View>
        </SafeAreaView>

    )
}


export function ListingsList (): JSX.Element {
    const renderItem = ({item}: ListRenderItemInfo<{}>) => (
        <ListingsCard {...item}/>
    )

    return (
        <View style={[tailwind('flex-1')]}>
            <FlashList
                data={OrdersMock}
                renderItem={renderItem}
                keyExtractor={item => item.order.id}
                estimatedItemSize={30}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}
