import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {ListingOptionGroupI, ListingCategoryI, ListingMenuI, ResponseWithStatus, ScheduledListingI} from "@nanahq/sticky";

export interface ListingsState {
    listingsMenu: ListingMenuI[],
    listingsCategory: ListingCategoryI[],
    listingsOptionGroup: ListingOptionGroupI[]
    hasFetchedListings: boolean,

    scheduledListings: ScheduledListingI[]
    fetchingListings: boolean
}

const initialState: ListingsState = {
    listingsMenu: [],
    listingsCategory: [],
    scheduledListings: [],
    listingsOptionGroup: [],
    hasFetchedListings: false,
    fetchingListings: false
};

export const fetchAllListings = createAsyncThunk(
    AppActions.FETCH_ALL_LISTINGS,
    async (): Promise<Omit<ListingsState, 'hasFetchedListings' | 'fetchingListings'>> => {
        const [{data: listingsMenu}, {data:listingsCategory  }, {data: listingsOptionGroup}, {data: scheduledListings}] = await Promise.all([
            _api.requestData<undefined>({
                method: 'get',
                url: 'listing/menus'
            }),
            _api.requestData<undefined>({
                method: 'get',
                url: 'listing/categories'
            }),
            _api.requestData<undefined>({
                method: 'get',
                url: 'listing/options'
            }),
            _api.requestData<undefined>({
                method: 'get',
                url: 'listing/scheduled'
            })
        ])

        return {
            listingsCategory,
            listingsMenu,
            listingsOptionGroup,
            scheduledListings
        }
    }
);

export const fetchCategories = createAsyncThunk(
    AppActions.FETCH_CATEGORIES,
    async () => {
        return (await _api.requestData({
            method: 'get',
            url: 'listing/categories'
        })).data
    }
)

export const fetchOptions = createAsyncThunk(
    AppActions.FETCH_OPTIONS,
    async () => {
        return (await _api.requestData<undefined>({
            method:'get',
            url: 'listing/options'
        })).data
    }
)

export const fetchScheduled = createAsyncThunk(
    AppActions.FETCH_SCHEDULED,
    async () => {
        return (await _api.requestData<undefined>({
            method:'get',
            url: 'listing/scheduled'
        })).data
    }
)

export const fetchMenus = createAsyncThunk(
    AppActions.FETCH_MENUS,
    async () => {
        return (await _api.requestData<undefined>({
            method:'get',
            url: 'listing/menus'
        })).data
    }
)


export const addMenu = createAsyncThunk(
    AppActions.ADD_MENU,
    async (payload: any, {dispatch}): Promise<ResponseWithStatus> => {
            const res = (await _api.requestData({
                method: 'post',
                url: 'listing/menu',
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
                data: payload
            })).data

            dispatch(fetchMenus())
            return res

    }
)


export const deleteMenu = createAsyncThunk(
    AppActions.DELETE_MENU,
    async (id: any, {dispatch}) => {
            await _api.requestData<any>({
                method: 'put',
                url: '/listing/menu',
                data: {isDeleted: true, menuId: id}
            })
            await dispatch(fetchMenus())

    }
)

export const addOrUpdateCategory = createAsyncThunk(
    AppActions.UPDATE_CATEGORY,
    async (data: {type: string, payload: any}, {dispatch}): Promise<any> => {
        const {payload, type} = data
           const res = (await _api.requestData({
               method: type === 'UPDATE' ? 'put' : 'post',
               url: 'listing/category',
               data: payload
           })).data
            dispatch(fetchCategories())
           return res
}
)
export const updateMenu = createAsyncThunk(
    AppActions.UPDATE_MENU,
    async  ({payload}: any, {dispatch}): Promise<ResponseWithStatus> => {
        try {
            const data =  (await _api.requestData<any>({
                method: 'put',
                url: 'listing/menu',
                data: payload

            })).data
            dispatch(fetchMenus())
            return data
        } catch (e) {
            throw  new Error('something went wrong')
        }
    }
)
export const updateOptionGroup = createAsyncThunk(
    AppActions.UPDATE_OPTION_GROUP,
    async  ({payload, type}: any, {dispatch}): Promise<ResponseWithStatus> => {
        try {
            const data =  (await _api.requestData<any>({
                method: type === 'update' ? 'put' : 'post',
                url: 'listing/option',
                data: payload

            })).data
            dispatch(fetchOptions())
            return data
        } catch (e) {
            throw  new Error('something went wrong')
        }
    }
)

export const listings = createSlice({
    name: "listings",
    initialState,
    reducers: {
        setHasFetchedListings: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedListings = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchAllListings.fulfilled,
                (state, {payload: data}: PayloadAction<Omit<ListingsState, 'hasFetchedListings' | 'fetchingListings'>>) => {
                    state.listingsMenu = data.listingsMenu
                    state.listingsCategory = data.listingsCategory
                    state.scheduledListings = data.scheduledListings
                    state.listingsOptionGroup = data.listingsOptionGroup
                    state.hasFetchedListings = true
                    state.fetchingListings = false
                }
            ).addCase(
                fetchAllListings.rejected,
            (state) => {
                    state.fetchingListings = false
                    state.hasFetchedListings = false
            }
        ).addCase(
            fetchAllListings.pending,
            (state) => {
                state.fetchingListings = true
            }
        ).addCase(
            fetchOptions.fulfilled,
            (state, {payload}: PayloadAction<ListingOptionGroupI[]>) => {
                state.listingsOptionGroup = payload
            }
        ).addCase(
            fetchMenus.fulfilled,
            (state, {payload}: PayloadAction<ListingMenuI[]>) => {
                console.log(payload)
                state.listingsMenu = payload
            }
        ).addCase(
            fetchCategories.fulfilled,
            (state, {payload}: PayloadAction<ListingCategoryI[]>) => {
                state.listingsCategory = payload
            }
        )
    },
});

