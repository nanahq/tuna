import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {VendorSettingsI} from '@imagyne/eatlater-types'

export interface SettingsState {
    settings: VendorSettingsI
    hasFetchedSettings: boolean
}



const initialState: SettingsState = {
    settings: {
        _id: '',
        vendorId: '',
        payment: undefined,
        operations: undefined
    },
    hasFetchedSettings: false
};

export const fetchSettings = createAsyncThunk(
    AppActions.FETCH_SETTINGS,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'vendor/settings'
        })
    }
);


export const settings = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setHasFetchedSettings: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedSettings = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchSettings.fulfilled,
                (state, {payload: {data}}: PayloadAction<{data: VendorSettingsI, cookies: any}>) => {
                    state.settings = {...data}
                    state.hasFetchedSettings = true
                }
            ).addCase(
            fetchSettings.rejected,
            () => {
            }
        )
    },
});
