import {Text, View} from 'react-native'
import {ReviewsHeader} from "@screens/AppNavigator/ReviewNavigator/screen/components/ReviewsHeader";
import {useSelector} from "react-redux";
import {RootState} from "@store/index";
import {MostReviewedMenus} from "@screens/AppNavigator/ReviewNavigator/screen/components/MostReviewedMenus";
import {tailwind} from "@tailwind";
import {GenericFlashList} from "@components/views/FlashList";
import {useCallback, useEffect, useRef, useState} from "react";
import {EmptyReviews} from "@screens/AppNavigator/ReviewNavigator/screen/components/EmptyReviews";
import {ReviewCard} from "@screens/AppNavigator/ReviewNavigator/screen/components/ReviewCard";
import {Review} from "@store/reviews.reducer";
import { _api } from '@api/_request';
import { showTost } from '@components/commons/Toast';
import { useToast } from 'react-native-toast-notifications';
import { LoaderComponentScreen } from '@components/commons/LoaderComponent';
import {ReviewI} from '@imagyne/eatlater-types'
import { EmptyAnimation } from '@components/lottie/Empty';


export function ReviewScreen (_props: any): JSX.Element {
    const {hasFetchedProfile, profile} = useSelector((state: RootState) => state.profile)

    const [loading, setLoading] = useState<boolean>(false)
    const toast = useToast()
   

    useEffect(() => {
        if(!hasFetchedProfile) return 
        // fetchVendorReviewData(profile._id)
    },[])


    const fetchVendorReviewData = async (vendorId: string): Promise<void> => {
        try {
            setLoading(true)
            const [stats] = await Promise.all([
                // _api.requestData({
                //     method: 'get',
                //     url: `review/stats/vendor/${vendorId}`
                // }),
                _api.requestData({
                    method: 'get',
                    url: `review/vendor/${vendorId}`
                }),
            ])

        } catch (error) {
            console.log(error)
            showTost(toast, 'Failed to fetch review', 'error')
        } finally {
            setLoading(false)
        }
    } 

    if(loading) {
        return (
            <LoaderComponentScreen />
        )
    }
    return  (
            <>
                <ReviewsHeader />
                <View style={tailwind('px-3')}>
                    <View style={tailwind('mt-5')}>
                        <Text style={tailwind('text-brand-black-500 font-semibold text-lg mb-3')}>Recent Reviews</Text>
                        <RecentViews reviews={[]} />
                    </View>
                </View>
            </>
    )
}


function RecentViews (props: {reviews: ReviewI[]}): JSX.Element {
    const ref = useRef<any>(null)
    const RenderItems = useCallback(
        (props: { item: ReviewI; index: number }): JSX.Element => {
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
            contentContainerStyle={tailwind("pb-20")}
            data={props.reviews}
            ref={ref}
            estimatedItemSize={30}
            keyExtractor={(_item) => _item._id}
            ListEmptyComponent={<EmptyAnimation text='No Reviews yet' />}
            renderItem={RenderItems}
        />
    );
}


