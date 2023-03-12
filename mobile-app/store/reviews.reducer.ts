import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import { ReviewI, VendorReviewOverview } from "@imagyne/eatlater-types";


export interface ReviewState {
    reviews: ReviewI[]
    overview: VendorReviewOverview
    hasFetchedReviews: boolean
}

const initialState: ReviewState = {
    reviews: [],
    hasFetchedReviews: false,
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
            );
    },
});

