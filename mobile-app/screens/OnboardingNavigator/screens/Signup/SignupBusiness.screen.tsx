import {SafeAreaView, ScrollView, View} from 'react-native'
import {tailwind} from '@tailwind'
import {useRef, useState} from "react";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Device from 'expo-device'
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {_api} from "@api/_request";
import {SignupProfileForm} from "@screens/OnboardingNavigator/screens/Signup/SignupProfile.screen";
import {WelcomeButtonSheet} from "@screens/OnboardingNavigator/screens/components/WelcomeBottomSheet";
import {LoginButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import {TermsAndConditionsSection} from "@screens/OnboardingNavigator/screens/components/TermsAndConditionsPage";
import Toast from "react-native-toast-message";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {useForm} from "react-hook-form";
import {ControlledTextInputWithLabel} from "@components/commons/inputs/ControlledTextInput";
import {SignupHeader} from "@screens/OnboardingNavigator/screens/components/SignupHeader";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";

interface SignupBusinessForm {
    businessEmail: string
    businessName: string
    businessAddress: string
}
interface SignupPayload extends Omit<SignupProfileForm, 'confirmPassword'> {
    businessEmail: string
    businessName: string
    businessAddress: string
}


type SignupBusinessProps = StackScreenProps<OnboardingParamsList, any>

export function SignupBusinessScreen ({route }: SignupBusinessProps): JSX.Element {
    const bottomSheetModalRef = useRef<any>(null)
    const [_loading, _setLoading] = useState<boolean>(false)
    const toast = useToast()
    const  openModal = (): void =>  bottomSheetModalRef.current?.present();

    const [form, setForm] = useState<SignupBusinessForm>({
        businessAddress: '',
        businessEmail: '',
        businessName: ''
    })

    const [errors, setErrors] =  useState<Record<keyof SignupBusinessForm, boolean>>({
        businessAddress: false,
        businessEmail: false,
        businessName: false
    })


    function checkForErrors (): void {
        if(form.businessName === '') {
            setErrors(prev => ({...prev, businessName: true}))
            return
        }

        if(form.businessEmail === '') {
            setErrors(prev => ({...prev, businessEmail: true}))
            return
        }

        if(form.businessAddress === '') {
            setErrors(prev => ({...prev, businessAddress: true}))
            return
        }
    }

    async function onContinuePress (): Promise<void> {
        setErrors({
            businessAddress: false,
            businessEmail: false,
            businessName: false
        })


        checkForErrors()

        try {
            _setLoading(true)
            await _api.requestData<SignupPayload>({
                method: 'POST',
                url: 'vendor/register',
                data: {
                    ...route.params as Omit<SignupProfileForm, 'confirmPassword'>,
                    ...form
                }
            })
            openModal()
        } catch (error: any) {
            if (Number(error?.statusCode) === 500) {
                showTost(toast, 'Something went wrong. can not create new account', 'error')
            } else {
                showTost(toast, typeof error.message !== 'string' ? error.message[0] : error.message, 'error')
            }
        } finally {
            _setLoading(false)
        }
    }

    return (

            <SafeAreaView style={tailwind('flex-1 bg-white')}>
                <ScrollView style={tailwind(' pb-8 px-5')}>
                    <SignupHeader page='Restaurant' showBackButton />
                    <View testID="SignupBusiness.View" style={tailwind('flex flex-col')}>
                        <TextInputWithLabel
                            defaultValue={form.businessName}
                            onChangeText={(value) => setForm((prev) => ({...prev, businessName: value}))}
                            error={errors.businessName}
                            errorMessage="Required"
                            label='What is the name of your restaurant/business?'
                            testID='SignupProfileScreen.FirstName.Input'
                            containerStyle={tailwind('mt-5')}
                            labelTestId="SignupProfileScreen.FirstName.Label"
                        />
                        <TextInputWithLabel
                            defaultValue={form.businessEmail}
                            onChangeText={(value) => setForm((prev) => ({...prev, businessEmail: value}))}
                            error={errors.businessEmail}
                            errorMessage="Required"
                            label='Email to receive business updates about your account'
                            testID='SignupProfileScreen.FirstName.Input'
                            containerStyle={tailwind('mt-5')}
                            labelTestId="SignupProfileScreen.FirstName.Label"
                        />
                        <TextInputWithLabel
                            defaultValue={form.businessAddress}
                            onChangeText={(value) => setForm((prev) => ({...prev, businessAddress: value}))}
                            error={errors.businessAddress}
                            errorMessage="Required"
                            label='Address of your business'
                            testID='SignupProfileScreen.FirstName.Input'
                            containerStyle={tailwind('mt-5')}
                            labelTestId="SignupProfileScreen.FirstName.Label"
                        />
                        <TermsAndConditionsSection />
                        <GenericButton
                            style={tailwind({
                                'mt-10': Device.osName === 'Android',
                                'mt-20': Device.osName === 'iOS'
                            })}
                            onPress={onContinuePress}
                            labelColor={tailwind('text-white')}
                            label={_loading ? 'Creating your account' : 'Create account'}
                            backgroundColor={tailwind('bg-primary-500')}
                            testId="OnboardingScreen.SignupBusinessScreen.ContinueButton"
                            loading={_loading}
                        />
                        {!_loading && (
                            <LoginButtonWithText style={tailwind('text-brand-black-500')} />
                        )}
                    </View>
                </ScrollView>
                <WelcomeButtonSheet  promptModalName='WELCOME_MODAL' modalRef={bottomSheetModalRef} />
            </SafeAreaView>
    )
}
