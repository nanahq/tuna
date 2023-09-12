import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {IconComponent} from "@components/commons/IconComponent";
import { ReviewI } from '@nanahq/sticky';
import days from 'dayjs'



export function ReviewCard ({review}: {review: ReviewI}): JSX.Element {
    return (
        <View style={tailwind('flex flex-col w-full py-2 bg-white px-3 border-brand-black-500 border-0.5 mb-3 rounded-sm')}>
            <View style={tailwind('flex flex-row items-center w-full justify-between mb-1')}>
                <View style={tailwind('flex flex-col')}>
                    <Text style={tailwind('text-lg text-brand-black-500 font-semibold')}>{review.listingId.name}</Text>
                    <Text style={tailwind('text-sm text-brand-black-500')}>{review.reviewerName}</Text>
                </View>
                <View style={tailwind('flex flex-col items-end')}>
                    <Text style={tailwind('text-sm text-brand-black-500 mb-1')}>{days(review.createdAt).format('ddd MMM YYYY')}</Text>
                    <View style={tailwind('flex flex-row items-center')}>
                        <IconComponent iconType='Feather' style={tailwind('text-brand-green-500')} name="thumbs-up" size={18} />
                        <Text style={tailwind('text-sm text-brand-black-500')}>{review.reviewStars}</Text>
                    </View>
                </View>
            </View>
            <View style={tailwind('flex flex-row items-center w-full justify-center mt-2')}>
                <IconComponent iconType='MaterialCommunityIcons' name="format-quote-open" size={14} />
                <Text style={tailwind('text-base font-light text-brand-black-500')}>{review.reviewBody}</Text>
                <IconComponent iconType='MaterialCommunityIcons' name="format-quote-close" size={14} />
            </View>
        </View>
    )
}
