import {OrdersMock} from "@screens/AppNavigator/OrdersNavigator/components/OrderTabs";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {CategoryType} from "@screens/AppNavigator/OrdersNavigator/components/OrderCatergory";
import {DeliveredOrderCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";
import {tailwind} from "@tailwind";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {View} from "react-native";
import {TextArea} from "@components/commons/inputs/TextInput";
import {NavigationProp} from "@react-navigation/native";


export function DeliveredOrders (): JSX.Element {
    const insets = useSafeAreaInsets()
    const renderItem = ({item}: ListRenderItemInfo<{onPress: (navigation: NavigationProp<any>) => void,  type: CategoryType, order: any}>) => (
        <DeliveredOrderCard {...item}  style={tailwind('mb-4')}/>
    )

    return (
        <View style={[tailwind('flex-1 px-4 pt-4 bg-white'), {paddingTop: insets.top + 30}]}>
            <TextArea
                containerStyle={tailwind('mb-4')}
                testID="DeliveredOrders.Search"
                onChangeText={() => {}} initialText=""
                placeholder='Search Order by order id'
                placeHolderStyle=''
                style={tailwind('bg-brand-blue-200 rounded-lg')}
            />
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


