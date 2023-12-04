import { SafeAreaView, ScrollView, View} from 'react-native'
import {tailwind} from '@tailwind'
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Device from 'expo-device'
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {LoginButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import {useForm} from "react-hook-form";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useState} from "react";
import {SignupHeader} from "@screens/OnboardingNavigator/screens/components/SignupHeader";

export interface SignupProfileForm {
    firstName: string
    lastName: string
    phone: string
    email: string
    password: string
    confirmPassword: string
}


type SignupProfileScreenProps = StackScreenProps<OnboardingParamsList, any>

export function SignupProfileScreen ({navigation}: SignupProfileScreenProps): JSX.Element {
    const {control, formState: handleSubmit, register, getValues} = useForm<SignupProfileForm>({
        criteriaMode: 'all',
        mode: 'onBlur'
    })

    const [form, setForm] = useState<SignupProfileForm>({
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        lastName: '',
        firstName: ''
    })

    const [errors, setErrors] = useState<Record<keyof SignupProfileForm , any>>({
        confirmPassword: false,
        email: false,
        firstName: false,
        lastName: false,
        password: false,
        phone: false
    })


    function onContinuePress (): void {
        setErrors({
            confirmPassword: false,
            email: false,
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


        if(form.email === '') {
            setErrors(prev => ({...prev, email: true}))
            return
        }


        if(form.password === '') {
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
    }


    const hasErrors = (fields: Array<boolean>): boolean => {
        return fields.some(f => f === true)
    }
    return (
        <SafeAreaView style={tailwind('flex-1 bg-white w-full ')}>
            <ScrollView showsVerticalScrollIndicator={false} style={tailwind('px-5 ')}>
                <SignupHeader page='Profile' />
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
                        defaultValue={form.email}
                        onChangeText={(value) => setForm((prev) => ({...prev, email: value}))}
                        keyboardType="email-address"
                        error={errors.email}
                        errorMessage="Required"
                        label='Email Address'
                        containerStyle={tailwind('mt-5')}
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
                        disabled={hasErrors(Object.values(form))}
                        onPress={onContinuePress}
                        labelColor={tailwind('text-white')}
                        label='Continue'
                        backgroundColor={tailwind('bg-primary-500')}
                        testId="OnboardingScreen.EnterPhoneNumberScreen.ContinueButton"
                    />
                    <LoginButtonWithText style={tailwind('text-black')} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
