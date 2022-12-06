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
            return ["40%"]; // ios measures space without keyboard
        } else if (Device.osName === "Android") {
            return ["40%"]; // android measure space by including keyboard
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
    if(isWeb) {
        return (
            <SafeAreaView
                style={tailwind("w-full h-full flex-col absolute z-50 top-0 left-0")}
                ref={containerRef}
            >
                <Modal
                    container={containerRef}
                    show
                    renderBackdrop={() => (
                        <View
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                backgroundColor: "black",
                                opacity: 0.6,
                            }}
                        />
                    )}
                    style={{
                        position: "absolute",
                        height: "450px",
                        width: "375px",
                        zIndex: 50,
                        bottom: "0",
                    }} // array as value crashes Web Modal
                >
                    <View style={tailwind('bg-white rounded-t-xl p-5 h-full')}>
                        <View style={tailwind('flex w-full flex-col justify-center')}>
                            <IconComponent iconType='Feather' name='check-circle' size={100} style={tailwind('text-primary-500 text-center')} />
                            <Text style={tailwind('font-semibold mt-3 text-lg text-center text-brand-black-500')}>Account successfully Created!</Text>
                            <GenericButton
                                style={tailwind('mt-4')}
                                onPress={goToLogin}
                                labelColor={tailwind('text-white py-3 text-sm')}
                                label='Log into your account'
                                backgroundColor={tailwind('bg-secondary-500')}
                                testId="WelcomeModal.ContinueButton"
                            />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
    return (
        <BottomSheetModal
            onChange={(index) => {
                if(index === 1) {
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
                style={tailwind('bg-brand-blue-200 rounded-t-xl')}
              />
            )}
        >
            <View style={tailwind('bg-white rounded-t-xl p-5 h-full')}>
               <View style={tailwind('flex w-full flex-col justify-center')}>
                   <IconComponent iconType='Feather' name='check-circle' size={100} style={tailwind('text-primary-500 text-center')} />
                   <Text style={tailwind('font-semibold mt-3 text-lg text-center text-brand-black-500')}>Account successfully Created!</Text>
                   <GenericButton
                       style={tailwind('mt-4')}
                       onPress={goToLogin}
                       labelColor={tailwind('text-white py-3 text-sm')}
                       label='Log into your account'
                       backgroundColor={tailwind('bg-secondary-500')}
                       testId="WelcomeModal.ContinueButton"
                   />
               </View>
            </View>
        </BottomSheetModal>
    );
}
