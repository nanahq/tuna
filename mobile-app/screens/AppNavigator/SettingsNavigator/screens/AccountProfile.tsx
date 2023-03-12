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

    const {control, handleSubmit, formState: { errors}, setValue} = useForm<AccountProfileForm>({
        criteriaMode: 'all'
    })

    useEffect(() => {
        setValue('firstName', profile.firstName)
        setValue('lastName', profile.lastName)
        setValue('email', profile.email)
        setValue('phone', profile.phone)
    }, [])


    if (!hasFetchedProfile) {
        return <View>
            <Text>Fetching</Text>
        </View>
    }

 
   async function updateProfile (data: AccountProfileForm): Promise<void> {
    setSubmitting(true)
       try {
         await _api.requestData<AccountProfileForm>({
            method: 'put',
            url: 'vendor/profile',
            data
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
        <SafeAreaView>
            <ScrolledView testId="AccountProfile.View" style={tailwind('flex w-full px-5 pt-5 bg-white')}>
                <GoBackButton onPress={() => navigation.goBack()} />
                    <ProfileSection sectionName="Account information" onPress={() => setEditProfileState(true)}>
                        <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                            <ControlledTextInputWithLabel
                                editable={editProfileState}
                                label='First Name'
                                testID='AccountProfile.FirstName.Input'
                                style={{
                                    width: 160
                                }}
                                labelTestId="AccountProfile.FirstName.Label"
                                control={control}
                                name="firstName"
                                rules={{required: {
                                    value: true,
                                    message: "Required"
                                }}}
                            error={errors.firstName !== undefined}
                            errorMessage={errors.firstName?.message}
                            />
                            <ControlledTextInputWithLabel
                                editable={editProfileState}
                                label='Last Name'
                                testID='AccountProfile.LastName.Input'
                                labelTestId="AccountProfile.LastName.Label"
                                style={{
                                    width: 160
                                }}
                                control={control}
                                name="lastName"
                                rules={{required: {
                                    value: true,
                                    message: "Required"
                                }}}
                            error={errors.lastName !== undefined}
                            errorMessage={errors.lastName?.message}
                            />
                        </View>
                        <ControlledTextInputWithLabel
                            editable={editProfileState}
                            label='Phone Number'
                            testID='AccountProfile.PhoneNumber.Input'
                            labelTestId="AccountProfile.PhoneNumber.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            control={control}
                            name="phone"
                            rules={{required: {
                                value: true,
                                message: "Required"
                            }}}
                        error={errors.phone !== undefined}
                        errorMessage={errors.phone?.message}

                        />
                        <ControlledTextInputWithLabel
                            editable={editProfileState}
                            label='Email'
                            testID='AccountProfile.Email.Input'
                            labelTestId="AccountProfile.Email.Label"
                            containerStyle={tailwind('w-full mt-5')}
                            control={control}
                                name="email"
                                rules={{required: {
                                    value: true,
                                    message: "Required"
                                }}}
                            error={errors.email !== undefined}
                            errorMessage={errors.email?.message}
                        />
                    </ProfileSection>

                    {editProfileState && (
                        <GenericButton
                        style={tailwind('mt-4')}
                        labelColor={tailwind('text-white')}
                        onPress={handleSubmit(updateProfile)}
                        label="Update profile"
                        backgroundColor={tailwind('bg-primary-700')}
                        testId="Accountprofile.editButton" 
                        loading={submitting}
                        />
                    )}
    
            </ScrolledView>
        </SafeAreaView>
    )
}
