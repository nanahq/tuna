import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {NumericFormat as NumberFormat} from "react-number-format";
import {IconComponent} from "@components/commons/IconComponent";
import { VendorPayoutI } from '@nanahq/sticky';
import days  from 'dayjs'
import { IconButton } from '@components/commons/buttons/IconButton';
import * as ClipBoard from 'expo-clipboard'
import { useToast } from 'react-native-toast-notifications';
import { showTost } from '@components/commons/Toast';

export function PayoutCard ({payout, index}: {payout: VendorPayoutI, index: number}): JSX.Element {

    const pDay = days(payout.updatedAt).format('ddd Do MMM YYYY')

    const toast = useToast()

    const copy = (text: number): void => {
        ClipBoard.setStringAsync(String(text))
        showTost(toast, 'copied to clipboard', 'success')
    }
    return  (
        <View style={tailwind('flex flex-col w-full border-0.5 mb-3 px-3 py-4 border-brand-black-500 bg-white rounded-lg')}>
           <View style={tailwind('flex flex-row w-full items-center justify-between')}>
            <Text
                    style={tailwind('text-xs text-brand-black-500 ')}
                >{`Payout #${payout.refId}`}</Text>
                <NumberFormat
                    prefix='₦'
                    value={payout.earnings}
                    thousandSeparator
                    displayType="text"
                    renderText={(value) => (
                        <Text
                            style={tailwind('text-sm text-brand-black-500 font-semibold text-green-500')}
                        >
                            {value}
                        </Text>
                    )}
                />
                <Text
                    style={tailwind('text-xs text-brand-black-500')}
                >{pDay}</Text>
                <IconComponent iconType='Feather' size={16} name="arrow-up-right" style={tailwind('text-green-500')} />
           </View>
           <View style={tailwind('flex flex-row items-center mt-3')}>
                <Text   style={tailwind('text-xs text-brand-black-500 ')} >{`reference ID: ${payout.refId}`}</Text>
                <IconButton
                    iconName='copy'
                    iconSize={14}
                    iconType='Feather'
                    onPress={() => copy(payout.refId)}
                    style={tailwind('bg-brand-gray-500 p-1 rounded ml-1')}
                />
           </View>
        </View>
    )
}
