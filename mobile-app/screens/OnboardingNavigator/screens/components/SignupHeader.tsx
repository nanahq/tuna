import {tailwind} from "@tailwind";
import {Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {IconButton} from "@components/commons/buttons/IconButton";
import {useNavigation} from "@react-navigation/native";
import {ProgressBar} from "@screens/OnboardingNavigator/screens/components/ProgressBar";

export function SignupHeader (props: {page: string, showBackButton?: boolean}): JSX.Element {
    const {showBackButton = false} = props
    const navigation = useNavigation()
    const { top: topInsert} = useSafeAreaInsets()
    return (
        <View style={[tailwind('flex flex-1 bg-white flex-col w-full px-5 pb-3'), {paddingTop: topInsert + 24}]}>
            <Text testID='signupProfileScreen.GetStarted' style={tailwind('font-semibold text-xl text-brand-black-500')}>Get started</Text>
            {!showBackButton && (<Text  testID='signupProfileScreen.Page'  style={tailwind('self-end text-sm text-brand-black-500 font-medium')}>{props.page} Details</Text>
            )}
            {showBackButton && (
                <View style={tailwind('flex flex-row w-full justify-between mt-3')}>
                    <IconButton
                        testID="SignupHeader.BackButton"
                        onPress={navigation.goBack}
                        iconStyle={tailwind('text-brand-black-500')}
                        iconType='Feather'
                        iconName='arrow-left'
                        iconSize={24}
                    />
                    <Text  testID='signupProfileScreen.Page'  style={tailwind(' text-sm text-brand-black-500 font-medium')}>{props.page} Details</Text>
                </View>
            )}
            <ProgressBar progress={props.page === 'Restaurant' ? 2 : 1} />
        </View>
    )
}
