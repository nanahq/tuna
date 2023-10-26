import {Text, View} from 'react-native'
import {ReviewsHeader} from "@screens/AppNavigator/ReviewNavigator/screen/components/ReviewsHeader";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@store/index";
import {tailwind} from "@tailwind";
import {GenericFlashList} from "@components/views/FlashList";
import {useCallback, useEffect, useRef} from "react";
import {ReviewCard} from "@screens/AppNavigator/ReviewNavigator/screen/components/ReviewCard";
import { fetchReviews} from "@store/reviews.reducer";
import { LoaderComponentScreen } from '@components/commons/LoaderComponent';
import {ReviewI} from '@nanahq/sticky'
import { EmptyAnimation } from '@components/lottie/Empty';

export function ReviewScreen (): JSX.Element {
    const {hasFetchedProfile, profile} = useSelector((state: RootState) => state.profile)

    const {hasFetchedReviews, reviews, overview} = useSelector((state: RootState) => state.reviews)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!hasFetchedProfile) {
        return
    }
        void dispatch(fetchReviews(profile._id))
    }, [])


    if (!hasFetchedReviews) {
        return (
            <LoaderComponentScreen />
        )
    }

    return  (
            <View style={tailwind('flex-1 bg-white')}>
                <ReviewsHeader overview={overview} />
                <View style={tailwind('px-3')}>
                    <View style={tailwind('mt-2')}>
                        <Text style={tailwind('text-brand-black-500 font-semibold text-lg mb-3')}>Recent Reviews</Text>
                        <RecentViews reviews={reviews} />
                    </View>
                </View>
            </View>
    )
}

function RecentViews (props: {reviews: ReviewI[]}): JSX.Element {
    const ref = useRef<any>(null)
    const RenderItems = useCallback(
        (props: { item: ReviewI }): JSX.Element => {
            return (
                <ReviewCard
                    review={props.item}
                />
            );
        },
        []
    );
    return (
        <GenericFlashList
            contentContainerStyle={tailwind("pb-96")}
            data={props.reviews}
            ref={ref}
            estimatedItemSize={30}
            keyExtractor={(_item) => _item._id}
            ListEmptyComponent={<EmptyAnimation text='No Reviews yet' />}
            renderItem={RenderItems}
        />
    );
}


