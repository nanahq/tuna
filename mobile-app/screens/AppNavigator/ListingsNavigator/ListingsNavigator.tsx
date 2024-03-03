import {createStackNavigator} from "@react-navigation/stack";
import {ListingsScreenName} from "@screens/AppNavigator/ListingsNavigator/ListingsScreenName.enum";
import {ListingsScreen} from "@screens/AppNavigator/ListingsNavigator/screens/ListingsScreen";
import {SingleListingScreen} from "@screens/AppNavigator/ListingsNavigator/screens/SingleListingScreen";
import {tailwind} from "@tailwind";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AddCategory} from "@screens/AppNavigator/ListingsNavigator/screens/AddCategory";
import {AddOption} from "@screens/AppNavigator/ListingsNavigator/screens/AddOption";
import {AddMenu} from "@screens/AppNavigator/ListingsNavigator/screens/AddMenu";
import {ListingCategoryI, ListingMenuI, ListingOptionGroupI} from "@nanahq/sticky";
import {SingleMenu} from "@screens/AppNavigator/ListingsNavigator/screens/SingleMenu";
import {AddScheduledListing} from "@screens/AppNavigator/ListingsNavigator/screens/AddScheduledListing";


export interface ListingsParams {
    GetListing: {
        listings: string
    } | undefined

    SingleMenu: {
        menu: ListingMenuI
    } | undefined
    AddOption: {
        option: ListingOptionGroupI
    } | undefined
    AddCategory: {
        category: ListingCategoryI
    } | undefined

    [key: string]: undefined | object;
}
const ListingsStack = createStackNavigator<ListingsParams>();

export function ListingsNavigator(): JSX.Element {
    const insets = useSafeAreaInsets()
    return (
        <ListingsStack.Navigator
            initialRouteName={ListingsScreenName.Listings}
            screenOptions={{
                headerLeft: () => <></>,
                headerTitle: 'Listings',
                headerTitleAlign: 'left',
                headerTitleStyle: tailwind('text-xl'),
                headerStyle: [tailwind(''), {
                    shadowOpacity: 8,
                }],
                headerShown: true
            }}
        >

            <ListingsStack.Screen
                component={ListingsScreen}
                name={ListingsScreenName.Listings}
                options={{
                    headerShown: true,
                    headerTitle: 'Menu & Listings'
                }}
            />


            <ListingsStack.Screen
                component={SingleListingScreen}
                name={ListingsScreenName.GET_LISTING}
                options={{
                    headerShown: false
                }}
            />

            <ListingsStack.Screen
                component={AddCategory}
                name={ListingsScreenName.ADD_CATEGORY}
                options={{
                    headerShown: true,
                    headerTitle: 'Add Category',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'left',
                    headerTitleStyle: tailwind('text-xl'),
                }}
            />

            <ListingsStack.Screen
                component={AddScheduledListing}
                name={ListingsScreenName.SCHEDULED}
                options={{
                    headerShown: true,
                    headerTitle: 'New Scheduled Listing',
                    headerTitleAlign: 'left',
                    headerTitleStyle: tailwind('text-xl'),
                }}
            />
            <ListingsStack.Screen
                component={AddOption}
                name={ListingsScreenName.ADD_OPTION}
                options={{
                    headerShown: true,
                    headerTitle: 'Add Menu Option',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'left',
                    headerTitleStyle: tailwind('text-xl'),
                }}
            />

            <ListingsStack.Screen
                component={AddMenu}
                name={ListingsScreenName.ADD_LISTING}
                options={{
                    headerShown: true,
                    headerTitle: 'Add Menu',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'left',
                    headerTitleStyle: tailwind('text-xl'),
                }}
            />
            <ListingsStack.Screen
                component={SingleMenu}
                name={ListingsScreenName.SINGLE_MENU}
                options={{
                    headerShown: true,
                    headerTitle: 'Menu'
                }}
            />
        </ListingsStack.Navigator>
    );
}
