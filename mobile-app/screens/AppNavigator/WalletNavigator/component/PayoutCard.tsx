import {Text, View, Pressable} from 'react-native'
import {tailwind} from '@tailwind'
import {NumericFormat as NumberFormat} from "react-number-format";
import {IconComponent} from "@components/commons/IconComponent";
import { VendorPayoutI } from '@nanahq/sticky';
import days  from 'dayjs'
import { IconButton } from '@components/commons/buttons/IconButton';
import * as ClipBoard from 'expo-clipboard'
import { useToast } from 'react-native-toast-notifications';
import { showTost } from '@components/commons/Toast';

export function PayoutCard ({payout, onPress}: {payout: VendorPayoutI, index: number, onPress: (payout: VendorPayoutI) => void}): JSX.Element {

    const pDay = days(payout.updatedAt).format('ddd D MMM YYYY')

    const toast = useToast()

    const copy = (text: number): void => {
        void ClipBoard.setStringAsync(String(text))
        showTost(toast, 'copied to clipboard', 'success')
    }

    return  (
        <Pressable onPress={() => onPress(payout)} style={tailwind('flex flex-col w-full border-0.5 mb-3 px-3 py-4 border-gray-300 bg-white rounded-lg')}>
           <View style={tailwind('flex flex-row w-full items-center justify-between')}>
            <Text
                    style={tailwind('text-xs text-black')}
                >{`Payout #${payout.refId}`}</Text>
                <NumberFormat
                    prefix='₦'
                    value={payout.earnings}
                    thousandSeparator
                    displayType="text"
                    renderText={(value) => (
                        <Text
                            style={tailwind('text-nana-lime')}
                        >
                            {value}
                        </Text>
                    )}
                />
                <Text
                    style={tailwind('text-xs text-brand-black-500')}
                >{pDay}</Text>
                <IconComponent iconType='Feather' size={16} name="arrow-up-right" style={tailwind('text-nana-lime')} />
           </View>
           <View style={tailwind('mt-3 flex flex-row items-center w-full justify-between')}>
               <View>
                   <Text   style={tailwind('text-xs text-black')} >{`${payout?.orders?.length} Orders`}</Text>
               </View>
               <View style={tailwind('flex flex-row items-center ')}>
                   <Text   style={tailwind('text-xs text-black')} >{`reference ID: ${payout.refId}`}</Text>
                   <IconButton
                       iconName='copy'
                       iconSize={14}
                       iconType='Feather'
                       onPress={() => copy(payout.refId)}
                       style={tailwind('bg-brand-gray-500 p-1 rounded ml-1')}
                   />
               </View>
           </View>
        </Pressable>
    )
}
