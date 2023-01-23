import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {clearOnAuthError} from "@store/common";


interface Payout {
    payoutNumber: string
    payoutDate: string
    payoutAmount: string
}
export interface WalletState {
    lifeTimeEarnings: string
    dailyEarnings: string
    payoutHistory: Partial<Payout>[],
    hasFetchedWallet: boolean
}


const initialState: WalletState = {
    lifeTimeEarnings: '0',
    dailyEarnings: '0',
    payoutHistory: [],
    hasFetchedWallet: false
};

export const fetchWallet = createAsyncThunk(
    AppActions.FETCH_WALLET,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'vendor/wallet'
        })
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
                (state, {payload: {data}}: PayloadAction<{data: any, cookies: any}>) => {
                    state.hasFetchedWallet = true
                    state.dailyEarnings = data.dailyEarnings
                    state.lifeTimeEarnings = data.lifeTimeEarnings
                    state.payoutHistory = data.payoutHistory
                }
            ).addCase(
            fetchWallet.rejected,
            (state, _payload) => {
                console.log(_payload)
                void clearOnAuthError()
            }
        )
    },
});
