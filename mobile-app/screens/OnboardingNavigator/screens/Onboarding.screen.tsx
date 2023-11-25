import {ScrollView, Text, View} from 'react-native'
import {tailwind} from "@tailwind";
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import {useLogger} from "@contexts/NativeLoggingProvider";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import * as Device from 'expo-device'
import {LoginButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import {OnboardingCover} from './components/OnboardingCover'

export function OnboardingScreen (): JSX.Element {
    const navigator = useNavigation<NavigationProp<OnboardingParamsList>>()
    const logger = useLogger()


    // Hide splashscreen when first page is loaded to prevent white screen
    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
    }, []);
    return (
       <ScrollView
           style={tailwind('flex flex-1 bg-white')}
        testID="OnboardingScreen.View"
       >
          <OnboardingCover />
           <View style={tailwind('bg-white flex w-full py-8 px-9 h-full')}>
               <Text testID='OnboardingScreen.Heading' style={tailwind('font-bold text-black text-center text-lg', {
                   'mt-9': Device.osName === 'iOS',
                   'mt-5': Device.osName === 'Android'
               })}>
                   Drive sales by reaching out to wider audience
               </Text>
               <Text  testID='OnboardingScreen.Text' style={tailwind('font-normal text-black text-center text-sm pt-2.5', {
                   'mt-10': Device.osName === 'iOS',
                   'mt-8': Device.osName === 'Android'
               })}>
                   Sell on Nana and boost your sales, grow your business and more benefits
               </Text>
                <GenericButton
                    onPress={() => navigator.navigate(OnboardingScreenName.SIGN_UP_PROFILE)}
                    label="Join us!"
                    labelColor={tailwind('text-white text-base font-bold')}
                    backgroundColor={tailwind('bg-primary-500')}
                    style={tailwind({
                        'mt-28': Device.osName === 'iOS',
                        'mt-20': Device.osName === 'Android'
                    })}
                    testId="GenericButton.Onboarding.Continue"
                />
                <LoginButtonWithText />
           </View>
       </ScrollView>
    )
}
