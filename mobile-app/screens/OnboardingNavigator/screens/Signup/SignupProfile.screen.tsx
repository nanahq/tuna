import {Keyboard, Text, TextInput, View} from 'react-native'
import {tailwind} from '@tailwind'
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useRef, useState} from "react";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {ScrolledView} from "@components/views/ScrolledView";

import * as Device from 'expo-device'
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

export interface SignupProfileForm {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    password: string
    confirmPassword: string
}

type SignupProfileScreenProps = StackScreenProps<OnboardingParamsList, any>

export function SignupProfileScreen ({navigation}: SignupProfileScreenProps): JSX.Element {
    const lastNameRef = useRef<TextInput | null>(null)
    const emailRef = useRef<TextInput | null>(null)
    const passwordRef = useRef<TextInput | null>(null)
    const phoneRef = useRef<TextInput | null>(null)
    const confirmPasswordRef = useRef<TextInput | null>(null)
    const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false)
    const [form, setForm] = useState<SignupProfileForm>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    })


    function onChange (name: string, value: string): void {
       setForm((prevState) => ({...prevState, [name]: value}))
    }

    function checkNullState (): boolean {
        let isValidForm: boolean[] = []

        Object.keys(form).forEach((formItem) => {
            // @ts-ignore
            if (formItem in form && form[formItem].length > 1) {
                isValidForm.push(true)
            } else {
                isValidForm.push(false)
            }
        })

        return isValidForm.some(state => !state) || passwordMismatch
    }

    function onContinuePress () {
        if(form.confirmPassword.trim() !== form.password.trim()) {
            setPasswordMismatch(true)
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

    function dismissKeyboard () {
        Keyboard.dismiss
    }


    return (
        <ScrolledView testId="SignupProfileScreen.View" style={[tailwind('flex w-full px-5')]}>
                <View style={tailwind('flex flex-row items-center justify-between w-full mt-10')}>
                    <TextInputWithLabel
                      label='First Name'
                      testID='SignupProfileScreen.FirstName.Input'
                      style={{
                          width: 160
                      }}
                      labelTestId="SignupProfileScreen.FirstName.Label"
                      value={form.firstName}
                      onChangeText={(value) => onChange('firstName', value)}
                      onSubmitEditing={() => lastNameRef?.current?.focus()}
                    />
                    <TextInputWithLabel
                        ref={lastNameRef}
                        label='Last Name'
                        testID='SignupProfileScreen.LastName.Input'
                        labelTestId="SignupProfileScreen.LastName.Label"
                        style={{
                            width: 160
                        }}
                        value={form.lastName}
                        onChangeText={(value) => onChange('lastName', value)}
                        onSubmitEditing={() => phoneRef?.current?.focus()}
                    />
                </View>
                <TextInputWithLabel
                    ref={phoneRef}
                    label='Phone Number'
                    testID='SignupProfileScreen.PhoneNumber.Input'
                    labelTestId="SignupProfileScreen.PhoneNumber.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    value={form.phoneNumber}
                    onChangeText={(value) => onChange('phoneNumber', value)}
                    onSubmitEditing={() => emailRef?.current?.focus()}

                />
                <TextInputWithLabel
                    ref={emailRef}
                    label='Email'
                    testID='SignupProfileScreen.Email.Input'
                    labelTestId="SignupProfileScreen.Email.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    value={form.email}
                    onChangeText={(value) => onChange('email', value)}
                    onSubmitEditing={() => passwordRef?.current?.focus()}

                />
                <TextInputWithLabel
                    ref={passwordRef}
                    label='Password'
                    testID='SignupProfileScreen.Password.Input'
                    labelTestId="SignupProfileScreen.Password.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    value={form.password}
                    onChangeText={(value) => onChange('password', value)}
                    onSubmitEditing={() => confirmPasswordRef?.current?.focus()}

                />
                <TextInputWithLabel
                    ref={confirmPasswordRef}
                    label='Confirm Password'
                    testID='SignupProfileScreen.ConfirmPassword.Input'
                    labelTestId="SignupProfileScreen.ConfirmPassword.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    value={form.confirmPassword}
                    onChangeText={(value) => {
                        onChange('confirmPassword', value)
                        setPasswordMismatch(false)
                    }}
                    onSubmitEditing={dismissKeyboard}
                />
                 {passwordMismatch && (<Text style={tailwind('text-red-500 text-sm text-center')}>Password do not match</Text>)}
                <GenericButton
                    style={tailwind({
                        'mt-10': Device.osName === 'Android',
                        'mt-20': Device.osName === 'iOS'
                    })}
                    onPress={onContinuePress}
                    labelColor={tailwind('text-white')}
                    label='Continue'
                    backgroundColor={tailwind('bg-secondary-500')}
                    testId="OnboardingScreen.EnterPhoneNumberScreen.ContinueButton"
                    disabled={checkNullState()}
                />
            <Text style={tailwind('text-center text-sm text-brand-black-500 mt-2')}>Do you have an account? Login</Text>
        </ScrolledView>
    )
}
