import {Image, StyleProp, Text, TouchableOpacity, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {DeliveryI, OrderI, VendorSettingsI} from "@nanahq/sticky";
import { PropsWithChildren } from "react";
import { calculatePreorderDate, calculateOnDemandDeliveryDate } from "../../../../../utils/date";
import * as Linking from 'expo-linking'
export function OrdersCard ({order, onPress, style, vendorSettings, deliveryInfo}: {deliveryInfo?: DeliveryI ,order: OrderI, vendorSettings?: VendorSettingsI,  onPress?: (order: OrderI) => void, style?: StyleProp<any>}): JSX.Element {

    return (
        <TouchableOpacity
            onPress={() => {
                if (onPress !== undefined) {
                    onPress(order)
                }
            }}
            style={[
            tailwind('flex p-3  bg-white flex-col  rounded-lg  my-2 w-full border-0.5 border-brand-black-500', {
            }),
            style
        ]}>
            <View style={tailwind('flex flex-row items-center justify-between  w-full')}>
                    <View style={tailwind('flex flex-row items-center')}>
                        <Image source={{uri: order.listing.photo}} style={tailwind('rounded-full  h-12 w-12 border-2', {
                            'border-success-500 ': order.orderType === 'PRE_ORDER',
                            'border-blue-500 ': order.orderType === 'ON_DEMAND'
                        })}/>
                        <Text style={tailwind('text-sm font-bold text-brand-black-500 ml-3')}>{order.listing.name}</Text>
                    </View>
                    <Text style={tailwind('text-sm font-semibold text-brand-black-500')}>{`₦${order.orderBreakDown.orderCost}`}</Text>
            </View>
            {deliveryInfo === undefined ? (

                <View style={tailwind('flex flex-col w-full border-t-0.5  mt-2 py-2 border-gray-300')}>
                    <View style={tailwind('flex flex-row w-full justify-between items-center mb-2')}>
                        <OrderCardItem
                            title="Order type"
                        >
                            <View style={tailwind('bg-brand-black-500 flex flex-row justify-center items-center rounded-lg mt-1  p-1 ')}>
                                <Text style={tailwind('font-semibold text-xs' ,{
                                    'text-success-500': order.orderType === 'PRE_ORDER' ,
                                    'text-blue-500': order.orderType === 'ON_DEMAND'
                                })}>
                                    {order.orderType === 'ON_DEMAND' ? 'INSTANT' : 'PRE ORDER'}
                                </Text>
                            </View>
                        </OrderCardItem>
                        <OrderCardItem
                            title="Quantity"
                            text={order.quantity}
                        />
                    </View>
                    <OrderCardItem
                        title="Pick up time"
                    >
                        <View style={tailwind('flex flex-row items-center')}>
                            <Text style={tailwind('font-semibold text-xs text-brand-black-500 mr-3')}>
                                {
                                    order.orderType === 'PRE_ORDER' ? calculatePreorderDate(order.orderDeliveryScheduledTime)
                                        :  calculateOnDemandDeliveryDate(vendorSettings?.operations?.preparationTime ?? 0, order.createdAt)
                                }
                            </Text>
                            <View style={tailwind('bg-gray-300 rounded-full flex flex-row items-center justify-center w-7 h-7 ')}>
                                <IconComponent iconType="MaterialIcons" name='delivery-dining' size={22} style={tailwind('text-brand-black-500')} />
                            </View>
                        </View>
                    </OrderCardItem>
                </View>
            ) : (<DeliveryDetails details={deliveryInfo} />)}
        </TouchableOpacity>
    )
}


export function DeliveredOrderCard (props: { order: OrderI, onPress?: (order: OrderI) => void, style?: StyleProp<any>}): JSX.Element {
    return (
        <TouchableOpacity
            onPress={() => {
                if (props.onPress !== undefined) {
                    props.onPress(props.order)
                }
            }}
            style={[
            tailwind('flex p-3 flex-row my-2  bg-white justify-between items-center w-full border-0.5 border-brand-black-500'),
            props.style
        ]}>
            <View style={tailwind('flex flex-col')}>
                <Text style={tailwind('font-semibold text-xs')}>{props.order.listing.name}</Text>
                <Text style={tailwind('font-semibold text-xs')}>₦{props.order.listing.price}</Text>
            </View>


                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('font-semibold text-xs')}>Delivered: Tuesday</Text>
                        <Text style={tailwind('font-semibold text-xs')}>{props.order.updatedAt}</Text>
                    </View>
                    <IconComponent iconType='Feather' name='check-square'  size={26} style={tailwind('text-green-500')}/>

        {/* ): <DeliveryDetails details={props.deliveryInfo} />} */}
        </TouchableOpacity>
    )
}



export function OrderCardItem (props: PropsWithChildren<{text?: string, title: string, titleStyle?: any, textStyle?: any}>): JSX.Element {
    return (
        <View style={tailwind('flex flex-col')}>
        <Text style={[tailwind('font-semibold text-sm'), props.titleStyle]}>{props.title}</Text>
           {props.children !== undefined ?
            props.children
           : (
            <Text style={[tailwind('font-semibold text-xs'), props.textStyle]}>
            {props.text}
           </Text>
           )}
     </View>
    )
}

export function DeliveryDetails ({details}: { details:DeliveryI,  }): JSX.Element {
    const callPhoneNumber = () => {
        const phoneNumber = details.driver.phone;
        void Linking.openURL(`tel:${phoneNumber}`);
    };
    return (
        <View style={tailwind('mt-5')} >
            <View>
                <Text style={tailwind('text-gray-400 font-bold')}>Driver information</Text>
            </View>
           <View style={tailwind('flex flex-row items-center justify-between w-full')}>
               <View style={tailwind('flex flex-row items-center uppercase')}>
                   <Text style={tailwind('text-gray-400 font-normal text-lg mr-1')}>{details.driver.firstName.toUpperCase()}</Text>
                   <Text style={tailwind('text-gray-400 font-normal text-lg')}>{details.driver.lastName.toUpperCase()}</Text>
               </View>
               <TouchableOpacity onPress={callPhoneNumber} style={tailwind('p-1 bg-primary-500 rounded border-0.5 border-primary-500')}>
                   <IconComponent iconType="Feather" name='phone-call' size={20} style={tailwind('text-white')} />
               </TouchableOpacity>
           </View>
        </View>
    )
}
