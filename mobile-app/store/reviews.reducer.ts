import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import { ReviewI, VendorReviewOverview } from "@nanahq/sticky";
import { showToastStandard } from "@components/commons/Toast";

export interface ReviewState {
    reviews: ReviewI[]
    overview: VendorReviewOverview
    hasFetchedReviews: boolean
}

const initialState: ReviewState = {
    reviews: [],
    hasFetchedReviews: true,
    overview: {
        numberOfReviews: 0,
        rating: '0',
        riskFactor: 'MEDIUM'
    }
};

export const fetchReviews = createAsyncThunk(
    AppActions.FETCH_REVIEWS,
    async (vendorId: string) => {
        const [stats, reviews] = await Promise.all([
            _api.requestData({
                method: 'get',
                url: `review/stats/vendor/${vendorId}`
            }),
            _api.requestData({
                method: 'get',
                url: `review/vendor/${vendorId}`
            }),
        ])
        return {overview: stats.data, reviews: reviews.data}
    }
);

export const reviews = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        setHasFetchedReviews: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedReviews = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchReviews.fulfilled,
                (state, {payload}: PayloadAction<{overview: VendorReviewOverview, reviews: ReviewI[]}>) => {
                    state.reviews = payload.reviews
                    state.overview = payload.overview
                    state.hasFetchedReviews = true
                }
            ).addCase(
                fetchReviews.rejected,
                () => {
                    showToastStandard('Failed to fetch reviews', 'error')
                }
            ).addCase(fetchReviews.pending, (state) => {
                state.hasFetchedReviews = false
            })
    },
});

