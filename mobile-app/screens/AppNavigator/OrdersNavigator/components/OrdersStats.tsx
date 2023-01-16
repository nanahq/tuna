import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {SkeletonLoader, SkeletonLoaderScreen} from "@components/SkeletonLoaders/SkeletonLoader";

interface OrdersStatsProps {
    completed: number
    cancelled: number
    pending: number
    hasFetchedOrders: boolean
}

export function OrdersStats (props: OrdersStatsProps): JSX.Element {
    return  (
        <View style={tailwind('flex flex-col w-full')}>
            <Text style={tailwind('font-bold text-lg text-brand-black-500 mb-2')}>Your orders</Text>
            <View style={tailwind('border-0.5 border-brand-black-500 p-4 flex flex-row items-center justify-between')}>
                {props.hasFetchedOrders ? (
                    <>
                        <Stat label='Pending Orders' numbers={props.pending} testId="OrdersStats.PendingOrders" />
                        <Stat label='Completed Orders' numbers={props.completed} testId="OrdersStats.Delivered" />
                        <Stat label='Cancelled Orders' numbers={props.cancelled} testId="OrdersStats.Cancelled" />
                    </>
                ): (
                    <SkeletonLoader row={1} screen={SkeletonLoaderScreen.OrdersStats} />
                )}
            </View>
        </View>
    )
}

function Stat ({label, numbers, testId}: {label: string, numbers: number, testId: string}): JSX.Element {
    return (
        <View testID={testId} style={tailwind('flex flex-col w-1/4')}>
            <Text style={tailwind('text-center font-bold text-2xl text-brand-black-500')}>{numbers}</Text>
            <Text style={tailwind('mt-1 font-medium text-center text-sm text-brand-black-500')}>{label}</Text>
        </View>
    )
}
