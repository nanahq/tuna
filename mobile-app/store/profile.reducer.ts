import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {persistence} from "@api/persistence";
import * as Updates from 'expo-updates'

export enum VendorApprovalStatusEnum {
    PENDING = 'REVIEWING', // Default
    APPROVED = 'CLEARED',
    DISAPPROVED = 'RETURNED',
}

export interface ProfileState {
   profile: Profile | null
   hasFetchedProfile: boolean
}

interface Profile {
    businessName: string
    firstName: string
    lastName: string
    businessPhoneNumber: string
    settlementBankName: string
    settlementBankAccountName: string
    approvalStatus: VendorApprovalStatusEnum
    address: string
    email: string
}


const initialState: ProfileState = {
    profile: {
        businessName: '',
        firstName: '',
        lastName: '',
        businessPhoneNumber: '',
        settlementBankName: '',
        settlementBankAccountName: '',
        approvalStatus: VendorApprovalStatusEnum.PENDING,
        address: '',
        email: '',
    } ,
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
            (state, {payload: {data}}: PayloadAction<{data: Profile, cookies: any}>) => {
                state.profile = data
                state.hasFetchedProfile = true
            }
        ).addCase(
            fetchProfile.rejected,
            (state, _payload) => {
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
