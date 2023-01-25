import {SafeAreaView} from "react-native-safe-area-context";
import {getColor, tailwind} from '@tailwind'
import {OrdersStats} from "@screens/AppNavigator/OrdersNavigator/components/OrdersStats";
import {OrderCategory} from "@screens/AppNavigator/OrdersNavigator/components/OrderCatergory";
import {useSelector} from "react-redux";
import {RootState} from "@store/index";
import {useCallback, useEffect, useRef, useState} from "react";
import {Order, OrderStatus} from "@store/orders.reducer";
import {OrderHeaderStatus} from "@screens/AppNavigator/OrdersNavigator/components/OrderHeader";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {useWindowDimensions, View} from "react-native";
import * as Location from "expo-location";
import {showToast} from "@screens/AppNavigator/SettingsNavigator/screens/RestaurantProfile";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import {AddBankModal as LocationModal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {LocationModalContent} from "@components/LocationModalContent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MODAL_NAME = 'LOCATION_MODAL'

const DATA = [
    {key: 'Pending', title: 'Pending'},
    {key: 'Delivered', title: 'Delivered'},
    {key: 'route', title: 'In-transit'},
]
export function OrdersScreen (): JSX.Element {
    const {orders, hasFetchedOrders} = useSelector((state: RootState) => state.orders )
    const layout = useWindowDimensions();
    const [index, setIndex] = useState<number>(0);
    const [routes, _setRoutes] = useState<Array<{key: string, title: string}>>(DATA);

    const bottomSheetModalRef = useRef<any>(null)
    const { dismiss } = useBottomSheetModal();


    const filterOrders = useCallback((type: 'completed' | 'pending' | 'cancelled'): number => {
        return orders.filter((order: Order) => {
            switch (type) {
                case "completed":
                    return order.orderStatus === OrderStatus.FULFILLED
                case "pending":
                    return order.orderStatus in [OrderStatus.IN_ROUTE, OrderStatus.COLLECTED, OrderStatus.PROCESSED]
                case "cancelled":
                    return order.orderStatus === OrderStatus.CANCELLED
            }
        }).length
    }, [orders, hasFetchedOrders])

    const getPendingOrders = useCallback(() => {
        return orders.filter((order: Order) =>  order.orderStatus in [OrderStatus.IN_ROUTE, OrderStatus.COLLECTED, OrderStatus.PROCESSED])
            .slice(0, 4)
    }, [hasFetchedOrders, orders])

    const getFulfilledOrders = useCallback(() => {
        return orders.filter((order: Order) =>  order.orderStatus === OrderStatus.FULFILLED)
            .slice(0, 4)
    }, [hasFetchedOrders, orders])

    const renderScene = SceneMap<any>({
        Pending: () => <OrderCategory
            orders={getFulfilledOrders()}
            hasFetchedOrders={hasFetchedOrders}
            type='PENDING'
            testId='OrdersScreen.OrderCategory.PENDING'
        />,
        Delivered:  () => <OrderCategory
            orders={getFulfilledOrders()}
            hasFetchedOrders={hasFetchedOrders}
            type='PENDING'
            testId='OrdersScreen.OrderCategory.PENDING'
        />,
        route:  () => <OrderCategory
            orders={getFulfilledOrders()}
            hasFetchedOrders={hasFetchedOrders}
            type='PENDING'
            testId='OrdersScreen.OrderCategory.PENDING'
        />,

    });


    useEffect(() => {
        void openModal()
    }, [])

    async function requestLocation (): Promise<void> {

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            showToast('error', 'Permission denied')
        }
       const {coords: {longitude, latitude}} = await Location.getCurrentPositionAsync({
           accuracy: 6
       });

        const obj = {
            longitude,
            latitude
        }


        await AsyncStorage.setItem('LOCATION_COORDS', JSON.stringify(obj))
        dismiss(MODAL_NAME)
    }


    async function openModal (): Promise<void> {
        const locationCoords = await AsyncStorage.getItem('LOCATION_COORDS')
        if (locationCoords !== null) {
           return
        }
        bottomSheetModalRef.current?.present();
    }
    return (
     <>
         <SafeAreaView
             style={tailwind('w-full bg-white h-full flex-col flex pb-5')}
         >
             <View testID="OrdersScreen" style={tailwind('px-3.5 py-5')}>
                 <OrderHeaderStatus />
                 <OrdersStats
                     hasFetchedOrders={hasFetchedOrders}
                     completed={filterOrders('completed')}
                     cancelled={filterOrders('cancelled')}
                     pending={filterOrders('pending')}
                 />
             </View>
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
                 // style={tailwind('mt-16')}
             />
         </SafeAreaView>
         <LocationModal promptModalName={MODAL_NAME} modalRef={bottomSheetModalRef}>
             <LocationModalContent requestLocation={requestLocation} />
         </LocationModal>
     </>
    )
}
