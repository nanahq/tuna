import { View} from 'react-native'
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
    const [_hasError, _setHasError] = useState<boolean>(false)
    const [_loading, _setLoading] = useState<boolean>(false)
    const [_errorMessage, _setErrorMessage] = useState<string | Array<string>>([])

    const  openModal = (): void =>  bottomSheetModalRef.current?.present();

    // form
    const {control, formState: {errors}, handleSubmit} = useForm<SignupBusinessForm>({
        criteriaMode: 'all',
        mode: 'onTouched'
    })


    async function onContinuePress (data: SignupBusinessForm): Promise<void> {
try {
            _setHasError(false)
            _setErrorMessage('')
            _setLoading(true)
            await _api.requestData<SignupPayload>({
                method: 'POST',
                url: 'vendor/register',
                data: {
                    ...route.params as Omit<SignupProfileForm, 'confirmPassword'>,
                    ...data
                }
            })
            openModal()
        } catch (error: any) {
            _setHasError(true)
            if (Number(error.statusCode) === 500) {
                Toast.show({
                    type: 'error',
                    text1: 'Something went wrong. Login failed',
                    autoHide: true,
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: typeof error.message !== 'string' ? error.message[0] : error.message,
                    autoHide: true,
                })
            }
        } finally {
            _setLoading(false)
        }
    }

    return (
        <KeyboardAwareScrollView>
            <View testID="SignupBusiness.View" style={tailwind('pb-8 px-5 h-full')}>
                <ControlledTextInputWithLabel
                    label='Business Name'
                    name='businessName'
                    testID='SignupBusiness.name.Input'
                    labelTestId="SignupBusiness.name.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    control={control}
                    rules={{required: {
                            value: true,
                            message: "Required"
                        }}}
                    error={errors.businessName !== undefined}
                    errorMessage={errors.businessName?.message}
                />
                <ControlledTextInputWithLabel
                    label='Business email'
                    moreInfo='We use this for business related updates'
                    testID='SignupBusiness.email.Input'
                    labelTestId="SignupBusiness.email.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    name='businessEmail'
                    control={control}
                    rules={{required: {
                            value: true,
                            message: "Required"
                        }}}
                    error={errors.businessEmail !== undefined}
                    errorMessage={errors.businessEmail?.message}

                />
                <ControlledTextInputWithLabel
                    label='Business Address'
                    testID='SignupBusiness.address.Input'
                    labelTestId="SignupBusiness.address.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    name='businessAddress'
                    control={control}
                    rules={{required: {
                            value: true,
                            message: "Required"
                        }}}
                    error={errors.businessAddress !== undefined}
                    errorMessage={errors.businessAddress?.message}

                />
                <TermsAndConditionsSection />
                <GenericButton
                    style={tailwind({
                        'mt-10': Device.osName === 'Android',
                        'mt-20': Device.osName === 'iOS'
                    })}
                    onPress={handleSubmit(onContinuePress)}
                    labelColor={tailwind('text-white')}
                    label={_loading ? 'Creating your account' : 'Create account'}
                    backgroundColor={tailwind('bg-brand-black-500')}
                    testId="OnboardingScreen.SignupBusinessScreen.ContinueButton"
                    loading={_loading}
                />
                {!_loading && (
                        <LoginButtonWithText style={tailwind('text-brand-black-500')} />
                )}
            </View>
            <WelcomeButtonSheet  promptModalName='WELCOME_MODAL' modalRef={bottomSheetModalRef} />
        </KeyboardAwareScrollView>

    )
}
