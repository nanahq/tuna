import {View, Text} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {useEffect, useState} from "react";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {_api} from "@api/_request";
import {showTost} from "@components/commons/Toast";
import {useToast} from "react-native-toast-notifications";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {useNavigation} from "@react-navigation/native";
import Checkbox from "expo-checkbox";

export const NotificationSettings = () => {
    const [loading, setLoading] = useState(true)
    const [listingNotification, setListingNotification] = useState<boolean | undefined>(undefined)
    const toast = useToast()
    const navigation = useNavigation()
    useEffect(() => {

        void fetchSettings()
    }, [])
    const saveSettings = () => {
        setListingNotification((prev) => !prev)
    }
    async function fetchSettings (): Promise<void> {
        try {
            const scheduledListingsNotifications = (await _api.requestData({
                method: 'GET',
                url: 'vendor/subscription'
            })).data as any
            setListingNotification(scheduledListingsNotifications.enabledByVendor)
        } catch (error) {
            showTost(toast, 'something went wrong fetching settings', 'error')
        } finally {
            setLoading(false)
        }

    }

    if(loading) {
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
