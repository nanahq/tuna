import {Image, StyleProp, Text, TouchableOpacity, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {DeliveryI, OrderI, VendorSettingsI} from "@nanahq/sticky";
import {PropsWithChildren, useMemo} from "react";
import { calculatePreorderDate, calculateOnDemandDeliveryDate } from "../../../../../utils/date";
import * as Linking from 'expo-linking'
import moment from "moment";
export function OrdersCard ({order, onPress, style, vendorSettings, deliveryInfo}: {deliveryInfo?: DeliveryI ,order: OrderI, vendorSettings?: VendorSettingsI,  onPress?: (order: OrderI) => void, style?: StyleProp<any>}): JSX.Element {
    const listingsName = useMemo(() => {
        return order.listing.map( li => li.name)
            .join(',')
    }, [order.listing])

    return (
        <TouchableOpacity
            onPress={() => {
                if (onPress !== undefined) {
                    onPress(order)
                }
            }}
            style={[
            tailwind('flex p-3  bg-white flex-col  rounded-lg  my-2 w-full border-0.5 border-gray-300', {
            }),
            style
        ]}>
            <View style={tailwind('flex flex-row items-center justify-between  w-full')}>
                    <View style={tailwind('flex flex-row items-center')}>
                       <Text style={tailwind('text-lg ')}>{listingsName}</Text>
                    </View>
                <View style={tailwind('bg-primary-500 p-1 rounded-lg')}>
                    <Text style={tailwind('text-black text-white')}>{`₦${order.orderBreakDown.orderCost}`}</Text>
                </View>
            </View>
            {deliveryInfo?.driver === undefined ? (
                <View style={tailwind('flex flex-row items-center justify-between w-full border-t-0.5  mt-2 py-2 border-gray-300')}>
                    <View style={tailwind('flex flex-row justify-between items-center mb-2')}>
                        <OrderCardItem
                            title="Order type"
                        >
                                <Text style={tailwind('underline ')}>
                                    {order.orderType === 'ON_DEMAND' ? 'Instant' : 'Pre-order'}
                                </Text>
                        </OrderCardItem>
                    </View>
                    <OrderCardItem
                        title="Pick up time"
                    >
                        <View style={tailwind('flex flex-row items-center')}>
                            <Text style={tailwind('text-black mr-3')}>
                                {
                                    order.orderType === 'PRE_ORDER' ? calculatePreorderDate(order.orderDeliveryScheduledTime)
                                        :  calculateOnDemandDeliveryDate(Number(vendorSettings?.operations?.preparationTime ?? 0), order.createdAt)
                                }
                            </Text>
                            <IconComponent iconType="AntDesign" name='clockcircleo' size={18} style={tailwind('text-black')} />
                        </View>
                    </OrderCardItem>
                </View>
            ) : (<DeliveryDetails details={deliveryInfo} />)}
        </TouchableOpacity>
    )
}


export function DeliveredOrderCard (props: { order: OrderI, onPress?: (order: OrderI) => void, style?: StyleProp<any>}): JSX.Element {
    const listingsName = useMemo(() => {
        return props.order.listing.map( li => li.name)
            .join(', ')
    }, [props.order.listing])

    return (
        <TouchableOpacity
            onPress={() => {
                if (props.onPress !== undefined) {
                    props.onPress(props.order)
                }
            }}
            style={[
            tailwind('flex p-3 flex-row my-2  bg-white justify-between items-center w-full border-0.5 border-black'),
            props.style
        ]}>
            <View style={tailwind('flex flex-col w-1/2')}>
                <Text style={tailwind('w-3/4')} numberOfLines={1} ellipsizeMode="tail">{listingsName}</Text>
                <Text style={tailwind('')}>₦{props.order.orderBreakDown.orderCost}</Text>
            </View>


                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('')}>Delivered: {moment(props.order.updatedAt).format('dddd')}</Text>
                        <Text style={tailwind('')}>{moment(props.order.updatedAt).format('hh:mm Do MMM')}</Text>
                    </View>
        </TouchableOpacity>
    )
}


export function OrderCardItem (props: PropsWithChildren<{text?: string, title: string, titleStyle?: any, textStyle?: any}>): JSX.Element {
    return (
        <View style={tailwind('flex flex-col')}>
        <Text style={[tailwind(''), props.titleStyle]}>{props.title}</Text>
           {props.children !== undefined ?
            props.children
           : (
            <Text style={[tailwind(''), props.textStyle]}>
            {props.text}
           </Text>
           )}
     </View>
    )
}

export function DeliveryDetails ({details}: { details: DeliveryI,  }): JSX.Element {
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
