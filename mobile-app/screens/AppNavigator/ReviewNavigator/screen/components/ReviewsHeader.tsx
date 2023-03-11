import {StyleProp, Text, View} from 'react-native'
import { tailwind} from '@tailwind'
import {VendorReviewOverview} from '@imagyne/eatlater-types'
import { IconComponent } from '@components/commons/IconComponent';
import { IconButton } from '@components/commons/buttons/IconButton';


const mock: VendorReviewOverview = {
    numberOfReviews: 2200, 
    rating: '4.6',
    riskFactor: 'LOW'
     
}
export function ReviewsHeader (props: {overview?: VendorReviewOverview}): JSX.Element {

    return (
        <View style={[tailwind('py-4 px-3 mt-2 overflow-hidden bg-white'), {
            
        }]}>
           <View style={tailwind('flex flex-row w-full justify-center')}>
           <TotalReviews 
                total={mock.numberOfReviews}
                style={tailwind('mr-1')}
            />
            <Satisfaction
                rating={parseFloat(mock.rating)}
                style={tailwind('mr-1')}
            />
             <RiskFactor 
                risk={mock.riskFactor}
            />
           </View>
            <View style={tailwind('mt-4')}> 
                <IconButton
                    iconName='share-2'
                    iconSize={22}
                    iconType='Feather'
                    onPress={() => {}}
                    iconLabel='Share'
                    iconStyle={tailwind('text-brand-black-500')}
                    textStyle={tailwind('font-bold text-brand-black-500')}
                />
            </View>
        </View>
    )
}



function TotalReviews(props: {total: number | string, style?: StyleProp<any>}): JSX.Element {
    return (
        <View style={[tailwind('border-0.5 border-brand-black-500 flex flex-col items-center  rounded-lg p-1 px-2 h-24 w-1/3'), props.style]}>
            <IconComponent
                name='star'
                iconType='MaterialCommunityIcons'
                style={tailwind('text-yellow-500')}
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

    if(props.rating >= 4) {
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
        <View style={[tailwind('border-0.5 border-brand-black-500 flex flex-col items-center  rounded-lg p-1 px-2  h-24 w-1/3'), props.style]}>
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
   
    switch(props.risk) {
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
        <View style={[tailwind('border-0.5 border-brand-black-500 flex flex-col items-center  justify-center rounded-lg p-1 px-2 h-24 w-1/3 '), props.style]}>
           <Text style={tailwind(` font-bold text-lg ${style}`)}>{props.risk}</Text>
            <View style={tailwind('flex flex-col items-center')}>
                <Text style={tailwind('text-gray-400')}>Risk factor</Text>
            </View>
        </View>
    )
    
}