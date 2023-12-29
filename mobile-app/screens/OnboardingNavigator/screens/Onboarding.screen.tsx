import { Text, View } from 'react-native';
import { tailwind } from "@tailwind";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useLogger } from "@contexts/NativeLoggingProvider";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { OnboardingParamsList } from "@screens/OnboardingNavigator/OnboardingNav";
import { OnboardingScreenName } from "@screens/OnboardingNavigator/ScreenName.enum";
import { ImageBackground, Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import OnboardingCoverImage from '@assets/onboarding/small-1.jpg';
import AppLogo from '@assets/onboarding/nana-logo.png'
export function OnboardingScreen(): JSX.Element {
    const navigator = useNavigation<NavigationProp<OnboardingParamsList>>();
    const logger = useLogger();

    // Hide splashscreen when the first page is loaded to prevent a white screen
    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
    }, []);

    return (
        <View
            style={tailwind('flex flex-col flex-1 bg-white')}
            testID="OnboardingScreen.View"
        >
            <ImageBackground
                source={OnboardingCoverImage}
                contentFit="cover"
                style={tailwind('flex-1 ')}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']} // Adjust the overlay color and opacity here
                    style={tailwind('absolute top-0 left-0 right-0 bottom-0')}
                />
                <View style={tailwind('w-full  flex-1 px-4')}>
                   <View style={tailwind('flex flex-col flex-grow w-full')}>
                       <Image
                           source={AppLogo}
                           contentFit="contain"
                           style={[tailwind('flex flex-row w-full justify-start'), {width: 200, aspectRatio:1}]}
                       />
                       <View style={tailwind('flex flex-col w-2/3')}>
                           <Text numberOfLines={2} style={tailwind('text-2xl font-bold text-white')}>Drive Sales and grow your business</Text>
                           <Text style={tailwind('text-primary-500 text-3xl font-bold')}>With Nana</Text>
                       </View>
                   </View>

                    <View style={tailwind('flex-1')}>
                        <GenericButton
                            onPress={() => navigator.navigate(OnboardingScreenName.SIGN_UP_PROFILE)}
                            label="Sign up"
                            labelColor={tailwind('text-black text-2xl  font-normal')}
                            backgroundColor={tailwind('bg-white')}
                            testId="GenericButton.Onboarding.Continue"
                        />
                        <GenericButton
                            style={tailwind('mt-3')}
                            onPress={() => navigator.navigate(OnboardingScreenName.LOGIN)}
                            label="Log in"
                            labelColor={tailwind('text-white text-2xl font-normal')}
                            backgroundColor={tailwind('bg-black')}
                            testId="GenericButton.Onboarding.Continue"
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
