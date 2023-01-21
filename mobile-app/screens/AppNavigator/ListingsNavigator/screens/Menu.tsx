import {View} from 'react-native'
import {EmptyMenu} from "@components/Empty/Listings";

export function ListingsMenu (props: {menu: any[]}): JSX.Element {
    if (props.menu.length <= 0) {
        return (
            <EmptyMenu
                type='MENU'
                title="Menu"
                subtitle='Food and drinks you sell. Add them here'
            />
        )
    }
    return (
        <View/>
    )
}
