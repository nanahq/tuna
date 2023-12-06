import {SafeAreaView} from "react-native-safe-area-context";
import {getColor, tailwind} from '@tailwind'
import {OrderCategory} from "@screens/AppNavigator/OrdersNavigator/components/OrderCatergory";
import {RootState, useAppSelector} from "@store/index";
import {ReactElement, useCallback, useEffect, useRef, useState} from "react";
import {OrderHeaderStatus} from "@screens/AppNavigator/OrdersNavigator/components/OrderHeader";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {useWindowDimensions, View, Text} from "react-native";
import * as Location from "expo-location";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import { AddBankModal as LocationModal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {LocationModalContent} from "@components/LocationModalContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShowToast } from "@components/commons/Toast";
import { CompleteProfileMsg } from "@components/commons/CompleteProfileMsg";
import { LoaderComponentScreen } from "@components/commons/LoaderComponent";

import {OrderI, OrderStatus, VendorApprovalStatusEnum} from '@nanahq/sticky'

const LOCATION_MODAL_NAME = 'LOCATION_MODAL'
const DATA  = [
    {key: 'demand', title: 'Instant'},
    {key: 'pre', title: 'Pre order'},
    {key: 'courier', title: 'Ready'},
    {key: 'delivered', title: 'Delivered'},
]


export function OrdersScreen (): JSX.Element {
    // State selectors
    const {orders, hasFetchedOrders} = useAppSelector((state: RootState) => state.orders )
    const {profile, hasFetchedProfile} = useAppSelector((state: RootState) => state.profile )

    const [index, setIndex] = useState<number>(0);
    const [routes] = useState<Array<{key: string, title: string}>>(DATA);
    const [showProfileCompleteMsg, setShowProfileCompleteMsg]  = useState<boolean>(false)
    const [showAccountApprovalMsg, setShowAccountApprovalMsg]  = useState<boolean>(false)

    const bottomSheetModalRef = useRef<any>(null)
    const layout = useWindowDimensions();

    const { dismiss } = useBottomSheetModal();

    const getFulfilledOrders = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderStatus === OrderStatus.FULFILLED)
    }, [hasFetchedOrders, orders])

    const getOnDemandOrders = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderType === 'ON_DEMAND' && order.orderStatus === OrderStatus.PROCESSED)
    }, [hasFetchedOrders, orders])


    const getPreOrders = useCallback(() => {
        return orders.filter((order: OrderI) =>  order.orderType === 'PRE_ORDER' && order.orderStatus === OrderStatus.PROCESSED)
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

        if((profile as any).acc_status === VendorApprovalStatusEnum.PENDING){
            setShowAccountApprovalMsg(true)
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
                 <View style={tailwind('flex flex-col w-full')}>
                     <Text style={tailwind('font-bold text-2xl')}>Orders</Text>
                     <OrderHeaderStatus status={profile.status as any} />
                 </View>
                 {showProfileCompleteMsg && (<CompleteProfileMsg type="PROFILE" />)}
                 {showAccountApprovalMsg  && !showAccountApprovalMsg && (<CompleteProfileMsg type="ACCOUNT" />)}
             </View>
             <TabView
                 renderTabBar={(props) => (
                     <TabBar
                         {...props}
                         indicatorStyle={tailwind('hidden')}
                         scrollEnabled
                         tabStyle={tailwind('bg-white mb-2 mx-1 border-0.5 border-black rounded')}
                         style={tailwind('bg-white w-full')}
                         labelStyle={tailwind('text-black font-bold capitalize text-xs')}
                         activeColor={getColor('primary-500')}
                     />
                 )}
                 style={tailwind('')}
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
