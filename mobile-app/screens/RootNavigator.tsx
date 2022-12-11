import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {OnboardingNagivator} from "./OnboardingNavigator/OnboardingNav";
import {AppNavigator} from "@screens/AppNavigator/AppNav";

export function RootNavigator (): JSX.Element {
    const {isAuthenticated} =  useAuthPersistence()
    if (isAuthenticated) {
        return <AppNavigator />
    }
    return  (
        <OnboardingNagivator />
    )
}
