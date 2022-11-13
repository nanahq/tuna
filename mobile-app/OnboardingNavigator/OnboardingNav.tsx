import {
    LinkingOptions,
    NavigationContainer,
    NavigationContainerRef,
} from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

import * as Linking from "expo-linking";
import {useRef} from "react";
import {Dimensions} from "react-native";
import {OnboardingScreenName} from "./ScreenName.enum";
import {OnboardingScreen} from "./screens/Onboarding.screen";

export interface OnboardingParamsList {
    EnterPassword: {
        phoneNumber: string
    }
    VerifyPhoneNumber: {
        phoneNumber: string
    }

    [key: string]: undefined | object;
}

const OnboardingStack = createStackNavigator();

const LinkingConfiguration: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [Linking.createURL("/")],
    config: {
        screens: {
            [OnboardingScreenName.ONBOARDING]: "onboarding/landing",
            [OnboardingScreenName.ENTER_MOBILE_PHONE]: "onboarding/enter/phone",
            [OnboardingScreenName.ENTER_PASSWORD]: "onboarding/enter/password",
            [OnboardingScreenName.VERIFY_PHONE_NUMBER]: "onboarding/verify/phone",
            [OnboardingScreenName.FORGET_PASSWORD]: "onboarding/retrieve/password",
        },
    },
};


export function OnboardingNagivator (): JSX.Element {
    const navigationRef = useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null)
    function OnboardingStacks (): JSX.Element {
        return (
            <OnboardingStack.Navigator
                initialRouteName={OnboardingScreenName.ONBOARDING}
                screenOptions={{
                      headerShown: false
                    }}
            >
                <OnboardingStack.Screen
                    component={OnboardingScreen}
                    name={OnboardingScreenName.ONBOARDING}
                    options={{
                        headerShown: false
                    }}
                />
                <OnboardingStack.Screen
                    component={OnboardingScreen}
                    name={OnboardingScreenName.ENTER_MOBILE_PHONE}
                    options={{
                        headerShown: false
                    }}
                />
                <OnboardingStack.Screen
                    component={OnboardingScreen}
                    name={OnboardingScreenName.ENTER_PASSWORD}
                    options={{
                        headerShown: false
                    }}
                />
                <OnboardingStack.Screen
                    component={OnboardingScreen}
                    name={OnboardingScreenName.FORGET_PASSWORD}
                    options={{
                        headerShown: false
                    }}
                />

                <OnboardingStack.Screen
                    component={OnboardingScreen}
                    name={OnboardingScreenName.VERIFY_PHONE_NUMBER}
                    options={{
                        headerShown: false
                    }}
                />

            </OnboardingStack.Navigator>
        )
    }

    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            ref={navigationRef}
        >
            <OnboardingStacks />
        </NavigationContainer>
    )
}
