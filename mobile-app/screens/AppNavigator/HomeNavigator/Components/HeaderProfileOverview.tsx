import {Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {IconButton} from "@components/commons/buttons/IconButton";

export function HeaderProfileOverview (): JSX.Element {
    return (
        <View style={tailwind('flex flex-col')}>
            <Text style={tailwind('font-medium text-lg text-white')}>Hi Suraj!</Text>
            <View style={tailwind('mt-2 flex flex-row items-center ')}>
                <ReviewsOverview />
                <ShareProfile />
            </View>
        </View>
    )
}


function ReviewsOverview (): JSX.Element {
    return (
        <View style={tailwind('flex flex-row items-center')} testID="HeaderProfileOverview.ReviewsOverview">
            <IconComponent iconType='Feather' name='thumbs-up' size={16} style={tailwind('text-brand-green-500')} />
            <Text style={tailwind('text-white font-normal text-sm ml-1.5')}>4.5 (1000 reviews)</Text>
        </View>
    )
}


function ShareProfile (): JSX.Element {
    return (
        <View style={tailwind('flex flex-row items-center ml-3')} testID="HeaderProfileOverview.ShareProfile">
            <Text style={tailwind('text-white font-normal text-sm')}>Share</Text>
            <IconButton iconType='Feather' iconName='share-2' iconSize={16} style={tailwind('ml-1.5')} iconStyle={tailwind('text-white')} />
        </View>
    )
}
