import {Text, View} from 'react-native'
import {getColor, tailwind} from '@tailwind'
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface ReviewsHeaderProps {
    totalNumberOfReviews:  string | undefined
    averageRating: string | undefined
    lastReviewed: string | undefined
}
export function ReviewsHeader (props: ReviewsHeaderProps): JSX.Element {
    const insets = useSafeAreaInsets()
    const {averageRating, lastReviewed, totalNumberOfReviews} = props
    return (
        <View style={[tailwind('flex flex-col py-4 px-3 bg-white border-0.5 border-brand-gray-400'), {
            paddingTop: insets.top + 20,
            shadowRadius: 0.5,
            shadowOpacity: 0.9,
            shadowColor: getColor('brand-gray-700')
        }]}>
            <ReviewsHeaderItem label="Average Rating" value={averageRating} />
            <ReviewsHeaderItem label="Total reviews" value={totalNumberOfReviews} />
            <ReviewsHeaderItem label="Last Reviewed" value={lastReviewed} />
        </View>
    )
}

function ReviewsHeaderItem (props: {label: string, value: string | undefined}): JSX.Element  {
    return (
        <View style={tailwind('flex flex-row items-center')}>
            <Text style={tailwind('text-brand-black-500  font-semibold mr-3')}>{props.label}:</Text>
            <Text style={tailwind('text-brand-black-500  font-normal')}>{props.value ?? 0 }</Text>
        </View>
    )
}
