import { Text, View, Image} from 'react-native';
import { tailwind } from "@tailwind";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useLogger } from "@contexts/NativeLoggingProvider";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { OnboardingParamsList } from "@screens/OnboardingNavigator/OnboardingNav";
import { OnboardingScreenName } from "@screens/OnboardingNavigator/ScreenName.enum";
// import { Image } from "expo-image";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import AppLogo from '@assets/onboarding/nana-logo.png'
import OnboardingV1 from '@assets/onboarding/3d-chef-icon.png'
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
                    resizeMode="contain"
                />

            <Image
                resizeMode="contain"
                style={[tailwind('mt-10 w-full flex-1 ')]}
                source={OnboardingV1}
            />
            <View style={tailwind('flex-1 justify-end')}>
                <View style={tailwind('mb-20')}>
                    <Text style={tailwind('text-black mb-4 text-xl font-bold text-center')}>Boost sales and grow your business</Text>
                    <Text style={tailwind(' text-gray-600 px-10 text-center')}>Sell to thousands of customers already on Nana with ease.</Text>
                </View>
                <View style={[tailwind('flex flex-col  w-full'), {marginBottom: insets.bottom + 26}]}>
                    <GenericButton
                        onPress={() => navigator.navigate(OnboardingScreenName.SIGN_UP_PROFILE)}
                        label="Get started"
                        labelColor={tailwind('text-white')}
                        overRideBackgroundColor={tailwind('')}
                        testId="GenericButton.Onboarding.Continue"
                    />
                    <GenericButton
                        onPress={() => navigator.navigate(OnboardingScreenName.LOGIN)}
                        label="Login to your account"
                        labelColor={tailwind('text-primary-100 w-full font-medium text-black')}
                        overRideBackgroundColor={tailwind('bg-transparent border-0 text-black ')}
                        testId="GenericButton.Onboarding.Continue"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
