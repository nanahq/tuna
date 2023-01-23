import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {NumericFormat as NumberFormat} from "react-number-format";
import {IconComponent} from "@components/commons/IconComponent";

interface PayoutCardProps {
    payoutNumber: string
    payoutDate: string
    payoutAmount: string
}
export function PayoutCard (props: PayoutCardProps): JSX.Element {
    const {
        payoutAmount,
        payoutDate,
        payoutNumber,
    } = props
    return  (
        <View style={tailwind('flex flex-row w-full items-center justify-between border-0.5 mb-3 px-3 py-4 border-brand-black-500')}>
            <Text
                style={tailwind('text-lg text-brand-black-500 font-medium')}
            >{`Payout#${payoutNumber}`}</Text>
            <NumberFormat
                value={payoutAmount}
                thousandSeparator
                displayType="text"
                renderText={(value) => (
                    <Text
                        style={tailwind('text-lg text-brand-black-500 font-semibold text-green-500')}
                    >
                        {value}
                    </Text>
                )}
            />
            <Text
                style={tailwind('text-lg text-brand-black-500 font-medium')}
            >{payoutDate}</Text>
            <IconComponent iconType='Feather' size={16} name="arrow-up-right" style={tailwind('text-green-500')} />
        </View>
    )
}
