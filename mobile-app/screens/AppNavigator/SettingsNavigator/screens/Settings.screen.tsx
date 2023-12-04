import {Image, Pressable, ScrollView, Text, View} from 'react-native'
import {tailwind} from "@tailwind";
import {SettingsSection} from "@screens/AppNavigator/SettingsNavigator/components/SettingsSection";
import {SettingsParamsList} from "@screens/AppNavigator/SettingsNavigator/SettingsNav";
import {StackScreenProps} from "@react-navigation/stack";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import { RootState, useAppSelector } from '@store/index';
import { useCallback, useEffect, useState } from 'react';
import { CompleteProfileMsg } from '@components/commons/CompleteProfileMsg';
import {  LoaderComponentScreen } from '@components/commons/LoaderComponent';
import { showTost } from '@components/commons/Toast';
import { useToast } from 'react-native-toast-notifications';
import {SettingsScreenName} from "@screens/AppNavigator/SettingsNavigator/SettingsScreenName.enum";

type SettingsScreenProps = StackScreenProps<SettingsParamsList, any>

export function SettingsScreen ({navigation}: SettingsScreenProps): JSX.Element {
    const {profile, hasFetchedProfile} = useAppSelector((state: RootState) => state.profile)
    const {orders} = useAppSelector((state: RootState) => state.orders)
    const toast = useToast()
    const [profileComplete, setProfileComplete] = useState<boolean>(true)

    const {clearToken} = useAuthPersistence()

    useEffect(():void => {
        checkProfileCompleteStatus()
    }, [hasFetchedProfile])

    async  function onLogoutPress (): Promise<void>{
     showTost(toast, 'Logging out', 'success')
     await clearToken()
}

    const restaurantProfileCheck = () => {
        if(profile.restaurantImage === undefined) {
            return false
        } else if (profile.businessLogo === undefined) {
            return false
        } else  if(profile.location?.coordinates[0] === 0 as any) {
            return false
        }

        return true
    }

function checkProfileCompleteStatus (): void {
    if (!hasFetchedProfile ) {
        setProfileComplete(true)
        return
    }

    if (profile.settings?.operations === undefined) {
        setProfileComplete(false)
    }

    if (profile.settings?.payment === undefined) {
        setProfileComplete(false)
    }
}

const ordersDelivered =  useCallback((): string => {
    const num =  orders.filter(order => order.orderStatus === 'DELIVERED_TO_CUSTOMER').length

    return `${num} ${num > 0 ? 'orders'  : 'order'} delivered.`
}, [])


if (!hasFetchedProfile) {
  return   <LoaderComponentScreen />
}
    return (
        <View style={tailwind('flex-1 bg-white')}>
            <View style={tailwind(' w-full flex flex-row items-center px-5 py-8 mb-2 bg-white')}>
                    {profile.businessLogo !== undefined && (  <Image source={{uri: profile.businessLogo}} resizeMode='contain' style={tailwind('w-12 h-12 rounded-full')} />)}
                        <View style={tailwind('flex flex-col ml-4')}>
                            <Text style={tailwind('text-xl font-bold text-brand-black-500')}>Hi, {profile.businessName} </Text>
                            <Text style={tailwind('text-sm text-brand-black-500 font-medium')}>{ordersDelivered()}</Text>
                        </View>
            </View>
            <ScrollView style={tailwind('p-5 pt-0 ')}>
             {!profileComplete && (<CompleteProfileMsg />)}
                <SettingsSection title="Profiles">
                    <SettingsSection.Item
                        subtitle="phone number, emails, password"
                        title="Account Profile"
                        onPress={() => navigation.navigate('AccountProfile')}
                    />
                    <SettingsSection.Item
                        isComplete={restaurantProfileCheck()}
                        subtitle="Restaurant location, name, photos"
                        title="Restaurant Profile" hasBorder={false} onPress={() => navigation.navigate('RestaurantProfile')}  />
                </SettingsSection>
                <SettingsSection title="Settings">
                    <SettingsSection.Item
                        isComplete={profile.settings?.payment !== undefined}
                        subtitle="Settlement bank accounts, withdrawal settings"
                        title="Payment Settings" onPress={() => navigation.navigate('PaymentProfile')}  />
                    <SettingsSection.Item
                        isComplete={profile.settings?.operations !== undefined}
                        subtitle="Restaurant operation, business hours, minimum order"
                        title="Restaurant Settings" onPress={() => navigation.navigate('RestaurantSettings')}  />

                    <SettingsSection.Item
                        subtitle="Notifications, Alert users of new listing"
                        title="Notifications" onPress={() => navigation.navigate(SettingsScreenName.NOTIFICATION_SETTING)}  />

                    <SettingsSection.Item
                        subtitle="Update app, version"
                        title="App Settings" hasBorder={false} onPress={() => navigation.navigate('AccountProfile')} disabled  />

                </SettingsSection>
                <SettingsSection title="Miscellaneous">
                    <SettingsSection.Item
                        subtitle=''
                        title="Submit Complaint"  onPress={() => navigation.navigate('RestaurantProfile')} disabled />
                    <SettingsSection.Item title="App info" onPress={() => navigation.navigate('AccountProfile')} disabled  />
                    <SettingsSection.Item title="Submit Request To Developers" hasBorder={false} onPress={() => navigation.navigate('RestaurantProfile')} disabled />
                </SettingsSection>
            <View style={tailwind('flex flex-col w-full my-5')}>
            <Pressable onPress={onLogoutPress} style={tailwind('flex flex-row items-center border-b-0.5 border-brand-black-500 px-3 py-2')} >
                            <Text style={tailwind('font-bold text-brand-black-500 text-lg')}> Logout</Text>
                        </Pressable>
                        <Pressable onPress={onLogoutPress} style={tailwind('flex flex-row items-center mt-1 px-3 py-2')} >
                            <Text style={tailwind('font-bold text-red-600 text-lg')}> Delete Account</Text>
                        </Pressable>
            </View>
            </ScrollView>
        </View>
    )
}

