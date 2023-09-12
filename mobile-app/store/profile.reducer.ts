import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {clearOnAuthError} from "@store/common";
import {ResponseWithStatus, VendorI} from '@nanahq/sticky'
import { showToastStandard } from "@components/commons/Toast";

export interface ProfileState {
  profile: VendorI
  hasFetchedProfile: boolean
}

const initialState: ProfileState = {
    profile: {
        _id: '',
        businessEmail: '',
        businessName: '',
        businessAddress: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        isValidated: false,
        status: 'ONLINE',
        settings: {
            payment:undefined,
            operations: undefined
        } as any,
        businessLogo: '',
        location: undefined,
        createdAt: '',
        updatedAt: '',
        restaurantImage: '',
        expoNotificationToken: '',
        isDeleted: false
    },
    hasFetchedProfile: true
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

export const updateUserProfile = createAsyncThunk(
    AppActions.UPDATE_PROFILE,
    async (data: Partial<any>): Promise<ResponseWithStatus> => {
        return (await _api.requestData<Partial<any>>({
            method: 'PUT',
            url: 'vendor/profile',
            data
        })).data
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
               state.profile = {...data}
                state.hasFetchedProfile = true
            }
        ).addCase(
            fetchProfile.rejected,
            (_, _payload) => {
                console.log(_payload)
                    showToastStandard('Can not fetch profile', 'error')
                    if (_payload.error.message === 'Unauthorized') {
                        void clearOnAuthError()
                    }
                    if (_payload.error.message?.includes('id is not found')) {
                        void clearOnAuthError()
                    }
            }
        ).addCase(fetchProfile.pending, (state) => {
            state.hasFetchedProfile = false
        })
    },
});
