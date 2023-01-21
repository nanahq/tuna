import {useWindowDimensions, View} from 'react-native'
import {getColor, tailwind} from '@tailwind'
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {OrdersMock} from "@screens/AppNavigator/OrdersNavigator/components/OrderTabs";
import {ListingsCard} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsCard";
import {AddListingsButton} from "@screens/AppNavigator/ListingsNavigator/screens/components/AddListingsButton";
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {ListingsCategory} from "@screens/AppNavigator/ListingsNavigator/screens/Category";
import {ListingsMenu} from "@screens/AppNavigator/ListingsNavigator/screens/Menu";
import {ListingsOptions} from "@screens/AppNavigator/ListingsNavigator/screens/Options";

const DATA = [
    {key: 'AddListing', title: 'Menu'},
    {key: 'AddCategory', title: 'Categories'},
    {key: 'AddOption', title: 'Options'},
]

export function ListingsScreen (): JSX.Element {
    const navigation = useNavigation<any>()
    const layout = useWindowDimensions();
    const [index, setIndex] = useState<number>(0);
    const [routes, setRoutes] = useState<Array<{key: string, title: string}>>(DATA);
    const Menu : any[] = []
    const Categories: any[] = [1, 2, 3, 5]
    const Options: any[] = []
    const renderScene = SceneMap<any>({
        AddListing: () =><ListingsMenu menu={Menu} />,
        AddCategory:  () =>  <ListingsCategory categories={Categories} />,
        AddOption:  () =>  <ListingsOptions options={Options} />

    });
    return (
        <View style={tailwind('w-full bg-white h-full flex-col flex pb-5 relative')}>
            <TabView
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={tailwind('bg-secondary-500')}
                        scrollEnabled
                        style={tailwind('bg-white w-full')}
                        labelStyle={tailwind('text-brand-black-500')}
                        activeColor={getColor('secondary-500')}
                    />
                )}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
            />
                <AddListingsButton  navigation={navigation} route={routes[index].key}/>
        </View>

    )
}


export function ListingsList (): JSX.Element {
    const renderItem = ({item}: ListRenderItemInfo<{}>) => (
        <ListingsCard {...item}/>
    )

    return (
        <View style={tailwind('flex-1')}>
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
