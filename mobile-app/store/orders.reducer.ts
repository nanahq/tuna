import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";


export enum VendorApprovalStatusEnum {
    PENDING = 'REVIEWING', // Default
    APPROVED = 'CLEARED',
    DISAPPROVED = 'RETURNED',
}

export interface OrdersState {
    orders: Order[]
    hasFetchedOrders: boolean
}

export interface Order {
     id: string
     userId: string
     listingId: string
     vendorId: string
     totalOrderValue: number
     orderValueToCharge: number
     orderStatus: OrderStatus
     deliveryMode: OrderDeliveryMode
     deliveryAddress: string
     isThirdParty: boolean
     primaryContact: string
     secondaryContact: string
     customizableOptions: string[]
     addOns: string[]
     orderBreakDown: OrderBreakDown
     refId: number
     updatedAt: string
     deletedAt: string
     createdAt: string
}


export enum OrderStatus {
    PROCESSED = 'ORDER_PLACED', // default order status
    COLLECTED = 'COLLECTED_FROM_VENDOR', // Only vendors can update/use this
    IN_ROUTE = 'OUT_FOR_DELIVERY', // Only admin/rider can update/use this
    FULFILLED = 'DELIVERED_TO_CUSTOMER',
    CANCELLED = 'CANCELLED'
}

export enum OrderDeliveryMode {
    PICKUP = 'ORDER_PICK_UP',
    DELIVERY = 'ORDER_DELIVERY',
}

export interface OrderBreakDown {
    orderCost: number
    systemFee: number
    deliveryFee: number
    vat: number
}

const initialState: OrdersState = {
    orders: [],
    hasFetchedOrders: false
};

export const fetchOrders = createAsyncThunk(
    AppActions.FETCH_ORDERS,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'orders/get-all'
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
                (state, {payload: {data}}: PayloadAction<{data: Order[], cookies: any}>) => {
                    state.orders = data
                    state.hasFetchedOrders = true
                }
            );
    },
});

