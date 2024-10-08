/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {configureStore} from "@reduxjs/toolkit";
import {profile} from "@store/profile.reducer";
import {orders} from "@store/orders.reducer";
import {wallet} from "@store/wallet.reducer";
import {reviews} from "@store/reviews.reducer";
import {settings} from "@store/settings.reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {listings} from "@store/listings.reducer";
import {deliveries} from "@store/delivery.reducer";
/**
 * RootState for EatLater vendors App
 *
 * All state reducer in this store must be designed for global use and placed in this
 * directory as such. Reducer that are not meant to be global must not be part of
 * RootState.
 *
 * Non-global state should be managed independently within its own React Component.
 */
export function initializeStore() {
    return configureStore({
        reducer: {
            profile: profile.reducer,
            orders: orders.reducer,
            wallet: wallet.reducer,
            reviews: reviews.reducer,
            settings: settings.reducer,
            listings: listings.reducer,
            deliveries: deliveries.reducer

        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false })
    });
}

export type RootStore = ReturnType<typeof initializeStore>;
export type RootState = ReturnType<RootStore["getState"]>;

const store = initializeStore()

export type AppDispatch = typeof store.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
