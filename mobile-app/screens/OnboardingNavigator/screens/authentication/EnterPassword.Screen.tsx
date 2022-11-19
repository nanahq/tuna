import {useState} from "react";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {Text, View} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {TextArea} from "@components/commons/inputs/TextInput";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {TermsConditionRow} from "@screens/OnboardingNavigator/screens/components/TermsConditionSection";
import {BackButton} from "@screens/OnboardingNavigator/screens/components/BackButton";
import {ImageWithTextRow} from "@screens/OnboardingNavigator/screens/components/ImageWithTextRow";
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {_api} from "@api/_request";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {cookieParser} from "../../../../../utils/cookieParser";


type EnterPasswordScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.ENTER_PASSWORD>

export function EnterPasswordScreen ({navigation, route}: EnterPasswordScreenProps): JSX.Element {
    const {setToken} = useAuthPersistence()

    const [password, setPassword] = useState<string>('')
    const [hasError, _setHasError] = useState<boolean>(false)
    const [errorMessage, _setErrorMessage] = useState<string>('')
    const [loading, _setIsLoading] = useState<boolean>(false)


    async function onContinue(): Promise<void> {
        try {
            _setHasError(false)
            _setErrorMessage('')
            _setIsLoading(true)
           const {data, cookies} = await _api.requestData({
                method: 'POST',
                url: 'auth/login',
                data: {
                    phoneNumber: route.params.phoneNumber,
                    password
                }
            })

            if (data.status === 1) {
                navigation.navigate( OnboardingScreenName.VERIFY_PHONE_NUMBER, {
                    phoneNumber: route.params.phoneNumber
                })
                return
            }
            await  setToken(cookieParser(cookies[0]))

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
            testID="OnboardingScreen.EnterPasswordScreen"
            style={[tailwind('pt-12'), {overflow: 'hidden'}]}
        >

            <View style={tailwind('pt-5 px-5')}>
                   <Text
                       testID='OnboardingScreen.EnterPasswordScreen.EnterPasswordText'
                       style={tailwind('font-medium text-lg text-brand-black-500')}
                   >
                       Enter password
                   </Text>
                <TextArea
                    containerStyle={tailwind('mt-2.5 overflow-hidden')}
                    textAlign='left'
                    testID="EnterPasswordScreen.TextInput"
                    onChangeText={setPassword}
                    initialText={password}
                    placeholder="Password must not be less than 8 characters"
                    placeHolderStyle="#717171"
                    style={tailwind('w-full bg-brand-gray-200 rounded-xl  font-medium text-base text-brand-black-500')}
                />
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
                    label='Continue'
                    backgroundColor={tailwind('bg-brand-black-500')}
                    testId="OnboardingScreen.EnterPasswordScreen.ContinueButton"
                    disabled={password === "" || password.length <= 7 || loading}
                />
                {hasError && (
                    <Text style={tailwind('text-center mt-5 text-brand-gray-700 text-xs font-semibold underline')}>forgot password?</Text>
                )}
            </View>
            <View style={tailwind('mt-14 pt-3.5 px-5')}>
                <TermsConditionRow testID="EnterPasswordScreen.Terms" />
                <BackButton onPress={() => navigation.goBack()}   testID="EnterPasswordScreen.BackButton" />
            </View>
            <ImageWithTextRow>
                <View testID="EnterPasswordScreen.ImageWithTextRow" style={tailwind('flex flex-row items-center px-2 mt-20')}>
                    <Text style={tailwind('text-3xl font-semibold text-primary-500 mr-0.5')}>Eating Made </Text>
                    <Text style={tailwind('text-3xl font-semibold text-secondary-500 ml-0.5')}>Easy</Text>
                </View>
            </ImageWithTextRow>
        </View>
    )
}
