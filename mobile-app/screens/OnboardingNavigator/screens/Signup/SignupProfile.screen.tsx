import {Keyboard, View} from 'react-native'
import {tailwind} from '@tailwind'
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import * as Device from 'expo-device'
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {LoginButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import {useForm} from "react-hook-form";
import {ControlledTextInputWithLabel} from "@components/commons/inputs/ControlledTextInput";

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
    const {control, formState: {errors}, handleSubmit, register, getValues} = useForm<SignupProfileForm>({
        criteriaMode: 'all',
        mode: 'onBlur'
    })


    function onContinuePress (data: SignupProfileForm): void {
        const {confirmPassword: _, ...rest} = data
        navigation.navigate({
            name: OnboardingScreenName.SIGN_UP_BUSINESS,
            params: {
                ...rest
            },
            merge: true
        })
    }

    const  dismissKeyboard = (): void =>  Keyboard.dismiss()
    

    return (
        <KeyboardAwareScrollView style={tailwind('flex w-full px-5')}>
                <View testID="SignupProfileScreen.View"  style={tailwind('flex flex-row items-center justify-between w-full mt-10')}>
                    <ControlledTextInputWithLabel
                        error={errors.firstName !== undefined}
                        errorMessage={errors.firstName?.message}
                        register={register('firstName')}
                        control={control}
                        label='First Name'
                        name='firstName'
                        testID='SignupProfileScreen.FirstName.Input'
                        style={{
                            width: 160
                        }}
                        labelTestId="SignupProfileScreen.FirstName.Label"
                        rules={{required: {
                                value: true,
                                message: "Required"
                            }}}
                    />
                    <ControlledTextInputWithLabel
                        error={errors.lastName !== undefined}
                        errorMessage={errors.lastName?.message}
                        label='Last Name'
                        testID='SignupProfileScreen.LastName.Input'
                        labelTestId="SignupProfileScreen.LastName.Label"
                        style={{
                            width: 160
                        }}
                        name='lastName'
                        control={control}
                        rules={{required: {
                                value: true,
                                message: "Required"
                            }}}
                    />
                </View>
                <ControlledTextInputWithLabel
                    control={control}
                    name='phone'
                    label='Phone Number'
                    testID='SignupProfileScreen.PhoneNumber.Input'
                    labelTestId="SignupProfileScreen.PhoneNumber.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    rules={{required: {
                            value: true,
                            message: "Required"
                        }}}
                    error={errors.phone !== undefined}
                    errorMessage={errors.phone?.message}
                />
                <ControlledTextInputWithLabel
                    label='Email'
                    name='email'
                    control={control}
                    testID='SignupProfileScreen.Email.Input'
                    labelTestId="SignupProfileScreen.Email.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    error={errors.email !== undefined}
                    errorMessage={errors.email?.message}
                    rules={{required: {
                        value: true,
                            message: "Required"
                        }}}
                />
                <ControlledTextInputWithLabel
                    secureTextEntry
                    label='Password'
                    testID='SignupProfileScreen.Password.Input'
                    labelTestId="SignupProfileScreen.Password.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    name='password'
                    control={control}
                    rules={{required: {
                        value: true,
                            message: 'Required'
                        }, minLength: {
                        value: 8,
                            message: 'Password must be more than 8 characters'
                        }}}
                    error={errors.password !== undefined}
                    errorMessage={errors.password?.message}
                />
                <ControlledTextInputWithLabel
                    secureTextEntry
                    label='Confirm Password'
                    testID='SignupProfileScreen.ConfirmPassword.Input'
                    labelTestId="SignupProfileScreen.ConfirmPassword.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    name='confirmPassword'
                    control={control}
                    onSubmitEditing={dismissKeyboard}
                    error={errors.confirmPassword !== undefined}
                    errorMessage={errors.confirmPassword?.message}
                    rules={{required: {
                            value: true,
                            message: 'Required'
                        }, minLength: {
                            value: 8,
                            message: 'Password must be more than 8 characters'
                        },
                        validate: (value) => value === getValues('password') || 'Password mismatch'
                    }}
                />
                <GenericButton
                    style={tailwind({
                        'mt-10': Device.osName === 'Android',
                        'mt-20': Device.osName === 'iOS'
                    })}
                    onPress={handleSubmit(onContinuePress)}
                    labelColor={tailwind('text-white')}
                    label='Continue'
                    backgroundColor={tailwind('bg-brand-black-500')}
                    testId="OnboardingScreen.EnterPhoneNumberScreen.ContinueButton"
                />
            <LoginButtonWithText style={tailwind('text-primary-700 font-semibold')} />
        </KeyboardAwareScrollView>
    )
}
