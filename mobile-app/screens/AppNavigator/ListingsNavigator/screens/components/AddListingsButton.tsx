import {IconButton} from "@components/commons/buttons/IconButton";
import {tailwind} from "@tailwind";
import {NavigationProp} from "@react-navigation/native";

export function AddListingsButton ({navigation}: {navigation: NavigationProp<any>}): JSX.Element {
    return (
        <IconButton
            onPress={() => navigation.navigate("AddListing")}
        iconName='plus-circle'
        iconType="Feather"
        iconStyle={tailwind('text-white')}
        iconSize={32}
        style={tailwind('rounded-full h-20 w-20 bg-secondary-500 flex items-center justify-center  absolute bottom-10 right-5')}
        />
    )
}
