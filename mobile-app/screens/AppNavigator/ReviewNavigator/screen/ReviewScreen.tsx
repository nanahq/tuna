import {Text, View} from 'react-native'
import {ReviewsHeader} from "@screens/AppNavigator/ReviewNavigator/screen/components/ReviewsHeader";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@store/index";
import {tailwind} from "@tailwind";
import {GenericFlashList} from "@components/views/FlashList";
import {useCallback, useEffect, useMemo, useRef} from "react";
import {ReviewCard} from "@screens/AppNavigator/ReviewNavigator/screen/components/ReviewCard";
import {fetchReviews} from "@store/reviews.reducer";
import {LoaderComponentScreen} from '@components/commons/LoaderComponent';
import {ListingApprovalStatus, OrderStatus, ReviewI} from '@nanahq/sticky'
import {EmptyAnimation} from '@components/lottie/Empty';
import {NumericFormat as NumberFormat} from "react-number-format";

export function ReviewScreen (): JSX.Element {
    const {hasFetchedProfile, profile} = useSelector((state: RootState) => state.profile)
    const {hasFetchedOrders, orders} = useSelector((state: RootState) => state.orders)
    const {hasFetchedListings, listingsMenu} = useSelector((state: RootState) => state.listings)

    const {hasFetchedReviews, reviews, overview} = useSelector((state: RootState) => state.reviews)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!hasFetchedProfile) {
            return
        }
        void dispatch(fetchReviews(profile._id))
    }, [])

    const computedOrdersValue = useMemo(() => {
        if(orders.length <= 0) {
            return
        }
        return orders
            .filter(order => order.orderStatus === OrderStatus.FULFILLED)
            .reduce((acc, _orders) => {
                return acc + _orders.orderBreakDown.orderCost
            }, 0)
    }, [orders])



    const numberOfOrders = useMemo(() => {
        return orders
            .filter(order => order.orderStatus === OrderStatus.FULFILLED)
            .length
    }, [orders.length])

    const numberOfListings = useMemo(() => {
        return listingsMenu
            .filter(li => !li.isDeleted && li.status === ListingApprovalStatus.APPROVED )
            .length
    }, [listingsMenu.length])

    if (!hasFetchedReviews || !hasFetchedOrders || !hasFetchedListings) {
        return (
            <LoaderComponentScreen />
        )
    }

    return  (
            <View style={tailwind('flex-1 bg-primary-200')}>
                <View style={tailwind('px-4 py-3')}>
                    <View style={tailwind('bg-white mb-3 px-3  border-0.5 border-brand-black-500 rounded-lg py-2 flex flex-col w-full')}>
                        <Text style={tailwind('text-lg mb-2 text-gray-400')}>Total Sales</Text>
                        <View style={tailwind('flex flex-row items-baseline self-end')}>
                            <Text style={tailwind('text-lg mr-1')}>₦</Text>
                            <NumberFormat
                                value={computedOrdersValue}
                                thousandSeparator
                                displayType='text'
                                renderText={(value) => (
                                    <Text style={tailwind('text-2xl mr-3 flex  font-bold')}>
                                        {value}
                                    </Text>
                                )}
                            />
                        </View>
                    </View>
                    <View style={tailwind('flex flex-row items-center')}>
                        <View style={tailwind('bg-white px-3 py-2 border-0.5 border-brand-black-500 rounded-lg flex flex-col flex-grow mr-2')}>
                            <Text style={tailwind('text-lg mb-2 text-center text-gray-400')}>Approved Listing</Text>
                            <NumberFormat
                                value={numberOfListings}
                                thousandSeparator
                                displayType='text'
                                renderText={(value) => (
                                    <Text style={tailwind('text-2xl mr-3  flex self-center font-bold')}>
                                        {value}
                                    </Text>
                                )}
                            />
                        </View>
                        <View style={tailwind('bg-white px-3 py-2 border-0.5 rounded-lg  border-brand-black-500 flex flex-grow flex-col ml-2')}>
                            <Text style={tailwind('text-lg mb-2 text-gray-400 text-center')}>Delivered orders</Text>
                            <NumberFormat
                                value={numberOfOrders}
                                thousandSeparator
                                displayType='text'
                                renderText={(value) => (
                                    <Text style={tailwind('text-2xl mr-3 flex self-center font-bold')}>
                                        {value}
                                    </Text>
                                )}
                            />
                        </View>
                    </View>
                </View>
                <ReviewsHeader overview={overview} />
                <View style={tailwind('px-4')}>
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


