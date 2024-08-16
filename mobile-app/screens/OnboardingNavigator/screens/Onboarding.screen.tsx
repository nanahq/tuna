import { Text, View } from 'react-native';
import { tailwind } from "@tailwind";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useLogger } from "@contexts/NativeLoggingProvider";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { OnboardingParamsList } from "@screens/OnboardingNavigator/OnboardingNav";
import { OnboardingScreenName } from "@screens/OnboardingNavigator/ScreenName.enum";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import OnboardingCoverImage from '@assets/onboarding/onboarding-2.jpg';
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import AppLogo from '@assets/onboarding/nana-logo.png'
import OnboardingV1 from '@assets/onboarding/onboarding_v3.png'
const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export function OnboardingScreen(): JSX.Element {
    const navigator = useNavigation<NavigationProp<OnboardingParamsList>>();
    const logger = useLogger();
    const insets = useSafeAreaInsets();

    // Hide splashscreen when the first page is loaded to prevent a white screen
    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
    }, []);

    return (
        <SafeAreaView
            style={tailwind('flex flex-col flex-1 px-4 bg-white')}
            testID="OnboardingScreen.View"
        >
                <Image
                    style={[tailwind(''),{width: 70, height: 70} ]}
                    source={AppLogo}
                    placeholder={{ blurhash }}
                    contentFit="contain"
                    transition={100}
                />

            <Image
                style={[tailwind('mt-10 w-full flex-1 ')]}
                source={OnboardingV1}
                placeholder={{ blurhash }}
                contentFit="contain"
                transition={100}
            />
            <View style={tailwind('flex-1 justify-end')}>
                <View style={tailwind('mb-20')}>
                    <Text style={tailwind(' text-gray-600 text-center')}>Boost sales and grow your business with Nana. Reach a wider audience of customers with ease.</Text>
                </View>
                <View style={[tailwind('flex flex-col  w-full'), {marginBottom: insets.bottom + 26}]}>
                    <GenericButton
                        onPress={() => navigator.navigate(OnboardingScreenName.SIGN_UP_PROFILE)}
                        label="Sign up"
                        labelColor={tailwind('text-primary-100 w-full font-normal')}
                        overRideBackgroundColor={tailwind('bg-transparent border-1.5 border-primary-100 mb-5 ')}
                        testId="GenericButton.Onboarding.Continue"
                    />
                    <View style={tailwind('w-4')} />
                    <GenericButton
                        onPress={() => navigator.navigate(OnboardingScreenName.LOGIN)}
                        label="Log in"
                        labelColor={tailwind('text-white')}
                        overRideBackgroundColor={tailwind('')}
                        testId="GenericButton.Onboarding.Continue"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
