import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {NumericFormat as NumberFormat} from 'react-number-format'

interface EarningsOverviewProps  {
    lifeTimeEarnings: number | string
    dailyEarnings: number | string
}

export function EarningsOverview (props: EarningsOverviewProps): JSX.Element {
    return (
        <View style={[tailwind('flex rounded-lg flex-col mt-5 border-b-0.5 border-brand-gray-400 p-3 bg-brand-black-500'), {
            shadowOpacity: 0.1,
            shadowRadius: 0.1
        }]}>
            <EarningSection label='24 hours sales' earnings={props["dailyEarnings"]} />
            <EarningSection label='Lifetime sales' earnings={props["lifeTimeEarnings"]} />
        </View>
    )
}


function EarningSection (props: {label: string, earnings: number| string, style?: any}): JSX.Element {
    return (
        <View style={[tailwind('flex flex-col mb-2'), props.style]}>
            <Text style={tailwind('text-lg text-brand-gray-500 font-medium mb-2')}>{props.label}</Text>
            <NumberFormat
                value={props.earnings}
                thousandSeparator
                displayType="text"
                prefix="₦"
                renderText={(value) => (
                    <Text
                        style={tailwind('text-2xl text-white font-semibold')}
                    >
                        {value}
                    </Text>
                )}
            />
        </View>
    )
}
