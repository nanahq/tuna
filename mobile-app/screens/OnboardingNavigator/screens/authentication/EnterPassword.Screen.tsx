import {useState} from "react";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {TextArea} from "@components/commons/inputs/TextInput";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {TermsConditionRow} from "@screens/OnboardingNavigator/screens/components/TermsConditionSection";
import {BackButton} from "@screens/OnboardingNavigator/screens/components/BackButton";
import {ImageWithTextRow} from "@screens/OnboardingNavigator/screens/components/ImageWithTextRow";
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";

type EnterPasswordScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.ENTER_PASSWORD>

export function EnterPasswordScreen ({navigation, route}: EnterPasswordScreenProps): JSX.Element {
    const [password, setPassword] = useState<string>('')
    const [hasError, _setHasError] = useState<boolean>(false)
    const [errorMessage, _setErrorMessage] = useState<string>('')

    function onContinue(): void {
        navigation.navigate(OnboardingScreenName.VERIFY_PHONE_NUMBER, {
            phoneNumber: route.params.phoneNumber
        })
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
                    <Text style={tailwind('mt-4 text-center text-red-600 text-xs font-semibold')}>{errorMessage}</Text>
                )}

                <GenericButton
                    style={tailwind({
                        'mt-4': hasError,
                        'mt-6': !hasError
                    })}
                    onPress={onContinue}
                    labelColor={tailwind('text-white')}
                    label='Continue'
                    backgroundColor={tailwind('bg-brand-black-500')}
                    testId="OnboardingScreen.EnterPasswordScreen.ContinueButton"
                    disabled={password === "" || password.length <= 7}
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
