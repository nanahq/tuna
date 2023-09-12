import {SafeAreaView} from "react-native-safe-area-context";
import {getColor, tailwind} from '@tailwind'
import {OrdersStats} from "@screens/AppNavigator/OrdersNavigator/components/OrdersStats";
import {OrderCategory} from "@screens/AppNavigator/OrdersNavigator/components/OrderCatergory";
import {RootState, useAppSelector} from "@store/index";
import {useCallback, useEffect, useRef, useState} from "react";
import {OrderHeaderStatus} from "@screens/AppNavigator/OrdersNavigator/components/OrderHeader";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {useWindowDimensions, View} from "react-native";
import * as Location from "expo-location";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import { AddBankModal as LocationModal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {LocationModalContent} from "@components/LocationModalContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShowToast } from "@components/commons/Toast";
import { CompleteProfileMsg } from "@components/commons/CompleteProfileMsg";
import { LoaderComponentScreen } from "@components/commons/LoaderComponent";

import {OrderI, OrderStatus} from '@nanahq/sticky'




const LOCATION_MODAL_NAME = 'LOCATION_MODAL'
const DATA  = [
    {key: 'demand', title: 'Instant'},
    {key: 'pre', title: 'Pre order'},
    {key: 'courier', title: 'Ready for pickup'},
    {key: 'route', title: 'In-transit'},
    {key: 'delivered', title: 'Delivered'},
]


export function OrdersScreen (): JSX.Element {
    // State selectors
    const {orders, hasFetchedOrders} = useAppSelector((state: RootState) => state.orders )
    const {profile, hasFetchedProfile} = useAppSelector((state: RootState) => state.profile )
    const layout = useWindowDimensions();
    const [index, setIndex] = useState<number>(0);
    const [routes] = useState<Array<{key: string, title: string}>>(DATA);
    const [showProfileCompleteMsg, setShowProfileCompleteMsg]  = useState<boolean>(false)
    const bottomSheetModalRef = useRef<any>(null)
    const { dismiss } = useBottomSheetModal();


    const getFulfilledOrders = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderStatus === OrderStatus.FULFILLED)
    }, [hasFetchedOrders, orders])

    const getPendingOrders = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderStatus === OrderStatus.PROCESSED)
    }, [hasFetchedOrders, orders])


    const getOnDemandOrders = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderType === 'ON_DEMAND' && order.orderStatus === OrderStatus.PROCESSED)
    }, [hasFetchedOrders, orders])


    const getPreOrders = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderType === 'PRE_ORDER' && order.orderStatus === OrderStatus.PROCESSED)
    }, [hasFetchedOrders, orders])

    console.log({profile})

    const ordersInTransit = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderStatus === OrderStatus.IN_ROUTE)
    }, [hasFetchedOrders, orders])

    const readyForPickup = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderStatus === OrderStatus.COURIER_PICKUP)
    },[hasFetchedOrders, orders])
    const renderScene = SceneMap<any>({

        delivered:  () => <OrderCategory
            vendorSetting={profile.settings}
            orders={getFulfilledOrders()}
            type={OrderStatus.FULFILLED}
        />,
        courier:  () => <OrderCategory
            vendorSetting={profile.settings}
            orders={readyForPickup()}
            type={OrderStatus.COURIER_PICKUP}
        />,
        route:  () => <OrderCategory
            vendorSetting={profile.settings}
            orders={ordersInTransit()}
            type={OrderStatus.IN_ROUTE}
        />,
        pre:  () => <OrderCategory
            vendorSetting={profile.settings}

        orders={getPreOrders()}
        type={'PRE_ORDER'}
    />,
    demand:  () => <OrderCategory
        vendorSetting={profile.settings}
    orders={getOnDemandOrders()}
    type={'ON_DEMAND'}
/>
   });

    useEffect(() => {
        void openModal()
    }, [])

    useEffect(() => {
        checkProfileCompleteStatus()
    }, [hasFetchedProfile])


    async function requestLocation (): Promise<void> {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            ShowToast('error', 'Permission denied')
        }
       const {coords: {longitude, latitude}} = await Location.getCurrentPositionAsync({
           accuracy: 6
       });

        const obj = {
            longitude,
            latitude
        }


        await AsyncStorage.setItem('LOCATION_COORDS', JSON.stringify(obj))
        dismiss(LOCATION_MODAL_NAME)
    }


    async function openModal (): Promise<void> {
        const locationCoords = await AsyncStorage.getItem('LOCATION_COORDS')
        if (locationCoords !== null) {
           return
        }
        bottomSheetModalRef.current?.present();
    }

     function checkProfileCompleteStatus (): void {
        if (!hasFetchedProfile ) {
            setShowProfileCompleteMsg(false)
            return
        }

        if (profile.settings?.operations === undefined) {
            setShowProfileCompleteMsg(true)
        }

        if (profile.settings?.payment === undefined) {
            setShowProfileCompleteMsg(true)
        }
    }

    if (!hasFetchedOrders) {
        return <LoaderComponentScreen />
    }

    return (
     <>
         <SafeAreaView
             style={tailwind('w-full bg-white h-full flex-col flex pb-5')}
         >
             <View testID="OrdersScreen" style={tailwind('px-3.5 py-5')}>
                <OrderHeaderStatus status={profile.status as any} />
                 {showProfileCompleteMsg && (<CompleteProfileMsg />)}
                 <OrdersStats
                     hasFetchedOrders={hasFetchedOrders}
                     completed={getFulfilledOrders().length}
                     cancelled={ordersInTransit().length}
                     pending={getPendingOrders().length}
                 />
             </View>
             <TabView
                 renderTabBar={(props) => (
                     <TabBar
                         {...props}
                         indicatorStyle={tailwind('bg-primary-500')}
                         scrollEnabled
                         style={tailwind('bg-white w-full')}
                         labelStyle={tailwind('text-brand-black-500 font-semibold text-sm')}
                         activeColor={getColor('primary-500')}
                     />
                 )}
                 navigationState={{ index, routes }}
                 renderScene={renderScene}
                 onIndexChange={setIndex}
                 initialLayout={{ width: layout.width }}
             />
         </SafeAreaView>
         <LocationModal promptModalName={LOCATION_MODAL_NAME} modalRef={bottomSheetModalRef}>
             <LocationModalContent requestLocation={requestLocation} />
         </LocationModal>
     </>
    )
}
