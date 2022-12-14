import {Image, Text, TouchableOpacity, View} from "react-native";
import {tailwind} from "@tailwind";
import ListingsImage from '@assets/app/ListingsItem.png'
import {NavigationProp, useNavigation} from "@react-navigation/native";

export function ListingsCard (): JSX.Element {
    const navigation = useNavigation<NavigationProp<any>>()

    function onPress (): void {
        navigation.navigate("GetListings", {
            params: {listingId: 'hello world'}
        })
    }
    return (
        <TouchableOpacity onPress={onPress} style={tailwind('w-full flex flex-col  rounded-lg mb-5 bg-brand-blue-200 relative')}>
            <Image source={ListingsImage} resizeMode='cover' style={tailwind('w-full rounded-t-lg h-32')} />
            <View style={tailwind('flex flex-row p-2 justify-between w-full')}>
                <Text style={tailwind('text-center text-brand-black-500 text-lg font-medium')}>Shawarma with chicken</Text>
                <View style={tailwind('flex flex-row items-center')}>
                    <Text>Reviews:</Text>
                    <Text>2000</Text>
                </View>
            </View>
            <Status />
        </TouchableOpacity>
    )
}

function  Status (): JSX.Element {
            return (
                <View style={tailwind('py-0.5 px-3 w-20 rounded-bl-lg bg-green-500 absolute top-0 right-0')}>
                    <Text style={tailwind('text-white font-medium text-center text-sm')}>Live</Text>
                </View>
            )
}
