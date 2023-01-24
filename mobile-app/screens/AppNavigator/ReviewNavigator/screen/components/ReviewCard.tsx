import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {IconComponent} from "@components/commons/IconComponent";

export interface ReviewCardProps {
    reviewDate: string
    reviewUser: string
    reviewDesc: string
    reviewRating: string
    reviewListingName: string

}
export function ReviewCard (props: ReviewCardProps): JSX.Element {
    return (
        <View style={tailwind('flex flex-col w-full py-2 bg-white px-3 border-brand-black-500 border-0.5 mb-3 rounded-sm')}>
            <View style={tailwind('flex flex-row items-center w-full justify-between mb-1')}>
                <View style={tailwind('flex flex-col')}>
                    <Text style={tailwind('text-lg text-brand-black-500 font-semibold')}>{props.reviewListingName}</Text>
                    <Text style={tailwind('text-sm text-brand-black-500')}>{props.reviewUser}</Text>
                </View>
                <View style={tailwind('flex flex-col items-end')}>
                    <Text style={tailwind('text-sm text-brand-black-500 mb-1')}>{props.reviewDate}</Text>
                    <View style={tailwind('flex flex-row items-center')}>
                        <IconComponent iconType='Feather' style={tailwind('text-brand-green-500')} name="thumbs-up" size={18} />
                        <Text style={tailwind('text-sm text-brand-black-500')}>{props.reviewRating}</Text>
                    </View>
                </View>
            </View>
            <View style={tailwind('flex flex-row items-center w-full justify-center mt-2')}>
                <IconComponent iconType='MaterialCommunityIcons' name="format-quote-open" size={14} />
                <Text style={tailwind('text-base font-light text-brand-black-500')}>{props.reviewDesc}</Text>
                <IconComponent iconType='MaterialCommunityIcons' name="format-quote-close" size={14} />
            </View>
        </View>
    )
}
