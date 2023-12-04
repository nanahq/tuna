import { tailwind} from "@tailwind";
import {SafeAreaView, View, Text} from "react-native";
import {ScrolledView} from "@components/views/ScrolledView";
import {useEffect, useState} from "react";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {useNavigation} from "@react-navigation/native";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import { useForm } from "react-hook-form";
import { ControlledTextInputWithLabel } from "@components/commons/inputs/ControlledTextInput";
import {  showTost } from "@components/commons/Toast";
import { _api } from "@api/_request";
import { fetchProfile } from "@store/profile.reducer";
import { useToast } from "react-native-toast-notifications";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";

export interface AccountProfileForm {
    firstName: string
    lastName: string
    phone: string
    email: string
}
export interface PasswordForm {
    password: string
    confirmPassword: string
}



export function AccountProfile (): JSX.Element {
    const {hasFetchedProfile, profile } = useAppSelector((state: RootState) => state.profile)
    const dispatch = useAppDispatch()
    const navigation = useNavigation()
    const toast = useToast()

    const [submitting, setSubmitting] = useState<boolean>(false)
    const [editProfileState, setEditProfileState] = useState<boolean>(false)

    const [form, setForm] = useState<AccountProfileForm>({
       email: '',
        firstName: '',
        lastName: '',
        phone: ''
    })

    useEffect(() => {
        const {firstName, lastName, phone, email } = profile
        setForm(prev => ({
            ...prev,
            email,
            phone,
            lastName,
            firstName
        }))
    }, [])


    if (!hasFetchedProfile) {
        return <LoaderComponentScreen />
    }


   async function updateProfile (): Promise<void> {

        if(Object.values(form).includes('')) {
            showTost(toast, 'Make sure all fields are complete', 'warning')
            return
        }
    setSubmitting(true)
       try {
         await _api.requestData<AccountProfileForm>({
            method: 'put',
            url: 'vendor/profile',
            data: form
        })
       setSubmitting(false)
        setEditProfileState(false)
        showTost(toast, 'Profile Updated', 'success')
        await dispatch(fetchProfile())
       } catch (error: any) {
        showTost(toast,  error.message !== 'string' ? error.message[0] : error.message, 'error' )
       } finally {
       setSubmitting(false)
       }
    }


    return (
        <SafeAreaView style={tailwind('flex-1')}>
            <ScrolledView testId="AccountProfile.View" style={tailwind('flex w-full px-5 pt-5 bg-white')}>
                <GoBackButton onPress={() => navigation.goBack()} />
                    <ProfileSection sectionName="Account information" onPress={() => setEditProfileState(true)}>
                        <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                            <TextInputWithLabel
                                editable={editProfileState}
                                label='First Name'
                                testID='AccountProfile.FirstName.Input'
                                containerStyle={tailwind('w-5/12')}
                                defaultValue={form.firstName}
                                onChangeText={value => setForm(prev => ({...prev, firstName: value}))}
                                labelTestId="AccountProfile.FirstName.Label"
                            />
                            <TextInputWithLabel
                                editable={editProfileState}
                                label='Last Name'
                                testID='AccountProfile.LastName.Input'
                                labelTestId="AccountProfile.LastName.Label"
                                containerStyle={tailwind('w-5/12')}
                                defaultValue={form.lastName}
                                onChangeText={value => setForm(prev => ({...prev, lastName: value}))}
                            />
                        </View>
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Phone'
                            testID='AccountProfile.LastName.Input'
                            labelTestId="AccountProfile.LastName.Label"
                            containerStyle={tailwind('mt-5')}
                            defaultValue={form.phone}
                            onChangeText={value => setForm(prev => ({...prev, phone: value}))}
                        />
                        <TextInputWithLabel
                            editable={editProfileState}
                            label='Email'
                            testID='AccountProfile.LastName.Input'
                            labelTestId="AccountProfile.LastName.Label"
                            containerStyle={tailwind('mt-5')}
                            defaultValue={form.email}
                            onChangeText={value => setForm(prev => ({...prev, email: value}))}
                        />
                    </ProfileSection>

                    {editProfileState && (
                        <GenericButton
                        style={tailwind('mt-4')}
                        labelColor={tailwind('text-white')}
                        onPress={updateProfile}
                        label="Update profile"
                        backgroundColor={tailwind('bg-brand-black-500')}
                        testId="Accountprofile.editButton"
                        loading={submitting}
                        />
                    )}

            </ScrolledView>
        </SafeAreaView>
    )
}
