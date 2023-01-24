import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";


export interface ReviewState {
    reviews: Review[]
    averageRating: string | undefined
    totalNumberOfReviews: string | undefined
    lastReviewed: string | undefined
    hasFetchedReviews: boolean | undefined
}

export interface Review {
    reviewDate: string
    reviewUser: string
    reviewDesc: string
    reviewRating: string
    reviewListingName: string
}

const initialState: ReviewState = {
    reviews: [],
    averageRating: undefined,
    totalNumberOfReviews: undefined,
    lastReviewed: 'No reviews yet',
    hasFetchedReviews: false
};

export const fetchReviews = createAsyncThunk(
    AppActions.FETCH_REVIEWS,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'reviews/get-all'
        })
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
                (state, {payload: {data}}: PayloadAction<{data:any, cookies: any}>) => {
                    state.reviews = data.reviews
                    state.lastReviewed = data.lastReviewed
                    state.totalNumberOfReviews = data.totalReviews
                    state.averageRating = data.avgRating
                    state.hasFetchedReviews = true
                }
            );
    },
});

