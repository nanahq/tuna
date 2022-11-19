import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {OnboardingNagivator} from "./OnboardingNavigator/OnboardingNav";

export function RootNavigator (): JSX.Element {
    const {isAuthenticated} =  useAuthPersistence()
    if (isAuthenticated) {
        return <></>
    }
    return  (
        <OnboardingNagivator />
    )
}
