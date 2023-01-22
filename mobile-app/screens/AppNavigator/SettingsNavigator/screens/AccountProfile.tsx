import {getColor, tailwind} from "@tailwind";
import {SafeAreaView, View} from "react-native";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {ScrolledView} from "@components/views/ScrolledView";
import {useState} from "react";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {useSelector} from "react-redux";
import {RootState} from "@store/index";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import Toast from 'react-native-toast-message'
import {useNavigation} from "@react-navigation/native";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";

export interface AccountProfileForm {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string


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
export function AccountProfile (): JSX.Element {
    const {hasFetchedProfile, accountProfile } = useSelector((state: RootState) => state.profile)
    const navigation = useNavigation()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [editProfileState, setEditProfileState] = useState<boolean>(false)
    const [editPassword, setEditPassword ] = useState<boolean>(false)

    const [form, setForm] = useState<AccountProfileForm>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
    })

    const [passwordForm, setPasswordForm] = useState<PasswordForm>({
        password: '',
        confirmPassword: ''
    })

    function onChange (name: string, value: string, section = 'profile'): void {
        switch (section) {
            case 'profile':
                setForm((prevState) => ({...prevState, [name]: value}))
                break;
            case 'password':
                setPasswordForm((prevState) => ({...prevState, [name]: value}))
        }
    }


   async function updateProfile (type: 'password' | 'profile'): Promise<void> {
        setSubmitting(true)
        switch (type) {
            case "profile":
                setEditProfileState(false)
                setSubmitting(false)
                showToast('success', 'Profile Updated')
                break;
            case "password":
                setEditPassword(false)
                setSubmitting(false)
                showToast('success', 'Password updated')
                break;
        }

    }
    // TODO(@siradji) Improve data fields when not editing
    return (
        <SafeAreaView>
            <ScrolledView testId="AccountProfile.View" style={tailwind('flex w-full px-5 mt-5')}>
                <GoBackButton onPress={() => navigation.goBack()} />
                {!editPassword && (
                    <ProfileSection sectionName="Account information" onPress={() => setEditProfileState(true)}>
                        <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                            <TextInputWithLabel
                                editable={editProfileState}
                                label='First Name'
                                testID='AccountProfile.FirstName.Input'
                                style={{
                                    width: 160
                                }}
                                labelTestId="AccountProfile.FirstName.Label"
                                value={form.firstName}
                                onChangeText={(value) => onChange('firstName', value)}
                            />
                            <TextInputWithLabel
                                editable={editProfileState}
                                label='Last Name'
                                testID='AccountProfile.LastName.Input'
                                labelTestId="AccountProfile.LastName.Label"
                                style={{
                                    width: 160
                                }}
                                value={form.lastName}
                                onChangeText={(value) => onChange('lastName', value)}
                            />
                        </View>
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Phone Number'
                            testID='AccountProfile.PhoneNumber.Input'
                            labelTestId="AccountProfile.PhoneNumber.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={form.phoneNumber}
                            onChangeText={(value) => onChange('phoneNumber', value)}

                        />
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Email'
                            testID='AccountProfile.Email.Input'
                            labelTestId="AccountProfile.Email.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={form.email}
                            onChangeText={(value) => onChange('email', value)}

                        />
                    </ProfileSection>
                )}
                {!editProfileState && (
                    <ProfileSection sectionName='Password' onPress={() => setEditPassword(true)}>
                        <TextInputWithLabel
                            editable={editPassword}
                            label=' New Password'
                            testID='AccountProfile.Password.Input'
                            labelTestId="AccountProfile.Password.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={passwordForm.password}
                            onChangeText={(value) => onChange('password', value)}

                        />
                        <TextInputWithLabel
                            editable={editPassword}
                            label='Confirm New Password'
                            testID='AccountProfile.ConfirmPassword.Input'
                            labelTestId="AccountProfile.ConfirmPassword.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={passwordForm.confirmPassword}
                            onChangeText={(value) => {
                                onChange('confirmPassword', value)
                            }}
                        />
                    </ProfileSection>
                )}
                {editProfileState && !submitting  && (
                    <GenericButton
                        style={tailwind('mt-4')}
                        labelColor={tailwind('text-white')}
                        onPress={() => updateProfile('profile')}
                        label="Update profile"
                        backgroundColor={tailwind('bg-secondary-700')}
                        testId="Accountprofile.editButton" />
                )}

                {editPassword && !submitting && ( <GenericButton
                        style={tailwind('mt-4')}
                        labelColor={tailwind('text-white')}
                        onPress={() => updateProfile('password')}
                        label="Update password"
                        backgroundColor={tailwind('bg-secondary-700')}
                        testId="Accountprofile.editButton" />
                )}

                {submitting && (
                    <LoaderComponent color={getColor('secondary-500')} size='large' style={tailwind('mt-4')} />
                )}
            </ScrolledView>
        </SafeAreaView>
    )
}
