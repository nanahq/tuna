// import { DaysListMapper} from "@typings/Days";
// import {useWindowDimensions} from 'react-native'
import { tailwind} from '@tailwind'

// import {useEffect, useState} from 'react';
// import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
// import {useSafeAreaInsets} from "react-native-safe-area-context";
import {OrdersCard} from "@screens/AppNavigator/OrdersNavigator/components/OrderCard";

import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import { EmptyAnimation } from "@components/lottie/Empty";

// const DATA = [
//     {key: 'MONDAY', title: 'MONDAY'},
//     {key: 'TUESDAY', title: 'TUESDAY'},
//     {key: 'WEDNESDAY', title: 'WEDNESDAY'},
//     {key: 'THURSDAY', title: 'THURSDAY'},
//     {key: 'FRIDAY', title: 'FRIDAY'},
//     {key: 'SATURDAY', title: 'SATURDAY'},
//     {key: 'SUNDAY', title: 'SUNDAY'},
// ]




export function OrderList() {
    function RenderItem({item}: ListRenderItemInfo<any>) {
  return <OrdersCard {...item} style={tailwind('mb-4 px-4')}/>
}
    return (
            <FlashList
                contentContainerStyle={tailwind(' bg-white')}
                data={[]}
                renderItem={(props) => <RenderItem {...props} />}
                keyExtractor={item => item}
                estimatedItemSize={30}
                ListEmptyComponent={<EmptyAnimation text='Orders empty' />}
            />
    )
}

// const renderScene = SceneMap<any>({
//     MONDAY: () => <OrderList day='MONDAY' />,
//     TUESDAY:  () => <OrderList day='TUESDAY' />,
//     WEDNESDAY:  () => <OrderList day='WEDNESDAY' />,
//     THURSDAY:  () => <OrderList day='THURSDAY' />,
//     FRIDAY:  () => <OrderList day='FRIDAY' />,
//     SATURDAY:  () => <OrderList day='SATURDAY' />,
//     SUNDAY:  () => <OrderList day='SUNDAY' />
// });

export default function OrdersTabs() {
    // const {top: topInsets} = useSafeAreaInsets()
    // const layout = useWindowDimensions();
    // const [index, setIndex] = useState<number>(0);
    // const [routes, setRoutes] = useState<Array<{key: string, title: string}>>(DATA);


    // useEffect(() => {
    //     const dt = new Date()
    //     const currentDay = DaysListMapper[dt.getDay()]

    //     let days = Object.values(DaysListMapper)
    //     days = days.filter(day => day !== currentDay);
    //     days.unshift(currentDay);

    //     const tabsTitles = days.map(day => ({
    //         key: day,
    //         title: day
    //     }))
    //     setRoutes(tabsTitles)

    // }, [])

    // return (
    //     <TabView
    //         renderTabBar={(props) => (
    //             <TabBar
    //                 {...props}
    //                 indicatorStyle={tailwind('bg-primary-500')}
    //                 tabStyle={{ width: 120 }}
    //                 scrollEnabled
    //                 style={[tailwind('bg-white'), {paddingTop: topInsets, }]}
    //                 labelStyle={tailwind('text-brand-black-500')}
    //                 activeColor={getColor('primary-500')}
    //             />
    //         )}

    //         navigationState={{ index, routes }}
    //         renderScene={renderScene}
    //         onIndexChange={setIndex}
    //         initialLayout={{ width: layout.width }}
    //     />
    // );

    return <></>
}

