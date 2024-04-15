import {RefObject, useCallback, useEffect, useRef} from "react";
import {tailwind} from "@tailwind";
import {SafeAreaView, Text, View} from "react-native";
import * as Device from 'expo-device'
import {
    BottomSheetBackdropProps,
    BottomSheetBackgroundProps,
    BottomSheetModal,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {IconComponent} from "@components/commons/IconComponent";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import Modal from 'react-overlays/Modal'
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";

type WelcomeModalProps =   {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>

}


export function WelcomeButtonSheet(props: WelcomeModalProps): JSX.Element {
    const { dismiss } = useBottomSheetModal();
    const navigation = useNavigation<NavigationProp<OnboardingParamsList>>()
    const containerRef = useRef(null);
    const isWeb = Device.osName !== 'Android' && Device.osName !== 'iOS'

    const getSnapPoints = (): string[] => {
        if (Device.osName === "iOS") {
            return ["50%"]; // ios measures space without keyboard
        } else if (Device.osName === "Android") {
            return ["50%"]; // android measure space by including keyboard
        }
        return [];
    }

    const closeModal = useCallback(() => {
        if (!isWeb) {
            dismiss(props.promptModalName);
        }
    }, []);

    useEffect(() => {
        return () => {
            closeModal();
        };
    }, []);

    function goToLogin (): void {
        closeModal()
        navigation.navigate(OnboardingScreenName.LOGIN)
    }
    return (
        <BottomSheetModal
            onChange={(index) => {
                if (index === 1) {
                    goToLogin()
                }
            }}
            name={props.promptModalName}
            ref={props.modalRef}
            snapPoints={getSnapPoints()}
            backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
                <View
                    {...backdropProps}
                    style={[backdropProps.style, tailwind("bg-black bg-opacity-60")]}
                />
            )}
            backgroundComponent={(backgroundProps: BottomSheetBackgroundProps) => (
              <View
                  {...backgroundProps}
                style={tailwind('bg-brand-blue-200')}
              />
            )}
        >
            <View style={tailwind('bg-white p-5 h-full')}>
               <View style={tailwind('flex flex-1 w-full flex-col justify-center')}>
                  <View style={tailwind('flex flex-col w-full')}>
                      <IconComponent iconType='Feather' name='check-circle' size={120} style={tailwind('text-green-500 text-center')} />
                      <Text style={tailwind('font-semibold mt-3 text-lg text-center text-brand-black-500')}>Welcome to Nana!</Text>
                      <Text style={tailwind('my-5 text-lg text-center text-brand-black-500')}>
                          Log into your account and add your listing menus to get started with Nana.
                      </Text>
                  </View>
                   <GenericButton
                       style={tailwind('mt-4 flex-shrink')}
                       onPress={goToLogin}
                       labelColor={tailwind('text-white py-4 text-sm')}
                       label='Log into your account'
                       backgroundColor={tailwind('bg-brand-black-500')}
                       testId="WelcomeModal.ContinueButton"
                   />
               </View>
            </View>
        </BottomSheetModal>
    );
}
