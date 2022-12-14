import {Text, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/OrdersNavigator/OrdersNavigator";
import {SafeAreaView} from "react-native-safe-area-context";
import {tailwind} from '@tailwind'
import {OrderSection} from "@screens/AppNavigator/OrdersNavigator/components/OrderItemRow";
import {IconButton} from "@components/commons/buttons/IconButton";
import {OrderCompleteButton} from "@screens/AppNavigator/OrdersNavigator/components/OrderCompleteButton";
import {OrderStatus} from "@typings/Orders.type";
import {OrderQrCode} from "@screens/AppNavigator/OrdersNavigator/components/OrderQrCode";


type GetOrderProps = StackScreenProps<OrderParamsList, "GetOrders">

export function GetOrder ({route, navigation}: GetOrderProps ): JSX.Element {
      function goBack (): void {
          navigation.goBack()
      }
    return (
        <SafeAreaView style={tailwind('bg-white')}>
            <View style={tailwind('px-5 pt-5 h-full bg-white')}>
                <IconButton
                    iconName='arrow-left'
                    iconType='Feather'
                    iconSize={24}
                    iconStyle={tailwind('text-brand-black-500')}
                    style={tailwind('mb-2')}
                    onPress={goBack}
                />
                <OrderSection heading='Order details' testId='GetOrder.OrderDetails'>
                  <View style={tailwind('flex flex-row items-center justify-between w-full mb-2')}>
                      <OrderSection.Row title='Quantity:' text='2' />
                      <OrderSection.Row title='Pickup time:' text='2:30 AM' />
                  </View>
                    <OrderSection.Row title='Delivery Day:' text='Tomorrow'  containerStyle={tailwind('mb-2')}/>
                    <OrderSection.Row title='Special Note:' text='Please do not make it super spicy' />
                </OrderSection>
               <View style={tailwind('flex flex-row w-full mt-5')}>
                   <OrderSection heading='Add ons' testId='GetOrder.Addons' fullWidth={false} width={tailwind('w-1/2')}>
                       <OrderSection.Row title='-' text='Zobo'  containerStyle={tailwind('mb-2')}/>
                       <OrderSection.Row title='-' text='Kunun Aya' />
                   </OrderSection>
                   <OrderSection heading='Order Options' testId='GetOrder.Options' fullWidth={false} width={tailwind('w-1/2')}>
                       <OrderSection.Row title='-' text='Meat'  containerStyle={tailwind('mb-2')}/>
                       <OrderSection.Row title='-' text='Chicken' />
                   </OrderSection>
               </View>
                <View style={tailwind('flex flex-row items-center justify-between w-full mt-5')}>
                    <OrderSection.Row title="Order Value" text="1200" titleStyle={tailwind('font-semibold')} />
                    <View style={tailwind('bg-green-500 rounded-lg py-0.5 px-2 flex justify-center items-center')}>
                        <Text style={tailwind('text-white text-xs text-center')}>Delivered</Text>
                    </View>
                </View>
                <View style={tailwind('flex flex-row w-full items-center justify-center mt-12')}>
                    <OrderCompleteButton
                        status={OrderStatus.COLLECTED}
                        orderid={route?.params?.orderid}
                    />
                </View>
                <View style={tailwind('flex flex-row justify-center items-center w-full mt-10')}>
                    <OrderQrCode orderId={ route?.params?.orderid ?? 'INVALID_ORDER'} />
                </View>
            </View>
        </SafeAreaView>
    )
}
