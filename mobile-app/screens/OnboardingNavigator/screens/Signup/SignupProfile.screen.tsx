import { View} from 'react-native'
import {tailwind} from '@tailwind'
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Device from 'expo-device'
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {LoginButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAnalytics} from "@segment/analytics-react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export interface SignupProfileForm {
    firstName: string
    lastName: string
    phone: string
    password: string
    confirmPassword: string
}


type SignupProfileScreenProps = StackScreenProps<OnboardingParamsList, any>

export function SignupProfileScreen ({navigation}: SignupProfileScreenProps): JSX.Element {

    const [form, setForm] = useState<SignupProfileForm>({
        phone: '',
        password: '',
        confirmPassword: '',
        lastName: '',
        firstName: ''
    })

    const [errors, setErrors] = useState<Record<keyof SignupProfileForm , any>>({
        confirmPassword: false,
        firstName: false,
        lastName: false,
        password: false,
        phone: false
    })

    const analytics = useAnalytics()


    useEffect(() => {
        void analytics.screen(OnboardingScreenName.SIGN_UP_PROFILE)
    }, [])
    function onContinuePress (): void {
        setErrors({
            confirmPassword: false,
            firstName: false,
            lastName: false,
            password: false,
            phone: false
        })

        if(form.firstName === '') {
            setErrors(prev => ({...prev, firstName: true}))
            return
        }

        if(form.lastName === '') {
            setErrors(prev => ({...prev, lastName: true}))
            return
        }

        if(form.phone === '') {
            setErrors(prev => ({...prev, phone: true}))
            return
        }


        if (form.password === '') {
            setErrors(prev => ({...prev, password: true}))
            return
        }


        if(form.confirmPassword === '' || form.password !== form.confirmPassword) {
            setErrors(prev => ({...prev, confirmPassword: true}))
            return
        }

        const {confirmPassword: _, ...rest} = form

        navigation.navigate({
            name: OnboardingScreenName.SIGN_UP_BUSINESS,
            params: {
                ...rest
            },
            merge: true
        })

        void analytics.track('EVENT:SIGNUP-FORM-PROFILE')
    }


    const hasErrors = (fields: Array<boolean>): boolean => {
        return fields.some(f => f)
    }
    return (
        <SafeAreaView style={tailwind('flex-1 bg-white w-full ')}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={tailwind('px-5 ')}>
                <View style={tailwind('pb-10')}>
                    <View style={tailwind('flex flex-row items-center justify-between')}>
                        <TextInputWithLabel
                            defaultValue={form.firstName}
                            onChangeText={(value) => setForm((prev) => ({...prev, firstName: value}))}
                            error={errors.firstName}
                            errorMessage="Required"
                            label='First Name'
                            testID='SignupProfileScreen.FirstName.Input'
                            containerStyle={tailwind('w-1/2 pr-2')}
                            labelTestId="SignupProfileScreen.FirstName.Label"
                        />
                        <TextInputWithLabel
                            defaultValue={form.lastName}
                            onChangeText={(value) => setForm((prev) => ({...prev, lastName: value}))}
                            error={errors.lastName}
                            errorMessage="Required"
                            label='Last Name'
                            testID='SignupProfileScreen.FirstName.Input'
                            containerStyle={tailwind('pl-2 w-1/2')}
                            labelTestId="SignupProfileScreen.FirstName.Label"
                        />
                    </View>
                    <TextInputWithLabel
                        defaultValue={form.phone}
                        onChangeText={(value) => setForm((prev) => ({...prev, phone: value}))}
                        keyboardType="phone-pad"
                        error={errors.phone}
                        errorMessage="Required"
                        containerStyle={tailwind('mt-5')}
                        label='Phone Number'
                        testID='SignupProfileScreen.FirstName.Input'
                        labelTestId="SignupProfileScreen.FirstName.Label"
                    />
                    <TextInputWithLabel
                        defaultValue={form.password}
                        onChangeText={(value) => setForm((prev) => ({...prev, password: value}))}
                        secureTextEntry={true}
                        error={errors.password}
                        errorMessage="Required"
                        containerStyle={tailwind('mt-5')}
                        label='Password'
                        testID='SignupProfileScreen.FirstName.Input'
                        labelTestId="SignupProfileScreen.FirstName.Label"
                    />
                    <TextInputWithLabel
                        defaultValue={form.confirmPassword}
                        onChangeText={(value) => setForm((prev) => ({...prev, confirmPassword: value}))}
                        containerStyle={tailwind('mt-5')}
                        secureTextEntry={true}
                        error={errors.confirmPassword}
                        errorMessage="Passwords does not match"
                        label='Confirm password'
                        testID='SignupProfileScreen.FirstName.Input'
                        labelTestId="SignupProfileScreen.FirstName.Label"
                    />
                    <GenericButton
                        style={tailwind({
                            'mt-10': Device.osName === 'Android',
                            'mt-20': Device.osName === 'iOS'
                        })}
                        onPress={onContinuePress}
                        labelColor={tailwind('text-white')}
                        label='Continue'
                        backgroundColor={tailwind('bg-primary-100')}
                        testId="OnboardingScreen.EnterPhoneNumberScreen.ContinueButton"
                    />
                    <LoginButtonWithText style={tailwind('text-black')} />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
