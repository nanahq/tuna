import {Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {IconButton} from "@components/commons/buttons/IconButton";
import {useSelector} from "react-redux";
import {RootState} from "@store/index";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {SkeletonLoader, SkeletonLoaderScreen} from "@components/SkeletonLoaders/SkeletonLoader";

export function HeaderProfileOverview (): JSX.Element {
    const {hasFetchedProfile, profile} = useSelector((state: RootState) => state.profile)
    const insets = useSafeAreaInsets()
    if (!hasFetchedProfile || profile === null) {
        return (
            <View style={[tailwind('w-full'), {paddingTop: insets.top + 30}]}>
                <SkeletonLoader row={1} screen={SkeletonLoaderScreen.ProfileHeader} />
            </View>
        )
    }

    return (
        <View style={tailwind('flex flex-col text-brand-black-500')}>
            <Text style={tailwind('font-medium text-lg text-brand-black-500 ')}>{`Hi ${profile.businessName}`}</Text>
            <View style={tailwind('mt-2 flex flex-row items-center ')}>
                <ReviewsOverview  />
                <ShareProfile />
            </View>
        </View>
    )
}


function ReviewsOverview (): JSX.Element {
    return (
        <View style={tailwind('flex flex-row items-center')} testID="HeaderProfileOverview.ReviewsOverview">
            <IconComponent iconType='Feather' name='thumbs-up' size={16} style={tailwind('text-brand-green-500')} />
            <Text style={tailwind('font-normal text-sm ml-1.5 text-brand-black-500')}>4.5 (1000 reviews)</Text>
        </View>
    )
}


function ShareProfile (): JSX.Element {
    return (
        <View style={tailwind('flex flex-row items-center ml-3')} testID="HeaderProfileOverview.ShareProfile">
            <Text style={tailwind('font-normal text-sm')}>Share</Text>
            <IconButton iconType='Feather' iconName='share-2' iconSize={16} style={tailwind('ml-1.5')} iconStyle={tailwind('text-brand-black-500')} />
        </View>
    )
}
