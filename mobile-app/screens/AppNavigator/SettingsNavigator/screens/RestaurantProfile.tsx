import {tailwind} from "@tailwind";
import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {ScrolledView} from "@components/views/ScrolledView";
import {useState} from "react";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import Toast from 'react-native-toast-message'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {useNavigation} from "@react-navigation/native";
import {IconButton} from "@components/commons/buttons/IconButton";
import * as Location from 'expo-location'
import * as ImagePicker from "expo-image-picker";


const RestaurantProfileInteraction = {
    UPDATING_PROFILE_MESSAGE: 'Updating profile',
    GETTING_LOCATION_MESSAGE: 'Getting location',
    PROFILE_UPDATE_SUCCESS: 'Profile updated!',
    UPDATE_PROFILE_BTN: 'Update profile',
    GET_LOCATION_FAILED: 'Permission to access location was denied',
    GET_LOCATION_BTN: 'Update Location Coordinates',
    COORD_UPDATE: 'location coordinates updated!'
}
export interface RestaurantProfile {
    businessName: string
    businessPhoneNumber: string
    businessEmail: string
    address: string
}
export interface PasswordForm {
    password: string
    confirmPassword: string
}



const showToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
        type: type,
        text1: message,
        autoHide: true
    });
}
export function RestaurantProfile (): JSX.Element {
    const navigation  = useNavigation()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [editProfileState, setEditProfileState] = useState<boolean>(false)
    const [gettingLocation, setGettingLocation] = useState<boolean>(false)
    const [logoUri, setLogoUri] = useState<string | null>(null)
    const [form, setForm] = useState<RestaurantProfile>({
        businessName: '',
        businessEmail: '',
        businessPhoneNumber: '',
        address: '',
    })


    function onChange (name: keyof RestaurantProfile, value: string, section = 'profile'): void {
        setForm((prevState) => ({...prevState, [name]: value}))
    }


    function updateBusinessLogo (): void {

    }

    async function requestLocation (): Promise<void> {
        setGettingLocation(true)

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
        showToast('error', RestaurantProfileInteraction.GET_LOCATION_FAILED)
    }
        await Location.getCurrentPositionAsync({});
        setGettingLocation(false)
        showToast('success', RestaurantProfileInteraction.COORD_UPDATE)
    }

    async function updateProfile (): Promise<void> {
        setSubmitting(true)
        setEditProfileState(false)
        setSubmitting(false)
        showToast('success', RestaurantProfileInteraction.PROFILE_UPDATE_SUCCESS)


    }


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: 1,
        });

        if (!result.canceled) {
            const image = result?.assets.map(asset => asset.uri)
            setLogoUri(image[0]);

        }
    };

    return (
        <SafeAreaView>
            <ScrolledView testId="AccountProfile.View" style={[tailwind('flex w-full px-5 mt-5')]}>
                <GoBackButton onPress={() => navigation.goBack()} />
                    <View style={tailwind('flex flex-row w-full justify-center')}>
                        <View style={tailwind('flex flex-col items-center')}>
                            <TouchableOpacity onPress={pickImage}  style={tailwind('w-16 h-16 rounded-full bg-brand-gray-700')}/>
                            <Text>Logo</Text>
                        </View>
                    </View>
                    <ProfileSection sectionName="Restaurant information" onPress={() => setEditProfileState(true)}>
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Business Name'
                            testID='AccountProfile.Email.Input'
                            labelTestId="AccountProfile.Email.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={form.businessName}
                            onChangeText={(value) => onChange('businessName', value)}

                        />
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Business Phone Number'
                            testID='AccountProfile.PhoneNumber.Input'
                            labelTestId="AccountProfile.PhoneNumber.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={form.businessPhoneNumber}
                            onChangeText={(value) => onChange('businessPhoneNumber', value)}

                        />
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Business Email'
                            testID='AccountProfile.Email.Input'
                            labelTestId="AccountProfile.Email.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={form.businessEmail}
                            onChangeText={(value) => onChange('businessEmail', value)}

                        />
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Address'
                            testID='AccountProfile.Email.Input'
                            labelTestId="AccountProfile.Email.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={form.address}
                            onChangeText={(value) => onChange('address', value)}

                        />
                    </ProfileSection>

                {editProfileState  && (
                    <GenericButton
                        loading={submitting}
                        style={tailwind('mt-4')}
                        labelColor={tailwind('text-white')}
                        onPress={() => updateProfile()}
                        label={RestaurantProfileInteraction.UPDATE_PROFILE_BTN}
                        backgroundColor={tailwind('bg-brand-black-500')}
                        testId="Accountprofile.editButton" />
                )}


                {!editProfileState && (
                    <ProfileSection sectionName='Location Coordinates' leftComponent={<InfoHover />}>
                        <GenericButton
                            style={tailwind('my-4')}
                            loading={gettingLocation}
                            onPress={() => void requestLocation() }
                            label={gettingLocation ? RestaurantProfileInteraction.GETTING_LOCATION_MESSAGE : RestaurantProfileInteraction.GET_LOCATION_BTN}
                            labelColor={tailwind('text-brand-gray-700')}
                            backgroundColor={tailwind('bg-brand-gray-200')} testId="Loc.Cord" />
                    </ProfileSection>
                )}
            </ScrolledView>
        </SafeAreaView>
    )
}


function InfoHover (): JSX.Element {
    return (
        <IconButton iconName='info' iconType='Feather' iconSize={24}  iconStyle={tailwind('text-brand-gray-700')} />
    )
}
