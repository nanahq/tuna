import {
    LinkingOptions,
    NavigationContainer,
    NavigationContainerRef,
} from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

import * as Linking from "expo-linking";
import {useRef} from "react";
import {EnterPhoneNumberScreen} from "@screens/OnboardingNavigator/screens/authentication/EnterPhoneNumber.screen";
import {EnterPasswordScreen} from "@screens/OnboardingNavigator/screens/authentication/EnterPassword.Screen";
import {VerifyPhoneNumberScreen} from "@screens/OnboardingNavigator/screens/authentication/VerifyPhoneNumber.screen";
import {OnboardingScreen} from "./screens/Onboarding.screen";
import {OnboardingScreenName} from "./ScreenName.enum";

export interface OnboardingParamsList {
    [OnboardingScreenName.SIGN_UP_BUSINESS]: {
        firstName: string
        lastName: string
        phoneNumber: string
        password: string
        confirmPassword: string
        email: string
    },

    [key: string]: undefined | object;
}

const OnboardingStack = createStackNavigator<OnboardingParamsList>();

const LinkingConfiguration: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [Linking.createURL("/")],
    config: {
        screens: {
            [OnboardingScreenName.ONBOARDING]: "onboarding/landing",
            [OnboardingScreenName.SIGN_UP_PROFILE]: "onboarding/signup/profile",
            [OnboardingScreenName.SIGN_UP_BUSINESS]: "onboarding/signup/business",
            [OnboardingScreenName.LOGIN]: "onboarding/login",
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
                    component={EnterPhoneNumberScreen}
                    name={OnboardingScreenName.LOGIN}
                    options={{
                        headerShown: false
                    }}
                />
                <OnboardingStack.Screen
                    component={EnterPasswordScreen}
                    name={OnboardingScreenName.SIGN_UP_PROFILE}
                    options={{
                        headerShown: false
                    }}
                />
                <OnboardingStack.Screen
                    component={VerifyPhoneNumberScreen}
                    name={OnboardingScreenName.SIGN_UP_BUSINESS}
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
