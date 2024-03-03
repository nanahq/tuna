import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {NumericFormat as NumberFormat} from "react-number-format";
import { PayoutOverview } from '@nanahq/sticky';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export function EarningsOverview ({overview}: {overview: PayoutOverview}): JSX.Element {
    const [view, setView] = useState<keyof PayoutOverview>('24_hours')
    const handleViewChange  = (_view: keyof PayoutOverview): void => {
        setView(_view)
    }
    return  (
       <View style={tailwind('mt-3')}>
           <View style={tailwind('bg-brand-black-500  w-full rounded-lg py-4 px-3 ')}>
               <View style={tailwind('flex flex-col w-full')}>
                   <Text style={tailwind('text-sm text-white mb-5')}>Earnings Overview</Text>
                   <NumberFormat
                       prefix="₦ "
                       value={overview[view]}
                       thousandSeparator
                       displayType="text"
                       renderText={(value) => (
                           <Text style={tailwind("font-normal text-4xl text-white")}>{value}</Text>
                       )}
                   />
                   <View style={[tailwind(' flex flex-row items-center mt-10 self-end'), {width: 300}]}>
                       <EarningTimeLine
                           isFocused={view === '24_hours'}
                           onPress={() => handleViewChange('24_hours')}
                           text='Yesterday'
                           border
                       />
                       <EarningTimeLine
                           isFocused={view === '7_days'}
                           onPress={() => handleViewChange('7_days')}
                           text='Past 7 days'
                           border
                       />
                       <EarningTimeLine
                           isFocused={view === '30_days'}
                           onPress={() => handleViewChange('30_days')}
                           text='Last 30 days'
                           border
                       />
                   </View>
               </View>
           </View>

       </View>
    )
}

export function EarningTimeLine ({onPress, text, isFocused, style}: {onPress: () => void, text:string, isFocused: boolean, border?: boolean, style?: any}): JSX.Element {
    return (
        <TouchableOpacity onPress={onPress}
            style={[tailwind('py-1 px-2', {
                'bg-white': isFocused}), style]}
        >
        <Text style={tailwind('text-center text-base text-white', {
            'text-black': isFocused
        })}>{text}</Text>
    </TouchableOpacity>
    )
}
