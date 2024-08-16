import {StyleProp, Text, TextStyle, TouchableOpacity} from "react-native";
import {tailwind} from "@tailwind";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

export function LoginButtonWithText (props: {style?: StyleProp<TextStyle>}): JSX.Element {
    const navigation  = useNavigation<NavigationProp<OnboardingParamsList>>()

    function goToLogin (): void {
        navigation.navigate(OnboardingScreenName.LOGIN)
    }
    return (
        <TouchableOpacity onPress={goToLogin} testID="LoginButtonWithText.Button" style={tailwind('my-3')}>
            <Text testID="LoginButtonWithText.Text" style={[tailwind('font-normal text-sm text-center'), props.style]}>Do you have an account? Login</Text>
        </TouchableOpacity>
    )
}


export function LogoutButtonWithText (props: {style?: StyleProp<TextStyle>}): JSX.Element {
    const navigation  = useNavigation<NavigationProp<OnboardingParamsList>>()

    function goToLogin (): void {
        navigation.navigate(OnboardingScreenName.SIGN_UP_PROFILE)
    }
    return (
        <TouchableOpacity onPress={goToLogin} testID="LoginButtonWithText.Button" style={tailwind('my-10')}>
            <Text testID="LoginButtonWithText.Text" style={[tailwind('text-white font-normal'), props.style]}> You don't have an account? <Text style={tailwind('font-bold text-primary-100')}> Sign up</Text></Text>
        </TouchableOpacity>
    )
}
