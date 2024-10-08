import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import { OrderI} from '@nanahq/sticky'

export interface OrdersState {
    orders: OrderI[]
    hasFetchedOrders: boolean,

    fetchingOrders: boolean
}

const initialState: OrdersState = {
    orders: [],
    hasFetchedOrders: false,
    fetchingOrders: false
};

export const fetchOrders = createAsyncThunk(
    AppActions.FETCH_ORDERS,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'order/orders'
        })
    }
);

export const orders = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setHasFetchedOrders: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedOrders = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchOrders.fulfilled,
                (state, {payload: {data}}: PayloadAction<{data: OrderI[], cookies: any}>) => {
                    state.orders = data
                    state.hasFetchedOrders = true
                    state.fetchingOrders = false
                }
            )
    .addCase(
            fetchOrders.pending,
            (state) => {
                state.fetchingOrders = true
            }
        )
            .addCase(
                fetchOrders.rejected,
                (state) => {
                    state.fetchingOrders = false
                }
            )
    },
});

