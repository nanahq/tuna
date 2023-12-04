import {Dimensions, Image, View} from 'react-native'

import OnboardingCoverImage from '@assets/onboarding/small.jpg'
import {tailwind} from "@tailwind";


export function OnboardingCover (): JSX.Element {
    const {height} = Dimensions.get('screen')
    return (
        <View testID='OnboardingCover' style={[tailwind('w-full'), {height: height / 2}]}>
            <Image
                resizeMode={"cover"}
                source={OnboardingCoverImage}
                style={{
                    width: '100%',
                    height: height /2
                }}

            />
        </View>
    )
}
