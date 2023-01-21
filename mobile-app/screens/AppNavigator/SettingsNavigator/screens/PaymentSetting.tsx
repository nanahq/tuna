import {tailwind} from "@tailwind";
import {SafeAreaView} from "react-native";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {ScrolledView} from "@components/views/ScrolledView";
import {useRef, useState} from "react";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {GenericButton} from "@components/commons/buttons/GenericButton";

import Toast from 'react-native-toast-message'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {useNavigation} from "@react-navigation/native";
import {AddBankModal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {EmptyOrder} from "@screens/AppNavigator/OrdersNavigator/components/EmptyOrder";
import {AddButton} from "@screens/AppNavigator/SettingsNavigator/components/AddButton";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";


const PaymentSettingsInteraction = {
    ADD_BANK_BTN: 'Add bank',
    ADDING_BANK_INT: 'Adding bank..',
    ADD_BANK_SUCCESS_MSG: 'Payment settigns updated'
}

const MODAL_NAME = 'ADD_BANK'

export interface PaymentSetting {
    settlementBankName: string
    settlementBankAccountName: string
    settlementBankAccountNumber: string
}


const showToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
        type: type,
        text1: message,
        autoHide: true
    });
}
export function PaymentSettings (): JSX.Element {
    const bottomSheetModalRef = useRef<any>(null)
    const { dismiss } = useBottomSheetModal();
    const navigation  = useNavigation()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [form, setForm] = useState<PaymentSetting>({
        settlementBankName: '',
        settlementBankAccountName: '',
        settlementBankAccountNumber: ''
    })


    function onChange (name: keyof PaymentSetting, value: string): void {
        setForm((prevState) => ({...prevState, [name]: value}))
    }


    async function updateProfile (): Promise<void> {
        setSubmitting(true)
        setSubmitting(false)
        showToast('success', PaymentSettingsInteraction.ADD_BANK_SUCCESS_MSG)
        setTimeout(() => {
           dismiss(MODAL_NAME)
        }, 1000)
        setModalIsOpen(false)
    }

    function openModal (): void {
        bottomSheetModalRef.current?.present();
        setModalIsOpen(true)
    }


    return (
        <SafeAreaView>
            <ScrolledView testId="AccountProfile.View" style={tailwind('flex w-full px-5 mt-5 relative')}>
                <GoBackButton onPress={() => navigation.goBack()} />
                <ProfileSection sectionName="Bank information" editable={false}>
                    {!modalIsOpen && (
                        <EmptyOrder  msg='No Bank account added yet'/>
                    )}
                   <AddBankModal promptModalName={MODAL_NAME} modalRef={bottomSheetModalRef}>
                       <TextInputWithLabel
                           placeholder="Wema Bank"
                           label='Bank Name'
                           testID='AccountProfile.Email.Input'
                           labelTestId="AccountProfile.Email.Label"
                           containerStyle={tailwind('w-full mt-5')}
                           value={form.settlementBankAccountName}
                           onChangeText={(value) => onChange('settlementBankAccountName', value)}

                       />
                       <TextInputWithLabel
                           placeholder='Dorcas Musa'
                           label='Bank Account Name'
                           testID='AccountProfile.PhoneNumber.Input'
                           labelTestId="AccountProfile.PhoneNumber.Label"
                           containerStyle={tailwind('w-full mt-5')}
                           value={form.settlementBankName}
                           onChangeText={(value) => onChange('settlementBankName', value)}

                       />
                       <TextInputWithLabel
                           placeholder="000 000 0000"
                           label='Bank Account Number'
                           testID='AccountProfile.Email.Input'
                           labelTestId="AccountProfile.Email.Label"
                           containerStyle={tailwind('w-full mt-5')}
                           value={form.settlementBankAccountNumber}
                           onChangeText={(value) => onChange('settlementBankAccountNumber', value)}

                       />
                       <GenericButton
                           loading={submitting}
                           style={tailwind('mt-4')}
                           labelColor={tailwind('text-white')}
                           onPress={() => updateProfile()}
                           label={submitting ? PaymentSettingsInteraction.ADDING_BANK_INT : PaymentSettingsInteraction.ADD_BANK_BTN}
                           backgroundColor={tailwind('bg-secondary-700')}
                           testId="Accountprofile.editButton"
                       />
                   </AddBankModal>
                </ProfileSection>
                {!modalIsOpen && <AddButton onPress={openModal} />}
            </ScrolledView>
        </SafeAreaView>
    )
}
