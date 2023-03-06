import {Text, View} from 'react-native'
import {getColor, tailwind} from "@tailwind";
import {AppScreenName} from "@screens/AppNavigator/AppNavScreenName";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import * as Device from 'expo-device'
import {IconComponent} from "@components/commons/IconComponent";
import {OrderNavigator} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {ListingsNavigator} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {OrderScreenName} from "@screens/AppNavigator/OrdersNavigator/OrderScreenName.enum";
import {SettingsScreenName} from "@screens/AppNavigator/SettingsNavigator/SettingsScreenName.enum";
import {ListingsScreenName} from "@screens/AppNavigator/ListingsNavigator/ListingsScreenName.enum";
import {HomeScreenName} from "@screens/AppNavigator/HomeNavigator/HomeScreenName.enum";
import {SettingsNavigator} from "@screens/AppNavigator/SettingsNavigator/SettingsNav";
import {WalletNavigator} from "@screens/AppNavigator/WalletNavigator/WalletNavigator";
import {ReviewNavigator} from "@screens/AppNavigator/ReviewNavigator/ReviewNavigator";
import { RootState, useAppSelector } from '@store/index';

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export interface BottomTabParamList {
    Listings: undefined
    Orders: undefined
    Settings: undefined
    Wallet: undefined
    [key: string]: undefined | object
}
const getTabBarLabel = (props: {
    focused: boolean;
    color: string;
    title: string;
}): JSX.Element => (
    <Text style={{ color: props.color, ...tailwind("font-medium text-xs") }}>
        {props.focused ? props.title : props.title}
    </Text>
);

export function BottomTabNavigator ():JSX.Element {
    const {profile} = useAppSelector((state: RootState) => state.profile)
    return (
        <BottomTab.Navigator
            initialRouteName={AppScreenName.ORDERS}
            screenOptions={{
                headerShown: false,
                tabBarLabelPosition: "below-icon",
                tabBarStyle: tailwind(
                    "px-5 py-2 h-24 border-t-0.5 border-brand-black-500 "),
                tabBarActiveTintColor: getColor("primary-500"),
                tabBarInactiveTintColor: getColor("brand-black-500"),
                tabBarItemStyle: tailwind({ "pb-6 pt-2": Device.osName === 'iOS'}),
            }}
        >
            <BottomTab.Screen
                component={OrderNavigator}
                name={AppScreenName.ORDERS}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Orders',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='MaterialIcons' name="takeout-dining"  size={24} color={color}/>
                    ),
                }}
            />
            <BottomTab.Screen
                component={WalletNavigator}
                name={AppScreenName.WALLET}
                options={{
                  
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='Feather' name="credit-card"  size={24} color={color}/>
                    ),
                }}
            />
            <BottomTab.Screen
                component={ListingsNavigator}
                name={AppScreenName.LISTINGS}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Listings',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='Feather' name="list"  size={24} color={color}/>
                    ),
                }}
            />
            <BottomTab.Screen
                component={ReviewNavigator}
                name={AppScreenName.REVIEWS}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Reviews',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='Feather' name="message-circle"  size={24} color={color}/>
                    ),
                }}
            />
            <BottomTab.Screen
                component={SettingsNavigator}
                name={AppScreenName.SETTINGS}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Settings',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                       <View style={tailwind('relative')}>
                         <IconComponent style={tailwind()} iconType='Feather' name="settings"  size={24} color={color}/>
                         {profile.settings?.operations === undefined || profile.settings?.payment === undefined && (<View style={tailwind('absolute z-50 w-2 h-2 rounded-full bg-red-500 top-0 right-0 ')}  />)}
                       </View>
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}


export const AppLinking = {
    [AppScreenName.HOME]: {
        screens: {
            HomeScreen: HomeScreenName.HOME,
        },
    },

    [AppScreenName.LISTINGS]: {
        screens: {
            ListingsScreen: ListingsScreenName.Listings,
        },
    },

    [AppScreenName.ORDERS]: {
        screens: {
            OrdersScreen: OrderScreenName.ORDERS,
        },
    },

    [AppScreenName.SETTINGS]: {
        screens: {
            SettingsScreen: SettingsScreenName.SETTINGS,
        },
    },
    [AppScreenName.WALLET]: {
        screens: {
            WalletScreen: AppScreenName.WALLET,
        },
    }
};


