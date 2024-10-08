import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {clearOnAuthError} from "@store/common";
import {ResponseWithStatus, VendorI, SubscriptionNotificationI} from '@nanahq/sticky'
import { showToastStandard } from "@components/commons/Toast";

export interface ProfileState {
  profile: VendorI

    subscription:SubscriptionNotificationI | undefined
  hasFetchedProfile: boolean

    hasFetchedSubscriptions: boolean
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
    subscription: undefined,
    hasFetchedProfile: true,
    hasFetchedSubscriptions: false
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


export const fetchUserSubscription = createAsyncThunk(
    AppActions.FETCH_SUBSCRIPTION,
    async (): Promise<any> => {
        return (await _api.requestData({
            method: 'GET',
            url: 'vendor/subscription'
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
        }).addCase(
            fetchUserSubscription.fulfilled,
            (state, {payload}: any) => {
              state.subscription = payload
                state.hasFetchedSubscriptions = true
            }
        ).addCase(
            fetchUserSubscription.rejected,
            (_, payload: any) => {
                console.error(payload)
            }
        )
    },
});

