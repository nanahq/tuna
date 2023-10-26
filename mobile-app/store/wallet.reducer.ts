import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {clearOnAuthError} from "@store/common";
import {VendorPayoutI, PayoutOverview} from '@nanahq/sticky'

export interface WalletState {
    overview: PayoutOverview
    payouts: VendorPayoutI[]
    hasFetchedWallet: boolean
}


const initialState: WalletState = {
    overview: {
        '24_hours': 0,
        '7_days': 0,
        '30_days': 0
    },
    payouts: [],
    hasFetchedWallet: false
};

export const fetchWallet = createAsyncThunk(
    AppActions.FETCH_WALLET,
    async () => {
        const [payouts, overview] = await Promise.all([
            _api.requestData<undefined>({
                method: 'get',
                url: 'wallet/payouts'
            }),
            _api.requestData<undefined>({
                method: 'get',
                url: 'wallet/overview'
            })
        ])
        return {payouts: payouts.data, overview: overview.data}
    }
);


export const wallet = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setHasFetchedWallet: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedWallet = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchWallet.fulfilled,
                (state, {payload: {payouts, overview}}: PayloadAction<{payouts: VendorPayoutI[], overview: PayoutOverview}>) => {
                    state.overview = overview
                    state.payouts = payouts
                    state.hasFetchedWallet = true
                }
            ).addCase(
            fetchWallet.rejected,
            () => {
                void clearOnAuthError()
            }
        )
    },
});
