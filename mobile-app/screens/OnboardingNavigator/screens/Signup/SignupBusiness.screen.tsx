import {Keyboard, TextInput} from 'react-native'
import {getColor, tailwind} from '@tailwind'
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useRef, useState} from "react";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Device from 'expo-device'
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {_api} from "@api/_request";
import {SignupProfileForm} from "@screens/OnboardingNavigator/screens/Signup/SignupProfile.screen";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import {WelcomeButtonSheet} from "@screens/OnboardingNavigator/screens/components/WelcomeBottomSheet";
import {ScrolledView} from "@components/views/ScrolledView";
import {LoginButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import {ErrorMessage} from "@screens/OnboardingNavigator/screens/components/ErrorMessage";

interface SignupBusinessForm {
    businessPhoneNumber: string
    businessName: string
    address: string
    state: string
}
interface SignupPayload extends SignupProfileForm {
    businessPhoneNumber: string
    businessName: string
    address: string
    state: string
}


type SignupBusinessProps = StackScreenProps<OnboardingParamsList, any>

export function SignupBusinessScreen ({route }: SignupBusinessProps): JSX.Element {

    const businessNameRef = useRef<TextInput | null>(null)
    const businessPhoneRef = useRef<TextInput | null>(null)
    const addressRef = useRef<TextInput | null>(null)
    const stateRef = useRef<TextInput | null>(null)
    const bottomSheetModalRef = useRef<any>(null)


    const [_hasError, _setHasError] = useState<boolean>(false)
    const [_loading, _setLoading] = useState<boolean>(false)
    const [_errorMessage, _setErrorMessage] = useState<string | Array<string>>([])


    const [form, setForm] = useState<SignupBusinessForm>({
        businessPhoneNumber: '',
        businessName: '',
        address: '',
        state: ''
    })

    function openModal (): void {
        bottomSheetModalRef.current?.present();
    }

    function onChange (name: string, value: string): void {
        setForm((prevState) => ({...prevState, [name]: value}))
    }

    function checkNullState (): boolean {
        const isValidForm: boolean[] = []

        Object.keys(form).forEach((formItem) => {
            // @ts-ignore
            if (formItem in form && form[formItem].length > 1) {
                isValidForm.push(true)
            } else {
                isValidForm.push(false)
            }
        })

        return isValidForm.some(state => !state)
    }

    async function onContinuePress (): Promise<void> {
try {
            _setHasError(false)
            _setErrorMessage('')
            _setLoading(true)
            await _api.requestData<SignupPayload>({
                method: 'POST',
                url: 'vendor/register',
                data: {
                    ...route.params as SignupProfileForm,
                    ...form
                }
            })
            openModal()
        } catch (error: any) {
            _setHasError(true)
            if (Number(error.statusCode) === 500) {
                _setErrorMessage('Something went wrong. Try again')
            } else {
                _setErrorMessage(error.message)
            }
        } finally {
            _setLoading(false)
        }
    }


    function dismissKeyboard () {
        Keyboard.dismiss
    }

    return (
        <>
            <ScrolledView testId="SignupBusiness.View" contentContainerStyle={[tailwind('pb-8 px-5 h-full')]}>
                {(() => {
                    if (_hasError && typeof _errorMessage !== 'string') {
                        return _errorMessage.map(error => (
                            <ErrorMessage error={error} key={error} />
                        ))
                    }

                    if (_hasError && typeof _errorMessage === 'string') {
                        return  <ErrorMessage error={_errorMessage} key={_errorMessage} />
                    }

                })()}
                <TextInputWithLabel
                    ref={businessNameRef}
                    label='Business Name'
                    testID='SignupBusiness.name.Input'
                    labelTestId="SignupBusiness.name.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    value={form.businessName}
                    onChangeText={(value) => onChange('businessName', value)}
                    onSubmitEditing={() => businessPhoneRef?.current?.focus()}

                />
                <TextInputWithLabel
                    ref={businessPhoneRef}
                    label='Business phone '
                    testID='SignupBusiness.phone.Input'
                    labelTestId="SignupBusiness.phone.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    value={form.businessPhoneNumber}
                    onChangeText={(value) => onChange('businessPhoneNumber', value)}
                    onSubmitEditing={() => addressRef?.current?.focus()}

                />
                <TextInputWithLabel
                    ref={addressRef}
                    label='Business Address'
                    testID='SignupBusiness.address.Input'
                    labelTestId="SignupBusiness.address.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    value={form.address}
                    onChangeText={(value) => onChange('address', value)}
                    onSubmitEditing={() => stateRef?.current?.focus()}

                />
                <TextInputWithLabel
                    ref={stateRef}
                    label='Business state (We are currently available in Kano'
                    testID='SignupBusiness.state.Input'
                    labelTestId="SignupBusiness.state.Label"
                    containerStyle={tailwind('w-full mt-5')}
                    value={form.state}
                    onChangeText={(value) => {
                        onChange('state', value)
                    }}
                    onSubmitEditing={dismissKeyboard}
                />
                {_loading &&
                    <LoaderComponent
                        size='small'
                        containerStyle={tailwind('my-3')}
                        color={getColor('secondary-500')}
                    />}
                {!_loading && (
                    <>
                        <GenericButton
                            style={tailwind({
                                'mt-10': Device.osName === 'Android',
                                'mt-20': Device.osName === 'iOS'
                            })}
                            onPress={onContinuePress}
                            labelColor={tailwind('text-white')}
                            label='Become a vendor'
                            backgroundColor={tailwind('bg-secondary-500')}
                            testId="OnboardingScreen.SignupBusinessScreen.ContinueButton"
                            disabled={checkNullState()}
                        />
                        <LoginButtonWithText />
                    </>
                )}
            </ScrolledView>
            <WelcomeButtonSheet  promptModalName='WELCOME_MODAL' modalRef={bottomSheetModalRef} />
        </>

    )
}
