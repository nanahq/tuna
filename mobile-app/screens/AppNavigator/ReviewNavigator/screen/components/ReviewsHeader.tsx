import {StyleProp, Text, TouchableOpacity, View} from 'react-native'
import { tailwind} from '@tailwind'
import {VendorReviewOverview} from '@imagyne/eatlater-types'
import { IconComponent } from '@components/commons/IconComponent';

export function ReviewsHeader ({overview: {numberOfReviews, riskFactor, rating}}: {overview: VendorReviewOverview}): JSX.Element {
    
    return (
        <View style={[tailwind('py-2 px-3 mt-2 overflow-hidden'), {
            
        }]}>
           <View style={tailwind('flex flex-row w-full justify-center')}>
           <TotalReviews 
                total={numberOfReviews}
                style={tailwind('mr-1')}
            />
            <Satisfaction
                rating={parseFloat(rating)}
                style={tailwind('mr-1')}
            />
             <RiskFactor 
                risk={riskFactor}
            />
           </View>
            <TouchableOpacity style={tailwind('mt-4 rounded-full w-10 h-10 bg-white flex items-center justify-center flex-row')}> 
                <IconComponent
                    name='share-2'
                    size={16}
                    iconType='Feather'
                    style={tailwind('text-sm text-brand-black-500')}
                />
            </TouchableOpacity>
        </View>
    )
}



function TotalReviews(props: {total: number | string, style?: any}): JSX.Element {
    return (
        <View style={[tailwind('border-0.5 bg-white border-brand-black-500 flex flex-col items-center  rounded-lg p-1 px-2 h-24 w-1/3'), props.style]}>
            <IconComponent
                name='star'
                iconType='MaterialCommunityIcons'
                style={tailwind('text-warning-500')}
                size={34}
            />
            <View style={tailwind('flex flex-col items-center ')}>
                <Text style={tailwind('font-bold text-lg text-brand-black-500')}>{props.total}</Text>
                <Text style={tailwind('text-gray-400')}>Reviews</Text>
            </View>
        </View>
    )
}

function Satisfaction (props: {rating: number, style?: StyleProp<any>}): JSX.Element {

    let iconName: string = ''
    let style: string = ''

    if (props.rating >= 4 || props.rating === 0.0) {
        iconName = 'smile'
        style = 'text-success-500'
    } else if (props.rating <= 4 && props.rating >= 2.5) {
        iconName = 'meh'
        style='text-warning-500'
    } else {
        iconName = 'frown'
        style='text-error-500'
    }

    return (
        <View style={[tailwind('border-0.5 bg-white border-brand-black-500 flex flex-col items-center  rounded-lg p-1 px-2  h-24 w-1/3'), props.style]}>
            <IconComponent
                name={iconName}
                iconType='Feather'
                style={tailwind(style)}
                size={34}
            />
            <View style={tailwind('flex flex-col items-center ')}>
                <Text style={tailwind('font-bold text-lg text-brand-black-500')}>{props.rating}/5</Text>
                <Text style={tailwind('text-gray-400')}>Rating</Text>
            </View>
        </View>
    )
}

function RiskFactor (props: {risk: 'HIGH' | 'MEDIUM' | 'LOW', style?: any}): JSX.Element {
    let style: string = ''
   
    switch (props.risk) {
        case 'HIGH': 
            style='text-error-500'
        break;

        case 'LOW': 
            style='text-success-500'
        break;

        case 'MEDIUM': 
            style='text-warning-500'
        break;
    }
    return (
        <View style={[tailwind('border-0.5 bg-white border-brand-black-500 flex flex-col items-center  justify-center rounded-lg p-1 px-2 h-24 w-1/3 '), props.style]}>
           <Text style={tailwind(` font-bold text-lg ${style}`)}>{props.risk}</Text>
            <View style={tailwind('flex flex-col items-center')}>
                <Text style={tailwind('text-gray-400')}>Risk factor</Text>
            </View>
        </View>
    )
    
}