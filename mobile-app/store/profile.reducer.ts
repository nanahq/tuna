import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {clearOnAuthError} from "@store/common";
import {ResponseWithStatus, VendorI} from '@imagyne/eatlater-types'

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
        password: '' ,
        phone: '',
        isValidated: false,
        status: 'ONLINE',
        settings: {} as any,
        businessLogo: '',
        location: undefined,
        createdAt: '',
        updatedAt: ''
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

export const updateUserProfile = createAsyncThunk(
    AppActions.UPDATE_PROFILE,
    async (data: Partial<VendorI>): Promise<ResponseWithStatus> => {
        return (await _api.requestData<Partial<VendorI>>({
            method: 'PUT',
            url: 'vendor/update-profile',
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
            (state, _payload) => {
                    if (_payload.error.message === 'Unauthorized') {
                        void clearOnAuthError()
                    }
            }
        )
    },
});
