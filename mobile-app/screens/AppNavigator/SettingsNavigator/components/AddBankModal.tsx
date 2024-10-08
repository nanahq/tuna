import {PropsWithChildren, RefObject, useCallback, useEffect, useRef} from "react";
import {tailwind} from "@tailwind";
import {SafeAreaView, View} from "react-native";
import * as Device from 'expo-device'
import {
    BottomSheetBackdropProps,
    BottomSheetBackgroundProps,
    BottomSheetModal,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import Modal from 'react-overlays/Modal'

type WelcomeModalProps =   {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    enablePanDownToClose?: boolean
    onDismiss?: () => void
}


export function AddBankModal(props: PropsWithChildren<WelcomeModalProps>): JSX.Element {
    const { dismiss } = useBottomSheetModal();
    const containerRef = useRef(null);
    const isWeb = Device.osName !== 'Android' && Device.osName !== 'iOS'
        const {enablePanDownToClose = false} = props
    const getSnapPoints = (): string[] => {
        if (Device.osName === "iOS") {
            return ["60%"]; // ios measures space without keyboard
        } else if (Device.osName === "Android") {
            return ["60%"]; // android measure space by including keyboard
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


    if (isWeb) {
        return (
            <SafeAreaView
                style={tailwind("flex-1 bg-white flex-col absolute z-50 top-0 left-0")}
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
                    <View style={tailwind('bg-white flex-1 rounded-t-xl p-5')}>
                        {props.children}
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
    return (
        <BottomSheetModal
            style={tailwind('flex-1 bg-white rounded-t-3xl')}

            enableContentPanningGesture={true}
          onDismiss={props.onDismiss}
            enableHandlePanningGesture={enablePanDownToClose}
            handleComponent={EmptyHandleComponent}
            enablePanDownToClose={enablePanDownToClose}
            onChange={(index) => {
                if (index === 1) {
                    closeModal()
                }
            }}
            name={props.promptModalName}
            ref={props.modalRef}
            snapPoints={getSnapPoints()}
            backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
                <View
                    {...backdropProps}
                    style={[backdropProps.style, tailwind("bg-black flex-1 bg-opacity-60")]}
                />
            )}
            backgroundComponent={(backgroundProps: BottomSheetBackgroundProps) => (
                <View
                    {...backgroundProps}
                    style={tailwind('bg-brand-blue-200 flex-1 rounded-t-xl')}
                />
            )}
        >
            <View style={tailwind('bg-white flex-1 rounded-t-3xl p-5')}>
                {props.children}
            </View>
        </BottomSheetModal>
    );
}


function EmptyHandleComponent(): JSX.Element {
    return <View />;
}
