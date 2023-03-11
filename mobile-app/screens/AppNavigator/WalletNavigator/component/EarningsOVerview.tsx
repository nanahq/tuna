import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {NumericFormat as NumberFormat} from "react-number-format";
import { PayoutOverview } from '@imagyne/eatlater-types';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export function EarningsOVerview ({overview}: {overview: PayoutOverview}): JSX.Element {

    const [view, setView] = useState<keyof PayoutOverview>('24_hours')


    const handleViewChange  = (_view: keyof PayoutOverview): void => {
        setView(_view)
    }

    return  (
       <View style={tailwind('mt-3')}>
        <Text style={tailwind('text-lg font-semibold text-brand-black-500 mb-2')}>Earnings</Text>
         <View style={tailwind('flex  flex-col w-full  border-0.5 mb-3  pt-4 border-brand-black-500 bg-white rounded-lg')}>
           <View style={tailwind('flex flex-row w-full justify-center items-center w-full border-b-0.5 border-brand-gray-400')}>
            <NumberFormat
                value={overview[view]}
                thousandSeparator
                prefix='₦'
                displayType='text'
                renderText={(value) => (
                    <Text style={tailwind('text-xl font-semibold mb-2')}>
                        {value}
                    </Text>
                )}
            />
           </View>
           <View style={tailwind('flex flex-row items-center w-full my-3')}>
            <EarningTimeLine 
                isFocused={view === '24_hours'} 
                onPress={() => handleViewChange('24_hours')} 
                text='24h' 
            />
            <EarningTimeLine
                isFocused={view === '7_days'}
                onPress={() => handleViewChange('7_days')} 
                text='7d' 
            />
            <EarningTimeLine 
                isFocused={view === '30_days'}
                onPress={() => handleViewChange('30_days')} 
                text='30d' 
            />
           </View>
        </View>
       </View>
    )
}

export function EarningTimeLine ({onPress, text, isFocused}: {onPress: () => void, text:string, isFocused: boolean}): JSX.Element {
    return (
        <TouchableOpacity onPress={onPress}
            style={[tailwind('border-0.5 border-brand-black-500 rounded-sm p-1 px-1 mx-1 mb-1', {
                'bg-brand-black-500': isFocused
            }), {
                width: 40
            }]}
        >
        <Text style={tailwind('text-center text-xs font-semibold text-brand-black-500', {
            'text-white': isFocused
        })}>{text}</Text>
    </TouchableOpacity>
    )
}