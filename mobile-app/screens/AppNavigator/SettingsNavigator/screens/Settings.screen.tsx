import {Pressable, ScrollView, Text} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {tailwind} from "@tailwind";
import {SettingsSection} from "@screens/AppNavigator/SettingsNavigator/components/SettingsSection";
import {SettingsParamsList} from "@screens/AppNavigator/SettingsNavigator/SettingsNav";
import {StackScreenProps} from "@react-navigation/stack";
import {IconComponent} from "@components/commons/IconComponent";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import Toast from "react-native-toast-message";

type SettingsScreenProps = StackScreenProps<SettingsParamsList, any>

export function SettingsScreen ({navigation}: SettingsScreenProps): JSX.Element {
    const {clearToken} = useAuthPersistence()
    async  function onLogoutPress (): Promise<void>{
    (await clearToken())
    Toast.show({
        type: 'success',
        text1: 'Logging out',
        autoHide: true
    });
}
    return (
        <SafeAreaView style={tailwind('flex-1 bg-white')}>
            <ScrollView style={tailwind('p-5 pt-0')}>
                <SettingsSection title="Profiles">
                    <SettingsSection.Item
                        subtitle="phone number, emails, password"
                        title="Account Profile"
                        onPress={() => navigation.navigate('AccountProfile')}
                    />
                    <SettingsSection.Item
                        subtitle="Restaurant location, name, photos"
                        title="Restaurant Profile" hasBorder={false} onPress={() => navigation.navigate('RestaurantProfile')}  />
                </SettingsSection>
                <SettingsSection title="Settings">
                    <SettingsSection.Item
                        subtitle="Settlement bank accounts, withdrawal settings"
                        title="Payment Settings" onPress={() => navigation.navigate('PaymentProfile')}  />
                    <SettingsSection.Item
                        subtitle="Availability dates and time "
                        title="Restaurant Settings" onPress={() => navigation.navigate('RestaurantSettings')}  />
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

               <Pressable onPress={onLogoutPress} style={tailwind('flex flex-row')}>
                   <Text style={tailwind('font-semibold text-brand-black-500 text-lg')}> Logout</Text>
                   <IconComponent iconType='Feather' name='power'  size={20} style={tailwind('text-brand-black-500 ml-1')}/>
               </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}
