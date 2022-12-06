import {Image, View} from 'react-native'

import OnboardingCoverImage from '@assets/onboarding/onboarding_cover.jpg'


export function OnboardingCover (): JSX.Element {
    return (
        <View testID='OnboardingCover'>
            <Image
                source={OnboardingCoverImage}
                style={{
                    width: '100%',
                    height: 400
                }}
            />
        </View>
    )
}
