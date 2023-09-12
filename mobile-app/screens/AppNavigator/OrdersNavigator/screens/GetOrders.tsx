import {Text, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {SafeAreaView} from "react-native-safe-area-context";
import {tailwind} from '@tailwind'
import {OrderSection} from "@screens/AppNavigator/OrdersNavigator/components/OrderItemRow";

import {OrderStatus} from "@nanahq/sticky";
import {OrderQrCode} from "@screens/AppNavigator/OrdersNavigator/components/OrderQrCode";
import { ScrollView } from "react-native-gesture-handler";
import { GoBackButton } from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import { useToast } from "react-native-toast-notifications";
import { useState } from "react";
import { _api } from "@api/_request";
import { useAppDispatch } from "@store/index";
import { fetchOrders } from "@store/orders.reducer";
import { showTost } from "@components/commons/Toast";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import {calculateOnDemandDeliveryDate, calculatePreorderDate} from "../../../../../utils/date";


type GetOrderProps = StackScreenProps<OrderParamsList, "GetOrder">

export function GetOrder ({route: {params}, navigation}: GetOrderProps ): JSX.Element {
    const [loading, setIsloading] = useState<boolean>(false)
    const toast = useToast()
    const dispatch = useAppDispatch()

      function goBack (): void {
          navigation.goBack()
      }


      const updateOrder =async  (): Promise<void> => {
        toast.hideAll()
        setIsloading(true)
        try {
            await _api.requestData<{orderId: string, status: OrderStatus}>({
                method: "put",
                url: 'order/update',
                data: {
                    orderId: params.order._id,
                    status: OrderStatus.COURIER_PICKUP
                }
            })

            dispatch(fetchOrders())
            showTost( toast, 'Order status updated!', 'success')
            navigation.goBack()
        } catch (error: any) {
            showTost( toast,typeof error.message === 'string' ? error.message : error.message[0] ,'error')
        } finally {
            setIsloading(false)
        }
      }

    return (
        <SafeAreaView style={tailwind('bg-white')}>
            <ScrollView style={tailwind('px-5 pb-5 h-full bg-white')}>
                <GoBackButton  onPress={goBack}/>
                <OrderSection heading='Order details'>
                <OrderSection.Row title='Item name: ' text={params.order.listing.name}  titleStyle={tailwind('font-bold')} textStyle={tailwind(' text-lg font-bold')} containerStyle={tailwind('mb-2')}/>
                  <View style={tailwind('flex flex-row items-center justify-between w-full mb-2')}>
                      <OrderSection.Row   titleStyle={tailwind('font-bold')} textStyle={tailwind(' text-lg font-bold')} title='Quantity:' text='2' />
                      <OrderSection.Row   titleStyle={tailwind('font-bold')} textStyle={tailwind(' text-lg font-bold')}  title='Pickup time:' text={(params.order.orderType as any) === 'PRE_ORDER ' ? calculatePreorderDate(params.order.orderDeliveryScheduledTime) :  calculateOnDemandDeliveryDate(30, params.order.createdAt)} />
                  </View>
                    <OrderSection.Row   titleStyle={tailwind('font-medium')} textStyle={tailwind(' text-lg font-bold')} title='Special Note:' text='Please do not make it super spicy' />
                </OrderSection>
               <View style={tailwind('flex flex-row w-full mt-5')}>
                   <OrderSection heading='Options' fullWidth={false} width={tailwind('w-1/2')}>
                       {params.order.options.map(option => (
                       <OrderSection.Row title='-' key={option} text={option}  containerStyle={tailwind('mb-2')}/>
                       ))}
                   </OrderSection>
               </View>
                <View style={tailwind('flex flex-row items-center justify-between w-full mt-5')}>
                    <OrderSection.Row title="Order Value" text={String(params.order.orderBreakDown.orderCost)} titleStyle={tailwind('font-semibold')} />
                    <View style={tailwind('bg-success-600 rounded-lg py-2 px-2 flex justify-center items-center')}>
                        <Text style={tailwind('text-white text-xs font-bold text-center')}>{params.order.orderStatus}</Text>
                    </View>
                </View>
                <View style={tailwind('flex flex-row w-full items-center justify-center mt-12')}>
                {params.order.orderStatus === OrderStatus.PROCESSED && (
                      <GenericButton
                      onPress={updateOrder}
                      loading={loading}
                      disabled={loading}
                      label='Ready for pickup'
                      backgroundColor={tailwind('bg-brand-black-500')}
                      labelColor={tailwind('text-white')}
                      testId=""
                      style={tailwind('w-full')}
                    />
                )}
                </View>
                <View style={tailwind('flex flex-row justify-center items-center w-full mt-10')}>
                    <OrderQrCode orderId={ params.order._id ?? 'INVALID_ORDER'} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
