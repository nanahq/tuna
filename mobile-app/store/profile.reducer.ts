import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {persistence} from "@api/persistence";
import * as Updates from 'expo-updates'


export interface ProfileState {
   accountProfile: AccountProfile | null
   restaurantProfile: RestaurantProfile | null
    restaurantSettings: RestaurantSettings | null
    paymentSettings: PaymentSettings | null
   hasFetchedProfile: boolean
}

interface AccountProfile {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
}

export interface PaymentSettings {
    settlementBankName: string
    settlementBankAccountName: string
    settlementBankAccountNumber: string
}

interface RestaurantProfile {
    businessName: string
    businessPhoneNumber: string
    businessEmail: string
    address: string
    businessLogo: string
}

interface RestaurantSettings {
    businessOperationDays: string[]
    minStartTime: string
    minOrderIntervalTime: string
    maxOrderIntervalDate: string
}
const initialState: ProfileState = {
    accountProfile: {
        phoneNumber: '',
        firstName: '',
        lastName: '',
        email: ''
    } ,
    restaurantProfile: {
        businessEmail: '',
        address: '',
        businessName: '',
        businessLogo: '',
        businessPhoneNumber: '',

    },
    paymentSettings: {
        settlementBankName: '',
        settlementBankAccountName: '',
        settlementBankAccountNumber: ''
    },
    restaurantSettings: {
        businessOperationDays: [],
        minStartTime: '',
        minOrderIntervalTime: '',
        maxOrderIntervalDate: '',
    },
    hasFetchedProfile: false
};

export const fetchProfile = createAsyncThunk(
    AppActions.FETCH_PROFILE,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'vendor/profile'
        })
    }
);


export const profile = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setHasFetchedProfile: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedProfile = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
            fetchProfile.fulfilled,
            (state, {payload: {data}}: PayloadAction<{data: any, cookies: any}>) => {
                state.accountProfile = data.accountProfile
                 state.restaurantProfile = data.restaurantProfile
                state.paymentSettings = data.paymentSettings
                state.restaurantSettings = data.restaurantSettings
                state.hasFetchedProfile = true
            }
        ).addCase(
            fetchProfile.rejected,
            (state, _payload) => {
                console.log(_payload)
                void clearOnAuthError()
            }
        )
    },
});

 export async function clearOnAuthError (nullableState?: any): Promise<void> {
    nullableState !== undefined && (nullableState = null)
    await persistence.deleteSecure()
    await Updates.reloadAsync()
}
