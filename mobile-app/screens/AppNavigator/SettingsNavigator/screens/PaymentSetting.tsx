import {tailwind} from "@tailwind";
import {SafeAreaView, View, Text} from "react-native";
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
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import { RootState, useAppDispatch, useAppSelector } from "@store/index";
import { _api } from "@api/_request";
import { PaymentInfo } from "@imagyne/eatlater-types";
import { ShowToast } from "@components/commons/Toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { fetchProfile } from "@store/profile.reducer";
import { ModalTextInput } from "@components/commons/inputs/TextInputWithLabel";


const PaymentSettingsInteraction = {
    ADD_BANK_BTN: 'Add bank',
    ADDING_BANK_INT: 'Adding bank..',
    ADD_BANK_SUCCESS_MSG: 'Payment settigns updated'
}

const MODAL_NAME = 'ADD_BANK'



export function PaymentSettings (): JSX.Element {
    const {profile, hasFetchedProfile} = useAppSelector((state: RootState) => state.profile)
    const dispatch = useAppDispatch()
    const bottomSheetModalRef = useRef<any>(null)
    const { dismiss } = useBottomSheetModal();
    const navigation  = useNavigation()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [form, setForm] = useState<PaymentInfo>({
        bankName: '',
        bankAccountNumber: '',
        bankAccountInfo: ''
    })


    function onChange (name: keyof PaymentInfo, value: string): void {
        setForm((prevState) => ({...prevState, [name]: value}))
    }

    if(!hasFetchedProfile) {
        return <View>
            <Text>Fetching...</Text>
        </View>
    }


    async function updateProfile (): Promise<void> {
        setSubmitting(true)
        try {
            await _api.requestData({
                method: 'post',
                url: 'vendor/settings',
                data: {
                    operations: profile.settings?.operations,
                    payment: {...form}
                }
            })
            dispatch(fetchProfile())
        ShowToast('success', PaymentSettingsInteraction.ADD_BANK_SUCCESS_MSG)
        } catch (error: any) {
        ShowToast('error', typeof error?.message === 'string' ? error.messase : error.message[0])
            
        } finally {
            setSubmitting(false)
            setTimeout(() => {
               dismiss(MODAL_NAME)
            }, 500)
            setModalIsOpen(false)
        }
        
    }

    function openModal (): void {
        bottomSheetModalRef.current?.present();
        setModalIsOpen(true)
    }


    return (
        <SafeAreaView style={tailwind('flex-1')}>
            <ScrolledView testId="AccountProfile.View" style={tailwind('flex w-full px-5  bg-white')}>
                <GoBackButton onPress={() => navigation.goBack()} />
                <ProfileSection sectionName="Bank information" editable={false}>
                    {!modalIsOpen &&  profile.settings?.payment ==undefined && (
                        <EmptyOrder  msg='No Bank account added yet'/>
                    )}

                    {profile.settings?.payment !== undefined && (
                            <View>
                                <View>
                                    <Text>{profile.settings?.payment.bankName}</Text>
                                </View>
                                <View>
                                    <Text>{profile.settings?.payment.bankAccountInfo}</Text>
                                </View>
                            </View>
                    )}
                   <AddBankModal  
                   enablePanDownToClose={true} 
                   promptModalName={MODAL_NAME}
                    modalRef={bottomSheetModalRef}
                    onDismiss={() => setModalIsOpen(false) }
                    >
                        <ModalTextInput
                           placeholder="Wema Bank"
                           label='Bank Name'
                           testID='AccountProfile.Email.Input'
                           labelTestId="AccountProfile.Email.Label"
                           containerStyle={tailwind('w-full mt-5')}
                           value={form.bankName}
                           onChangeText={(value) => onChange('bankName', value)}

                       />
                       <ModalTextInput
                           placeholder='Dorcas Musa'
                           label='Bank Account Name'
                           testID='AccountProfile.PhoneNumber.Input'
                           labelTestId="AccountProfile.PhoneNumber.Label"
                           containerStyle={tailwind('w-full mt-5')}
                           value={form.bankAccountInfo}
                           onChangeText={(value) => onChange('bankAccountInfo', value)}

                       />
                       <ModalTextInput
                           placeholder="000 000 0000"
                           label='Bank Account Number'
                           testID='AccountProfile.Email.Input'
                           labelTestId="AccountProfile.Email.Label"
                           containerStyle={tailwind('w-full mt-5')}
                           value={form.bankAccountNumber}
                           onChangeText={(value) => onChange('bankAccountNumber', value)}

                       />
                       <GenericButton
                           loading={submitting}
                           style={tailwind('mt-4')}
                           labelColor={tailwind('text-white')}
                           onPress={() => updateProfile()}
                           label={submitting ? PaymentSettingsInteraction.ADDING_BANK_INT : PaymentSettingsInteraction.ADD_BANK_BTN}
                           backgroundColor={tailwind('bg-primary-700')}
                           testId="Accountprofile.editButton"
                       />
                   </AddBankModal>
                   {!modalIsOpen && profile.settings?.payment == undefined && (
                    <GenericButton
                    style={tailwind('my-4')}
                    onPress={openModal}
                    label='Add Bank'
                    labelColor={tailwind('text-white')}
                    backgroundColor={tailwind('bg-brand-black-500')} testId="Loc.Cord"
                     />
                   )}
                </ProfileSection>
            </ScrolledView>
        </SafeAreaView>
    )
}
