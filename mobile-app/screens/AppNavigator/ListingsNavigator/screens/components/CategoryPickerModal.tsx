import {PropsWithChildren, RefObject, useCallback, useEffect} from "react";
import {tailwind} from "@tailwind";
import { Text, TouchableOpacity, View} from "react-native";
import * as Device from 'expo-device'
import {
    BottomSheetBackdropProps,
    BottomSheetBackgroundProps, BottomSheetFooter, BottomSheetFooterProps,
    BottomSheetModal,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {NavigationProp} from "@react-navigation/native";
import {GenericButton} from "@components/commons/buttons/GenericButton";

type WelcomeModalProps =   {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    enablePanDownToClose?: boolean
    onDismiss?: () => void

    navigation: NavigationProp<any>
    listSize: number
}


export function CategoryPickerModal(props: PropsWithChildren<WelcomeModalProps>): JSX.Element {
    const { dismiss } = useBottomSheetModal();
    const {enablePanDownToClose = false} = props
    const getSnapPoints = (): string[] => {
       if(props.listSize < 2) {
           return ["20%"]
       } else if (props.listSize < 6) {
           const size = props.listSize * 10
           return [`${size}%`]
       }
       return ["50%"]
    }

    const closeModal = useCallback(() => {
        dismiss(props.promptModalName);
    }, []);

    useEffect(() => {
        return () => {
            closeModal();
        };
    }, []);

    return (
        <BottomSheetModal
            style={tailwind('flex-1 bg-white rounded-t-3xl')}
            enableContentPanningGesture={true}
            onDismiss={props.onDismiss}
            enableHandlePanningGesture={enablePanDownToClose}
            handleComponent={() => (
                <EmptyHandleComponent dismiss={closeModal} />
            )}
            enablePanDownToClose={enablePanDownToClose}
            footerComponent={({animatedFooterPosition}) => (
                <ModalFooter animatedFooterPosition={animatedFooterPosition} hasListing={props.listSize >= 1} onPress={() => {
                    props.navigation.navigate("AddCategory")
                    closeModal()
                }} />
            )}
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
            <View style={tailwind('bg-white mb-4 flex-1 rounded-t-3xl p-5')}>
                {props.children}
            </View>
        </BottomSheetModal>
    );
}

interface ModalFooterProps extends BottomSheetFooterProps {
    onPress: () => void
    hasListing: boolean
}

const ModalFooter: React.FC<ModalFooterProps> = ({animatedFooterPosition, onPress, hasListing}) => {
    const { bottom: bottomSafeArea } = useSafeAreaInsets();
    const isAndroid = Device.osName === 'Android'
    return (
        <BottomSheetFooter
            style={tailwind('px-5 flex flex-row w-full')}
            animatedFooterPosition={animatedFooterPosition}
            bottomInset={bottomSafeArea}
        >
            {!hasListing && (
                <View style={tailwind('flex flex-col w-full items-center justify-between')}>
                    <Text>You don't have any category added yet</Text>
                    <GenericButton
                        style={tailwind('w-full mt-5', {'mb-3': isAndroid})}
                        onPress={onPress} label="Add a new category"
                        labelColor={tailwind('text-white font-medium')}
                        backgroundColor={tailwind('bg-brand-black-500')} testId="" />
                </View>
            )}
        </BottomSheetFooter>

    )
}

function EmptyHandleComponent({dismiss}: {dismiss: () => void}): JSX.Element {
    return (
        <TouchableOpacity onPress={dismiss} style={tailwind('flex mt-2 mr-3 flex-row mt-4 justify-end')}>
            <Text style={tailwind('text-sm')}>Close</Text>
        </TouchableOpacity>
    )
}
