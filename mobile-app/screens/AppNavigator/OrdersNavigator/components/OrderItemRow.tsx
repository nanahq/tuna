import {Image, StyleProp, Text, TextProps, View, ViewProps, ViewStyle} from 'react-native'
import {tailwind} from '@tailwind'
import {PropsWithChildren, useMemo} from "react";
import {ListingMenuI, OrderI} from "@nanahq/sticky";
import {OrderOptions} from "@nanahq/sticky/dist/libs/common/src/typings";

interface OrderItemRowProps{
    title: string
    text: string
    titleStyle?: StyleProp<TextProps>
    textStyle?: StyleProp<TextProps>
    containerStyle?: StyleProp<any>
}

 function OrderItemRow (props: OrderItemRowProps): JSX.Element {
    return (
        <View style={[tailwind('flex flex-row items-center'), props.containerStyle]}>
            <Text style={[tailwind('text-brand-black-500 text-lg'), props.titleStyle]}>{props.title}</Text>
            <Text style={[tailwind('text-brand-black-500 ml-1 text-lg '), props.textStyle]}>{props.text}</Text>
        </View>
    )
}




export function OrderSection (props:PropsWithChildren<{width?: StyleProp<ViewStyle>, heading: string, fullWidth?: boolean}>): JSX.Element {
    const {heading , children, fullWidth = true} = props
    return (
        <View style={[tailwind('flex flex-col', {
            'w-full': fullWidth
        }), props.width as any]}>
            <Text style={tailwind('text-xl text-brand-black-500 my-2.5')}>{heading}</Text>
            {children}
        </View>
    )
}

export const OrderListingItem: React.FC<{
    listing: ListingMenuI,
    quantities: {
        listing: string;
        quantity: number;
    }[],
    options: OrderOptions[]}> = (props) => {
    const options = useMemo(() => {
        return (props.options.filter(op => op.listing === props.listing._id)).flatMap(op => op.options).join(', ')
    }, [props.options])

    const quantity = useMemo(() => {
        return (props.quantities.filter(op => op.listing === props.listing._id)).map(op => op.quantity).join(',')
    }, [props.quantities])

    return (
        <View style={tailwind('mb-3')}>
            <View style={tailwind('flex flex-row items-center')}>
                <Image
                    source={{uri: props.listing.photo, cache: 'force-cache'}}
                    resizeMode="cover" style={[tailwind('rounded-lg'), {width: 50, height: 50}]}
                />
                <View style={tailwind('flex flex-col ml-4')}>
                    <Text style={tailwind('text-lg')}>{props.listing.name} X {quantity}</Text>
                    <Text>{options}</Text>
                </View>
            </View>

        </View>
    )
}

OrderSection.Row = OrderItemRow
