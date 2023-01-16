import {Text, View} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {tailwind} from "@tailwind";
import {SettingsSection} from "@screens/AppNavigator/SettingsNavigator/components/SettingsSection";
import {SettingsParamsList} from "@screens/AppNavigator/SettingsNavigator/SettingsNav";
import {StackScreenProps} from "@react-navigation/stack";


type SettingsScreenProps = StackScreenProps<SettingsParamsList, any>

export function SettingsScreen ({navigation}: SettingsScreenProps): JSX.Element {
    return (
        <SafeAreaView style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('p-5 pt-12')}>
                <SettingsSection title="Account Settings">
                    <SettingsSection.Item title="Account Profile" onPress={() => navigation.navigate('AccountProfile')}  />
                    <SettingsSection.Item title="Restaurant Profile" hasBorder={false} onPress={() => navigation.navigate('RestaurantProfile')}  />
                </SettingsSection>
                <SettingsSection title="Payment Settings">
                    <SettingsSection.Item title="Settlement Bank" onPress={() => navigation.navigate('AccountProfile')}  />
                    <SettingsSection.Item title="Submit Complaint" hasBorder={false} onPress={() => navigation.navigate('RestaurantProfile')}  />
                </SettingsSection>
                <SettingsSection title="App Settings">
                    <SettingsSection.Item title="Update App" onPress={() => navigation.navigate('AccountProfile')}  />
                    <SettingsSection.Item title="Submit Request To Developers" hasBorder={false} onPress={() => navigation.navigate('RestaurantProfile')}  />
                </SettingsSection>

                <View style={tailwind('flex flex-row items-center justify-between')}>
                    <Text style={tailwind('text-brand-gray-800')}>Made with Love from Kano HQ</Text>
                    <Text style={tailwind('text-brand-gray-800')}>Version 0.0.1</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}
