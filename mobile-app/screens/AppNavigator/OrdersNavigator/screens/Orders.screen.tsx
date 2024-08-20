import {getColor, tailwind} from '@tailwind'
import {OrderCategory} from "@screens/AppNavigator/OrdersNavigator/components/OrderCatergory";
import {RootState, useAppSelector} from "@store/index";
import { useCallback, useEffect, useRef, useState} from "react";
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

import {OrderI, OrderStatus, VendorApprovalStatusEnum, VendorOperationType} from '@nanahq/sticky'
import {StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {OrderScreenName} from "@screens/AppNavigator/OrdersNavigator/OrderScreenName.enum";

const LOCATION_MODAL_NAME = 'LOCATION_MODAL'
const DATA = (type: VendorOperationType)  => {
    const defaultData = []

    if(type === 'ON_DEMAND') {
        defaultData.push({key: 'demand', title: 'Instant'})
    } else if (type === 'PRE_ORDER') {
        defaultData.push({key: 'pre', title: 'Pre order'})
    } else if (type === 'PRE_AND_INSTANT') {
        defaultData.push({key: 'pre', title: 'Pre order'}, {key: 'demand', title: 'Instant'})
    }

    return [...defaultData,
        {key: 'courier', title: 'Ready'},
        {key: 'delivered', title: 'Delivered'},
    ]
}

type OrdersScreenNavigationProps = StackScreenProps<OrderParamsList, OrderScreenName.ORDERS>
export function OrdersScreen ({navigation}: OrdersScreenNavigationProps): JSX.Element {
    // State selectors
    const {orders, hasFetchedOrders, fetchingOrders} = useAppSelector((state: RootState) => state.orders )
    const {profile, hasFetchedProfile} = useAppSelector((state: RootState) => state.profile )
    const [index, setIndex] = useState<number>(DATA(profile.settings?.operations?.deliveryType ?? 'PRE_AND_INSTANT').findIndex(d => d.key.includes('demand') || d.key.includes('pre') ));
    const [routes, setRoutes] = useState<Array<{key: string, title: string}>>(DATA(profile.settings?.operations?.deliveryType ?? 'PRE_ORDER'));
    const [showProfileCompleteMsg, setShowProfileCompleteMsg]  = useState<boolean>(false)
    const [showAccountApprovalMsg, setShowAccountApprovalMsg]  = useState<boolean>(false)

    const bottomSheetModalRef = useRef<any>(null)
    const layout = useWindowDimensions();

    const { dismiss } = useBottomSheetModal();



    useEffect(() => {
        if(profile.settings?.operations?.deliveryType !== undefined) {
            setIndex(DATA(profile.settings?.operations?.deliveryType).findIndex(d => d.key.includes('pre') || d.key.includes('demand') ))
            setRoutes(DATA(profile.settings?.operations?.deliveryType))
        }
    }, [profile.settings?.operations?.deliveryType])

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <></>,
            headerRight: () => (
                <View style={tailwind('mx-3 w-full')}>
                    <OrderHeaderStatus status={profile.status as any} />
                </View>
            ),
            headerTitle: 'My Orders',
            headerTitleAlign: 'left',
            headerTitleStyle: tailwind('text-xl'),
            headerStyle: [tailwind(''), {
                shadowOpacity: 8,
            }],
            headerShown: true
        })
    }, [profile.status])

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
            fetchingOrders={fetchingOrders}
            vendorSetting={profile.settings}
            orders={getFulfilledOrders()}
            type={OrderStatus.FULFILLED}
        />,
        courier:  () => <OrderCategory
            fetchingOrders={fetchingOrders}
            vendorSetting={profile.settings}
            orders={readyForPickup()}
            type={OrderStatus.COURIER_PICKUP}
        />,

        pre:  () => <OrderCategory
            fetchingOrders={fetchingOrders}
            vendorSetting={profile.settings}

        orders={getPreOrders()}
        type={'PRE_ORDER'}
    />,
    demand:  () => <OrderCategory
        fetchingOrders={fetchingOrders}
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
         <View
             style={tailwind('w-full bg-white h-full flex-col flex pb-5')}
         >
             <View testID="OrdersScreen" style={tailwind('px-3.5 py-5')}>
                 {showProfileCompleteMsg && (<CompleteProfileMsg type="PROFILE" />)}
                 {!showProfileCompleteMsg && showAccountApprovalMsg  && (<CompleteProfileMsg type="ACCOUNT" />)}
             </View>
             <TabView
                 renderTabBar={(props) => (
                     <TabBar
                         {...props}
                         indicatorStyle={tailwind('bg-primary-500 ')}
                         scrollEnabled
                         tabStyle={tailwind('')}
                         style={tailwind('bg-white w-full')}
                         labelStyle={tailwind('text-black capitalize')}
                         activeColor={getColor('primary-100')}
                         inactiveColor={getColor('gray-500')}

                     />
                 )}
                 style={tailwind('')}
                 navigationState={{ index, routes }}
                 renderScene={renderScene}
                 onIndexChange={setIndex}
                 initialLayout={{ width: layout.width }}
             />
         </View>
         <LocationModal promptModalName={LOCATION_MODAL_NAME} modalRef={bottomSheetModalRef}>
             <LocationModalContent requestLocation={requestLocation} />
         </LocationModal>
     </>
    )
}
