import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {OnboardingNagivator} from "./OnboardingNavigator/OnboardingNav";
import {AppNavigator} from "@screens/AppNavigator/AppNav";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import {useLogger} from "@contexts/NativeLoggingProvider";

export function RootNavigator (): JSX.Element {
    const logger = useLogger()
    const {isAuthenticated} =  useAuthPersistence()
    // Hide splashscreen when first page is loaded to prevent white screen
    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
    }, []);

    if (isAuthenticated) {
        return <AppNavigator />
    }
    return  (
        <OnboardingNagivator />
    )
}
