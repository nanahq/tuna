import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {IconComponent} from "@components/commons/IconComponent";
import moment from 'moment'



export function ReviewCard ({review}: {review: any}): JSX.Element {
    return (
        <View style={tailwind('flex flex-col w-full py-2 bg-white px-2 border-gray-300 border-0.5 mb-3 rounded-sm')}>
            <View style={tailwind('flex flex-row items-center w-full justify-between mb-1')}>
                <View style={tailwind('flex flex-col')}>
                    <Text style={tailwind('text-black ')}>{review.listing.name}</Text>
                    <Text style={tailwind('text-sm text-black')}>{review.reviewerName}</Text>
                </View>
                <View style={tailwind('flex flex-col items-end')}>
                    <Text style={tailwind('text-sm text-black mb-1')}>{moment(review.createdAt).format('ddd MMM YYYY')}</Text>
                   <Stars stars={review.reviewStars} />
                </View>
            </View>
            <View style={tailwind('flex flex-row items-center w-full justify-center mt-2')}>
                <IconComponent iconType='MaterialCommunityIcons' name="format-quote-open" size={14} />
                <Text style={tailwind('text-base font-light text-black')}>{review.reviewBody}</Text>
                <IconComponent iconType='MaterialCommunityIcons' name="format-quote-close" size={14} />
            </View>
        </View>
    )
}


function Stars (props: {stars: number}): JSX.Element {
    const empty = Array((5 - props.stars)).fill(5)
    const given = Array((props.stars)).fill(5)
    return (
        <View style={tailwind('flex flex-row items-center')}>
            {given.map((_, index) => (
                <IconComponent
                    key={index}
                    name='star'
                    iconType='MaterialCommunityIcons'
                    style={tailwind('text-warning-500')}
                    size={18}
                />
            ))}
            {empty.map((_, index) => (
                <IconComponent
                    key={index}
                    name='star'
                    iconType='Feather'
                    style={tailwind('text-black')}
                    size={18}
                />
            ))}
        </View>
    )
}
