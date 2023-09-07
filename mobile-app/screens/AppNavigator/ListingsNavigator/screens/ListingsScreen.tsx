import {useWindowDimensions, View} from 'react-native'
import {getColor, tailwind} from '@tailwind'
import {AddListingsButton} from "@screens/AppNavigator/ListingsNavigator/screens/components/AddListingsButton";
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {ListingsCategory} from "@screens/AppNavigator/ListingsNavigator/screens/Category";
import {ListingsMenu} from "@screens/AppNavigator/ListingsNavigator/screens/Menu";
import {ListingsOptions} from "@screens/AppNavigator/ListingsNavigator/screens/Options";
import {RootState, useAppSelector} from "@store/index";
import { LoaderComponentScreen } from '@components/commons/LoaderComponent';

const DATA = [
    {key: 'AddListing', title: 'Menu'},
    {key: 'AddCategory', title: 'Categories'},
    {key: 'AddOption', title: 'Options'},
]

export function ListingsScreen (): JSX.Element {
    const navigation = useNavigation<any>()
    const layout = useWindowDimensions();
    const [index, setIndex] = useState<number>(0);
    const [routes] = useState<Array<{key: string, title: string}>>(DATA);

    const {listingsCategory, listingsMenu, listingsOptionGroup, fetchingListings}  = useAppSelector((state: RootState) => state.listings)

    const renderScene = SceneMap<any>({
        AddListing: () =><ListingsMenu menu={listingsMenu} state={fetchingListings}/>,
        AddCategory:  () =>  <ListingsCategory categories={listingsCategory} state={fetchingListings} />,
        AddOption:  () =>  <ListingsOptions options={listingsOptionGroup} state={fetchingListings}/>

    });

    if (fetchingListings) {
        return <LoaderComponentScreen />
    }
    return (
        <View style={tailwind('w-full bg-white h-full flex-col flex pb-5 relative')}>
            <TabView
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={tailwind('bg-primary-500')}
                        scrollEnabled
                        style={tailwind('bg-white w-full')}
                        labelStyle={tailwind('text-brand-black-500')}
                        activeColor={getColor('primary-500')}
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
