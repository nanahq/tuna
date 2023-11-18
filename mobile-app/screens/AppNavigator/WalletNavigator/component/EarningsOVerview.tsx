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
         <View style={tailwind('flex  flex-col w-full  border-2 mb-3 px-4  py-4 border-primary-500 bg-primary-500 rounded-lg')}>
             <Text style={tailwind('text-lg text-white')}>Earnings</Text>
             <View style={tailwind('flex flex-row items-baseline')}>
                   <Text style={tailwind('text-lg text-white mr-1')}>₦</Text>
                   <NumberFormat
                       value={overview[view]}
                       thousandSeparator
                       displayType='text'
                       renderText={(value) => (
                           <Text style={tailwind('text-4xl text-white font-bold mb-2')}>
                               {value}
                           </Text>
                       )}
                   />
               </View>
        </View>
           <View style={[tailwind(' flex flex-row items-center my-3'), {width: 300}]}>
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
    )
}

export function EarningTimeLine ({onPress, text, isFocused, style}: {onPress: () => void, text:string, isFocused: boolean, border?: boolean, style?: any}): JSX.Element {
    return (
        <TouchableOpacity onPress={onPress}
            style={[tailwind(' py-1 px-2 border-0.5 border-black', {
                'bg-black': isFocused}), style]}
        >
        <Text style={tailwind('text-center text-base text-black', {
            'text-white': isFocused
        })}>{text}</Text>
    </TouchableOpacity>
    )
}
