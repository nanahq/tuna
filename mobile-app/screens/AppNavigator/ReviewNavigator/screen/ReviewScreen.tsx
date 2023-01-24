import {Text, View} from 'react-native'
import {ReviewsHeader} from "@screens/AppNavigator/ReviewNavigator/screen/components/ReviewsHeader";
import {useSelector} from "react-redux";
import {RootState} from "@store/index";
import {MostReviewedMenus} from "@screens/AppNavigator/ReviewNavigator/screen/components/MostReviewedMenus";
import {tailwind} from "@tailwind";
import {GenericFlashList} from "@components/views/FlashList";
import {useCallback, useRef} from "react";
import {EmptyReviews} from "@screens/AppNavigator/ReviewNavigator/screen/components/EmptyReviews";
import {ReviewCard} from "@screens/AppNavigator/ReviewNavigator/screen/components/ReviewCard";
import {Review} from "@store/reviews.reducer";

const data = [{
    reviewDate: Date.now().toLocaleString(),
    reviewUser: 'Adam',
    reviewDesc: 'Food is phenomenal',
    reviewRating: '4.8',
    reviewListingName: 'Fufu soup'
},
    {
        reviewDate: new Date().getTime().toLocaleString(),
        reviewUser: 'Adam',
        reviewDesc: 'Food is phenomenal',
        reviewRating: '4.8',
        reviewListingName: 'Fufu soup'
    },

    {
        reviewDate: new Date().getTime().toLocaleString(),
        reviewUser: 'Adam',
        reviewDesc: 'Food is phenomenal',
        reviewRating: '4.8',
        reviewListingName: 'Fufu soup'
    },

    {
        reviewDate: new Date().getTime().toLocaleString(),
        reviewUser: 'Adam',
        reviewDesc: 'Food is phenomenal',
        reviewRating: '4.8',
        reviewListingName: 'Fufu soup'
    },


]


export function ReviewScreen (_props: any): JSX.Element {
    const {reviews, hasFetchedReviews, ...rest} = useSelector((state: RootState) => state.reviews)
    const getTopRatedMenus = useCallback(() => {
        return reviews.sort((a, b) => Number(a.reviewRating) - Number(b.reviewRating)).slice(0, 4)
    }, [])
    return  (
            <>
                <ReviewsHeader {...rest} />
                <View style={tailwind('px-3')}>
                    <MostReviewedMenus reviews={data} />
                    <View style={tailwind('mt-5')}>
                        <Text style={tailwind('text-brand-black-500 font-semibold text-lg mb-3')}>Recent Reviews</Text>
                        <RecentViews reviews={data} />
                    </View>
                </View>
            </>
    )
}


function RecentViews (props: {reviews: Review[]}): JSX.Element {
    const ref = useRef<any>(null)
    const RenderItems = useCallback(
        (props: { item: Review; index: number }): JSX.Element => {
            return (
                <ReviewCard
                    {...props.item}

                />
            );
        },
        []
    );
    return (
        <GenericFlashList
            contentContainerStyle={tailwind("pb-2")}
            data={props.reviews}
            ref={ref}
            estimatedItemSize={30}
            keyExtractor={(_item, index) => index.toString()}
            ListEmptyComponent={<EmptyReviews />}
            renderItem={RenderItems}
        />
    );
}


