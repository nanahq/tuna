import {View, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {useState} from 'react'

import {tailwind} from "@tailwind";
import {TextArea} from "@components/commons/inputs/TextInput";
import {GenericButton} from "@components/commons/buttons/GenericButton";

import {TermsConditionRow} from "@screens/OnboardingNavigator/screens/components/TermsConditionSection";
import {BackButton} from "@screens/OnboardingNavigator/screens/components/BackButton";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {ImageWithTextRow} from "@screens/OnboardingNavigator/screens/components/ImageWithTextRow";

type EnterPhoneNumberScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.ENTER_MOBILE_PHONE>
export function EnterPhoneNumberScreen ({navigation}: EnterPhoneNumberScreenProps): JSX.Element {
    const [phoneNumber, setPhoneNumber] = useState<string>('')

    function onContinue(): void {
        navigation.navigate({
            name: OnboardingScreenName.ENTER_PASSWORD,
            params: {
               phoneNumber,
            },
            merge: true,
        });
    }
    return (
        <View
            testID="OnboardingScreen.EnterPhoneNumberScreen"
            style={[tailwind('pt-12'), {overflow: 'hidden'}]}
        >

        <View style={tailwind('pt-5 px-5')}>
            <Text
                testID='OnboardingScreen.EnterPhoneNumberScreen.EnterPhoneText'
                style={tailwind('font-medium text-lg text-brand-black-500')}
            >
                Enter mobile number
            </Text>
            <TextArea
                containerStyle={tailwind('mt-2.5 mb-6 overflow-hidden')}
                textAlign='left'
                keyboardPad='phone-pad'
                testID="EnterPhoneNumberScreen.TextInput"
                onChangeText={setPhoneNumber}
                initialText={phoneNumber}
                placeholder="091 740 48621"
                placeHolderStyle="#717171"
                style={tailwind('w-full bg-brand-gray-200 rounded-xl  font-medium text-base text-brand-black-500')}
            />
            <GenericButton
                onPress={onContinue}
                labelColor={tailwind('text-white')}
                label='Continue'
                backgroundColor={tailwind('bg-brand-black-500')}
                testId="OnboardingScreen.EnterPhoneNumberScreen.ContinueButton"
                disabled={phoneNumber === "" || phoneNumber.length < 11}
            />
        </View>
            <View style={tailwind('mt-14 pt-3.5 px-5')}>
               <TermsConditionRow testID="EnterPhoneNumberScreen.Terms" />
                <BackButton onPress={() => navigation.goBack()}   testID="EnterPhoneNumberScreen.BackButton" />
            </View>
            <ImageWithTextRow>
                <View testID="EnterPhoneNumberScreen.ImageWithTextRow" style={tailwind('flex flex-row items-center px-2 mt-20')}>
                    <Text style={tailwind('text-3xl font-semibold text-primary-500 mr-0.5')}>Are you </Text>
                    <Text style={tailwind('text-3xl font-semibold text-secondary-500 ml-0.5')}>Hungry?</Text>
                </View>
            </ImageWithTextRow>
        </View>
    )
}
