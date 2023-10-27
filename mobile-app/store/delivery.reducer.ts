import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {DeliveryI} from "@nanahq/sticky";

export interface DeliveryState {
    deliveries: DeliveryI[],
    hasFetchedDeliveries: boolean,
    fetchingDeliveries: boolean
}

const initialState:  DeliveryState = {
    deliveries: [],
    hasFetchedDeliveries: false,
    fetchingDeliveries: false
};

export const fetchDeliveries = createAsyncThunk(
    AppActions.FETCH_DELIVERIES,
    async () => {
        return (await _api.requestData({
            method: 'get',
            url: 'delivery/deliveries'
        })).data
    }
)

export const deliveries = createSlice({
    name: "deliveries",
    initialState,
    reducers: {
        setHasFetchedDeliveries: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedDeliveries = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchDeliveries.fulfilled,
                (state, {payload: data}: PayloadAction<DeliveryI[]>) => {
                    state.deliveries = data
                    state.fetchingDeliveries = false
                    state.hasFetchedDeliveries = true
                }
            )
    },
});

