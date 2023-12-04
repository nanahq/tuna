import {View, Text} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {useEffect, useState} from "react";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {useNavigation} from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import {useAppSelector} from "@store/index";

export const NotificationSettings = () => {
    const {hasFetchedSubscriptions, subscription} = useAppSelector(state => state.profile)
    const [listingNotification, setListingNotification] = useState<boolean | undefined>(undefined)
    const navigation = useNavigation()

    useEffect(() => {

        if(subscription !== undefined) {
            setListingNotification(subscription.enabledByVendor)
        }

    }, [hasFetchedSubscriptions, subscription])
    const saveSettings = () => {
        setListingNotification((prev) => !prev)
    }
    if(!hasFetchedSubscriptions) {
        return <LoaderComponentScreen />
    }

    return (
        <View style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('px-5 pt-4')}>
                <GoBackButton onPress={() => navigation.goBack()} />
                <View style={tailwind('mt-4')}>
                    <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                        <View style={tailwind('w-2/3')}>
                            <Text style={tailwind('font-medium text-base text-brand-black-500')}>Allow users to subscribe to a new listing</Text>
                            <Text style={tailwind('font-normal my-1 text-xs text-brand-gray-700')}>This will allow customers to subscribe to your restaurant and get notified when ever you make a new listing</Text>
                            <Text style={tailwind('font-normal text-xs text-warning-500')}>Is only available for Vendors with pre-order delivery</Text>
                        </View>
                        <Checkbox
                            style={tailwind('m-2 p-3')}
                            onValueChange={saveSettings}
                            value={listingNotification}
                            color={listingNotification ? getColor('black') : undefined}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}
