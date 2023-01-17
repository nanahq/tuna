import {DaysList, DaysListMapper} from "@typings/Days";
import {useWindowDimensions} from 'react-native'
import {getColor, tailwind} from '@tailwind'

import {useEffect, useState} from 'react';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";
import {CategoryType} from "@screens/AppNavigator/OrdersNavigator/components/OrderCatergory";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {NavigationProp} from "@react-navigation/native";

const DATA = [
    {key: 'MONDAY', title: 'MONDAY'},
    {key: 'TUESDAY', title: 'TUESDAY'},
    {key: 'WEDNESDAY', title: 'WEDNESDAY'},
    {key: 'THURSDAY', title: 'THURSDAY'},
    {key: 'FRIDAY', title: 'FRIDAY'},
    {key: 'SATURDAY', title: 'SATURDAY'},
    {key: 'SUNDAY', title: 'SUNDAY'},
]

export const OrdersMock: Array<{order: any, onPress: (navigation: NavigationProp<any> ) => void, type: CategoryType}> = [
    {
        order: {id: 1},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 2},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 3},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 4},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 5},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 6},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 7},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 8},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 9},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 10},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 71},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 18},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 91},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    },
    {
        order: {id: 101},
        onPress: (navigation) => navigation.navigate('GetOrders', {params : {orderid: 'a0b652f2-5ca4-4bbe-8561-7ac45ab8f32d'}}),
        type: 'PENDING'
    }
]



export const OrderList = (props: {day: keyof DaysList}) => {
    const RenderItem = ({item}: ListRenderItemInfo<{onPress: (navigation: NavigationProp<any>) => void,  type: CategoryType, order: any}>) => (
        <OrdersCard {...item} style={tailwind('mb-4 px-4')}/>
    )
    return (
            <FlashList
                contentContainerStyle={tailwind(' bg-white')}
                data={OrdersMock}
                renderItem={(props) => <RenderItem {...props} />}
                keyExtractor={item => item.order.id}
                estimatedItemSize={30}
            />
    )
}

const renderScene = SceneMap<any>({
    MONDAY: () => <OrderList day='MONDAY' />,
    TUESDAY:  () => <OrderList day='TUESDAY' />,
    WEDNESDAY:  () => <OrderList day='WEDNESDAY' />,
    THURSDAY:  () => <OrderList day='THURSDAY' />,
    FRIDAY:  () => <OrderList day='FRIDAY' />,
    SATURDAY:  () => <OrderList day='SATURDAY' />,
    SUNDAY:  () => <OrderList day='SUNDAY' />
});

export default function OrdersTabs() {
    const {top: topInsets} = useSafeAreaInsets()
    const layout = useWindowDimensions();
    const [index, setIndex] = useState<number>(0);
    const [routes, setRoutes] = useState<Array<{key: string, title: string}>>(DATA);


    useEffect(() => {
        const dt = new Date()
        const currentDay = DaysListMapper[dt.getDay()]

        let days = Object.values(DaysListMapper)
        days = days.filter(day => day !== currentDay);
        days.unshift(currentDay);

        const tabsTitles = days.map(day => ({
            key: day,
            title: day
        }))
        setRoutes(tabsTitles)

    }, [])

    return (
        <TabView
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={tailwind('bg-secondary-500')}
                    tabStyle={{ width: 120 }}
                    scrollEnabled={true}
                    style={[tailwind('bg-white'), {paddingTop: topInsets, }]}
                    labelStyle={tailwind('text-brand-black-500')}
                    activeColor={getColor('secondary-500')}
                />
            )}

            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}

