import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {ListingOptionGroupI, ListingCategoryI, ListingMenuI, ResponseWithStatus} from "@imagyne/eatlater-types";

export interface ListingsState {
    listingsMenu: ListingMenuI[],
    listingsCategory: ListingCategoryI[],
    listingsOptionGroup: ListingOptionGroupI[]
    hasFetchedListings: boolean,
    fetchingListings: boolean
}

const initialState: ListingsState = {
    listingsMenu: [],
    listingsCategory: [],
    listingsOptionGroup: [],
    hasFetchedListings: false,
    fetchingListings: false
};

export const fetchAllListings = createAsyncThunk(
    AppActions.FETCH_ALL_LISTINGS,
    async (): Promise<Omit<ListingsState, 'hasFetchedListings' | 'fetchingListings'>> => {

        const [{data: listingsMenu}, {data:listingsCategory  }, {data: listingsOptionGroup}] = await Promise.all([
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
            })
        ])
        return {
            listingsCategory,
            listingsMenu,
            listingsOptionGroup
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
        try {
            await _api.requestData<any>({
                method: 'put',
                url: '/listing/menu',
                data: {isDeleted: true, menuId: id}
            })
            await dispatch(fetchMenus())
            return
        } catch (e) {
            throw e
        }
    }
)

export const addOrUpdateCategory = createAsyncThunk(
    AppActions.UPDATE_CATEGORY,
    async (data: {type: string, payload: any}, {dispatch}): Promise<any> => {
        const {payload, type} = data
       try {
           const res = (await _api.requestData({
               method: type === 'UPDATE' ? 'put' : 'post',
               url: 'listing/category',
               data: payload
           })).data
           console.log(res)
            dispatch(fetchCategories())
           return res
       } catch (e) {
           throw e
       }
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
                    state.listingsOptionGroup = data.listingsOptionGroup
                    state.hasFetchedListings = true
                    state.fetchingListings = false
                }
            ).addCase(
                fetchAllListings.rejected,
            (state, _payload) => {
                    state.fetchingListings = false
                    state.hasFetchedListings = false
            }
        ).addCase(
            fetchAllListings.pending,
            (state, _) => {
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

