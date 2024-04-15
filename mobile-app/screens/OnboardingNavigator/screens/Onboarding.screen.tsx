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
import OnboardingCoverImage from '@assets/onboarding/onboarding-2.jpg';

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
                style={tailwind('flex-1')}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']} // Adjust the overlay color and opacity here
                    style={tailwind('absolute top-0 left-0 right-0 bottom-0')}
                />
                <View style={tailwind('flex-1 justify-end px-4')}>
                    <View style={tailwind('mb-10')}>
                        <Text style={tailwind(' text-gray-100 text-3xl text-center')}>Boost sales and grow your business with Nana.</Text>
                    </View>
                    <View style={tailwind('flex flex-row justify-center items-center mb-20')}>
                        <GenericButton
                            onPress={() => navigator.navigate(OnboardingScreenName.SIGN_UP_PROFILE)}
                            label="Sign up"
                            labelColor={tailwind('text-white text-2xl w-full font-normal')}
                            backgroundColor={tailwind('bg-black w-1/2')}
                            testId="GenericButton.Onboarding.Continue"
                        />
                        <View style={tailwind('w-4')} />
                        <GenericButton
                            onPress={() => navigator.navigate(OnboardingScreenName.LOGIN)}
                            label="Log in"
                            labelColor={tailwind('text-black text-2xl font-normal')}
                            backgroundColor={tailwind('bg-white w-1/2')}
                            testId="GenericButton.Onboarding.Continue"
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
