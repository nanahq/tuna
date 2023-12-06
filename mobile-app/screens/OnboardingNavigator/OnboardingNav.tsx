import {LinkingOptions, NavigationContainer, NavigationContainerRef,} from "@react-navigation/native";

import {createStackNavigator} from "@react-navigation/stack";

import * as Linking from "expo-linking";
import React, {useRef} from "react";
import {SignupProfileScreen} from "@screens/OnboardingNavigator/screens/Signup/SignupProfile.screen";
import {SignupHeader} from "@screens/OnboardingNavigator/screens/components/SignupHeader";
import {SignupBusinessScreen} from "@screens/OnboardingNavigator/screens/Signup/SignupBusiness.screen";
import {LoginScreen} from "@screens/OnboardingNavigator/screens/authentication/Login.screen";
import Toast from "react-native-toast-message";
import {OnboardingScreenName} from "./ScreenName.enum";
import {OnboardingScreen} from "./screens/Onboarding.screen";

export interface OnboardingParamsList {
    [OnboardingScreenName.SIGN_UP_BUSINESS]: {
        firstName: string
        lastName: string
        phone: string
        password: string
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
                    component={LoginScreen}
                    name={OnboardingScreenName.LOGIN}
                />
                <OnboardingStack.Screen
                    component={SignupProfileScreen}
                    name={OnboardingScreenName.SIGN_UP_PROFILE}
                    options={{
                        headerShown: true,
                        header: () => <SignupHeader page="Profile"  />
                    }}
                />
                <OnboardingStack.Screen
                    component={SignupBusinessScreen}
                    name={OnboardingScreenName.SIGN_UP_BUSINESS}
                    options={{
                        headerShown: true,
                        header: () => <SignupHeader page="Restaurant" showBackButton />
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
            <Toast />
        </NavigationContainer>
    )
}
