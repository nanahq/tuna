import {Text, TouchableOpacity} from "react-native";
import {tailwind} from "@tailwind";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

export function LoginButtonWithText (): JSX.Element {
    const navigation  = useNavigation<NavigationProp<OnboardingParamsList>>()

    function goToLogin (): void {
        navigation.navigate(OnboardingScreenName.LOGIN)
    }
    return (
        <TouchableOpacity onPress={goToLogin} testID="LoginButtonWithText.Button" style={tailwind(' mt-8')}>
            <Text testID="LoginButtonWithText.Text" style={tailwind('text-white font-normal text-sm text-center')}>Do you have an account? Login</Text>
        </TouchableOpacity>
    )
}
