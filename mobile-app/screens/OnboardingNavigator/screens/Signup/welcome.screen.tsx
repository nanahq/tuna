import React from 'react'
import {View, Image} from "react-native";
import {tailwind} from "@tailwind";
import WelcomeImage from "@assets/onboarding/welcome.png";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

export const WelcomeScreen: React.FC =  () => {
    const navigation = useNavigation<any>()
    return (
        <SafeAreaView style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('px-5 py-20 flex h-full flex-row items-center justify-center')}>
                <View style={[tailwind('flex flex-col'), ]}>
                    <Image source={WelcomeImage}   resizeMode="center" style={tailwind('')} />
                    <View>
                        <GenericButton labelColor={tailwind('p-3 text-base text-white')} onPress={() => navigation.navigate(OnboardingScreenName.LOGIN)} label="Continue" testId="" />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
