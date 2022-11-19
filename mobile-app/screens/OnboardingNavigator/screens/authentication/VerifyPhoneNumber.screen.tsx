import {useState} from "react";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {Text, View} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {TermsConditionRow} from "@screens/OnboardingNavigator/screens/components/TermsConditionSection";
import {BackButton} from "@screens/OnboardingNavigator/screens/components/BackButton";
import {ImageWithTextRow} from "@screens/OnboardingNavigator/screens/components/ImageWithTextRow";
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {VerificationCodeInput} from "@components/commons/inputs/VerificationCodeInput";
import {_api} from "@api/_request";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {cookieParser} from "../../../../../utils/cookieParser";

type VerifyPhoneNumberScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.VERIFY_PHONE_NUMBER>


export function VerifyPhoneNumberScreen ({navigation, route}:VerifyPhoneNumberScreenProps): JSX.Element {
    const {setToken} = useAuthPersistence()
    const [code, setCode] = useState<string>('')
    const [hasError, _setHasError] = useState<boolean>(false)
    const [errorMessage, _setErrorMessage] = useState<string>('Invalid Code.')
    const [loading , _setIsLoading] = useState<boolean>(false)
    async function onContinue(): Promise<void> {
        try {
            _setIsLoading(true)
            _setHasError(false)
            _setErrorMessage('')
            _setIsLoading(true)
            const {data, cookies} = await _api.requestData({
                method: 'POST',
                url: 'users/verify',
                data: {
                    phoneNumber: route.params.phoneNumber,
                    code
                }
            })

            if (data.status === 1) {
                await setToken(cookieParser(cookies[0]))
            }
        } catch (error: any) {
            _setHasError(true)
            if (Number(error.statusCode) === 500) {
                _setErrorMessage('Something went wrong. Try again')
            } else {
                _setErrorMessage(error.message)
            }
        } finally {
            _setIsLoading(false)
        }


    }
    return (
        <View
            testID="OnboardingScreen.VerifyPhoneNumberScreen"
            style={[tailwind('pt-12'), {overflow: 'hidden'}]}
        >

            <View style={tailwind('pt-5 px-5')}>
               <View>
                   <Text
                       testID='OnboardingScreen.VerifyPhoneNumberScreen.EnterCodeText'
                       style={tailwind('font-medium text-lg text-brand-black-500')}
                   >
                       Enter Verification code
                   </Text>
                   <Text
                       testID='OnboardingScreen.VerifyPhoneNumberScreen.EnterCodeText.SubText'
                       style={tailwind('font-bold text-xs text-brand-gray-700')}
                   >
                      A 4-digit code has been sent to your phone via SMS
                   </Text>
               </View>
                <View style={tailwind('mt-6')}>
                    <VerificationCodeInput
                        testID="OnboardingScreen.VerifyPhoneNumberScreen.VerificationCodeInput"
                        onChange={setCode}
                        value={code}
                        cellCount={6}
                        autofocus
                    />
                </View>
                {hasError && (
                    <Text style={tailwind('mt-3.5 text-center text-red-600 text-xs font-semibold')}>{errorMessage}</Text>
                )}

                {loading &&
                    <LoaderComponent
                        size='small'
                        containerStyle={tailwind('my-3')}
                        color={getColor('secondary-500')}
                    />}

                <GenericButton
                    style={tailwind({
                        'mt-3.5': hasError,
                        'mt-6': !hasError && !loading
                    })}
                    onPress={onContinue}
                    labelColor={tailwind('text-white')}
                    label='Verify'
                    backgroundColor={tailwind('bg-brand-black-500')}
                    testId="OnboardingScreen.VerifyPhoneNumberScreen.VerifyButton"
                    disabled={code === "" || code.length <= 3}
                />
                {hasError && (
                    <Text style={tailwind('text-center mt-5 text-brand-gray-700 text-xs font-semibold underline')}>{`Didn't receive code? resend code`}</Text>
                )}
            </View>
            <View style={tailwind('mt-14 pt-3.5 px-5')}>
                <TermsConditionRow testID="VerifyPhoneNumberScreen.Terms"/>
                <BackButton onPress={() => navigation.goBack()} testID="VerifyPhoneNumberScreen.BackButton"/>
            </View>
            <ImageWithTextRow>
                <View testID="VerifyPhoneNumberScreen.ImageWithTextRow"
                      style={tailwind('flex flex-row items-center px-2 mt-20')}>
                    <Text style={tailwind('text-3xl font-semibold text-primary-500 mr-0.5')}>Eating Made </Text>
                    <Text style={tailwind('text-3xl font-semibold text-secondary-500 ml-0.5')}>Easy</Text>
                </View>
            </ImageWithTextRow>
        </View>
    )
}
