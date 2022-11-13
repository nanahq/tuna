import {OnboardingNagivator} from "../OnboardingNavigator/OnboardingNav";

export function RootNavigator (): JSX.Element {
    if(typeof 'a' === 'string') {
        return <OnboardingNagivator />
    }
    return  (
        <OnboardingNagivator />
    )
}
