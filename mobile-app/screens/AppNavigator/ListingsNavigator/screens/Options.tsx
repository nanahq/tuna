import {View} from 'react-native'
import {EmptyMenu} from "@components/Empty/Listings";

export function ListingsOptions (props: {options: any[]}): JSX.Element {
    if (props.options.length <= 0) {
        return (
            <EmptyMenu type='OPTION' title="Options" subtitle='Add options and add-ons. Meat, Chillis, Zobo etc' />
        )
    }
    return (
        <View/>
    )
}
