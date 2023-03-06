import {ProfileHeaderSkeleton} from "@components/SkeletonLoaders/ProfileHeaderSkeleton";
import {OrderStatsLoader} from "@components/SkeletonLoaders/OrderStatsLoader";
import { AccountSettingsLoaderScreen } from "./InputLoader";

interface SkeletonLoaderProp {
    row: number;
    screen: SkeletonLoaderScreen;
}

export enum SkeletonLoaderScreen {
    "ProfileHeader" = "ProfileHeader",
    "Listings" = "Listings",
    "Orders" = "Orders",
    "Earnings"  = "Earnings",
    "OrdersStats" = "OrdersStats",
    "AccountSettings" = "AccountSettings"
}


export function SkeletonLoader (props: SkeletonLoaderProp): JSX.Element {
    const skeletonRow = Array.from(Array(props.row), (_v, i) => i + 1);
    switch (props.screen) {
        case SkeletonLoaderScreen.ProfileHeader:
            return (
                <>
                    {skeletonRow.map(i => (
                        <ProfileHeaderSkeleton key={i}/>
                    ))}
                </>
            )

        case SkeletonLoaderScreen.AccountSettings:
            return (
                <>
                     {skeletonRow.map(i => (
                        <AccountSettingsLoaderScreen key={i}/>
                    ))}
                </>
            )

        case SkeletonLoaderScreen.Listings:
            return (
                <>
                    {skeletonRow.map(i => (
                        <ProfileHeaderSkeleton key={i}/>
                    ))}
                </>
            )
        case SkeletonLoaderScreen.Orders:
            return (
                <>
                    {skeletonRow.map(i => (
                        <ProfileHeaderSkeleton key={i}/>
                    ))}
                </>
            )
        case SkeletonLoaderScreen.Earnings:
            return (
                <>
                    {skeletonRow.map(i => (
                        <ProfileHeaderSkeleton key={i}/>
                    ))}
                </>
            )
            
        case SkeletonLoaderScreen.OrdersStats:
            return (
                <>
                    {skeletonRow.map(i => (
                        <OrderStatsLoader key={i}/>
                    ))}
                </>
            )
        default: 
        return <></>
    }
}
