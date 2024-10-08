import {StyleProp, Text, View, ViewStyle} from 'react-native'
import {tailwind} from "@tailwind";
import {PropsWithChildren, useEffect} from "react";

import * as SplashScreen from "expo-splash-screen";

import {useLogger} from "@contexts/NativeLoggingProvider";
import {QuickActions} from "@screens/AppNavigator/HomeNavigator/Components/QuickActions";
import {useNavigation} from "@react-navigation/native";
import {QuickLinks} from "@screens/AppNavigator/HomeNavigator/Components/QuickLinks";

import * as Device from "expo-device";

import {LinearGradient} from 'expo-linear-gradient'
import {useDispatch} from "react-redux";
import {fetchProfile} from '@store/profile.reducer'
import {fetchOrders} from "@store/orders.reducer";

export function HomeScreen (): JSX.Element {
    const logger = useLogger()
    const navigation = useNavigation<any>()
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(fetchProfile() as any)
        dispatch(fetchOrders() as any)
    }, [])

    // Hide splashscreen when first page is loaded to prevent white screen
    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
    }, []);

    return (
        <View style={tailwind('bg-white h-full pt-2.5 px-5')}>
            <EarningsCard>
                <EarningsCard.Period earnings={20000} title="Total sale" testID="EarningsCard.TS"  />
                <EarningsCard.Period earnings={2000} title="24 hours sale" testID="EarningsCard.24"  style={tailwind('border-l-0.5 border-white pl-4')} />
            </EarningsCard>

            <QuickActions>
                <QuickActions.Action
                    iconName='truck'
                    testId='CheckOrder'
                    label='New orders'
                    onPress={() => navigation.navigate("ORDERS", {screen: "PendingOrders", merge: true})}
                />
                <QuickActions.Action
                    iconName='edit'
                    testId='EditProfile'
                    label='Edit profile'
                    onPress={() => navigation.navigate("SETTINGS", {screen: "AccountProfile"})}
                />
                <QuickActions.Action
                    iconName='headphones'
                    testId='support'
                    label='Support'
                    onPress={() => navigation.navigate("Withdraw")}
                />
                <QuickActions.Action
                    iconName='plus'
                    testId='AddListing'
                    label='Add listing'
                    onPress={() => navigation.navigate("LISTINGS", {screen: "AddListing", merge: true})}
                />
            </QuickActions>

            <QuickLinks>
                <QuickLinks.Link
                    testId='Orders'
                    label='Orders'
                    onPress={() => navigation.navigate('Orders')}
                />
                <QuickLinks.Link
                    testId='Stats'
                    label='Stats'
                    onPress={() => navigation.navigate('orders')}
                />
                <QuickLinks.Link
                    testId='Earnings'
                    label='Earnings'
                    onPress={() => navigation.navigate('orders')}
                />
                <QuickLinks.Link
                    testId='Promotions'
                    label='Promo'
                    style={tailwind('mt-3')}
                    onPress={() => navigation.navigate('orders')}
                />
            </QuickLinks>
        </View>
    )
}

function EarningsCard (props: PropsWithChildren<{}>): JSX.Element {
    return (
        <LinearGradient
            colors={['#000000', '#434343']}
            testID="HomeScreen.EarningsCard"
            style={tailwind('flex flex-row items-center justify-between bg-primary-500 px-5 py-4', {
            'h-28': Device.osName === 'Android',
            'h-32': Device.osName === 'iOS'
        })}>
            {props.children}
        </LinearGradient>
    )
}


function EarningPeriod (props: {testID: string, title: string, earnings: number, style?: StyleProp<ViewStyle>}): JSX.Element {
  const {earnings, title, style = {}, ...rest} = props
    return (
        <View {...rest} style={[tailwind('flex flex-col  text-white px-2 w-1/2'), style]}>
            <Text style={tailwind('font-semibold text-lg text-white')}>
                {title}
            </Text>
            <Text style={tailwind('font-medium text-lg text-white pt-5')}>
                {`NGN ${earnings}`}
            </Text>
        </View>
    )
}

EarningsCard.Period = EarningPeriod
