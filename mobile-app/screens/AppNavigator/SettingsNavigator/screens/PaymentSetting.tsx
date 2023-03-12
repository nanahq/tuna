import {tailwind} from "@tailwind";
import {SafeAreaView, View, Text} from "react-native";

import {ScrolledView} from "@components/views/ScrolledView";
import {useRef, useState} from "react";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {GenericButton} from "@components/commons/buttons/GenericButton";

import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {useNavigation} from "@react-navigation/native";
import {AddBankModal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {EmptyOrder} from "@screens/AppNavigator/OrdersNavigator/components/EmptyOrder";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import { RootState, useAppDispatch, useAppSelector } from "@store/index";
import { _api } from "@api/_request";
import { PaymentInfo } from "@imagyne/eatlater-types";
import { showTost } from "@components/commons/Toast";
import { fetchProfile } from "@store/profile.reducer";
import { ModalTextInput } from "@components/commons/inputs/TextInputWithLabel";
import { useToast } from "react-native-toast-notifications";
import { IconComponent } from "@components/commons/IconComponent";


const PaymentSettingsInteraction = {
    ADD_BANK_BTN: 'Add bank',
    ADDING_BANK_INT: 'Adding bank..',
    ADD_BANK_SUCCESS_MSG: 'Payment settigns updated'
}

const MODAL_NAME = 'ADD_BANK'



export function PaymentSettings (): JSX.Element {
    const {profile, hasFetchedProfile} = useAppSelector((state: RootState) => state.profile)
    const toast = useToast()
    const dispatch = useAppDispatch()
    const bottomSheetModalRef = useRef<any>(null)
    const { dismiss } = useBottomSheetModal();
    const navigation  = useNavigation()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [form, setForm] = useState<PaymentInfo>({
        bankName: '',
        bankAccountNumber: '',
        bankAccountName: ''
    })


    function onChange (name: keyof PaymentInfo, value: string): void {
        setForm((prevState) => ({...prevState, [name]: value}))
    }

    if (!hasFetchedProfile) {
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
        showTost(toast, PaymentSettingsInteraction.ADD_BANK_SUCCESS_MSG, 'success')
        } catch (error: any) {
        showTost(toast, typeof error?.message === 'string' ? error.messase : error.message[0], 'error')
            
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
            <ScrolledView testId="AccountProfile.View" style={tailwind('flex w-full px-5 bg-brand-gray-500')}>
                <GoBackButton onPress={() => navigation.goBack()} />
                <ProfileSection sectionName="Bank information" editable={false}>
                  
                    <View style={tailwind('flex flex-col')}>
                       <View style={tailwind('flex flex-row items-center')}>
                       <IconComponent iconType="Feather" name='info' style={tailwind('text-brand-gray-700')} size={14} />
                        <Text style={tailwind('text-brand-gray-700 text-xs font-medium ml-2')}>
                                Add your banking informtion here. Information provided here will be used to make payout. 
                            </Text>
                           
                       </View>
                    </View>

                    {!modalIsOpen &&  profile.settings?.payment === undefined && (
                        <EmptyOrder  msg='No Bank account added yet'/>
                    )}
                    {profile.settings?.payment !== undefined && (
                            <View style={tailwind('flex flex-col w-full mt-10')}>
                                <View style={tailwind('')}>
                                    <Text style={tailwind('font-bold text-brand-black-500 text-lg')}>Payout banks</Text>
                                </View>
                                <View style={tailwind('flex flex-col mt-5 w-full')}>
                                    <View style={tailwind(' flex w-full border-0.5 border-brand-gray-400 rounded-lg py-3 px-4 bg-white')}>
                                        <BankInfoItem 
                                            title="Bank Name"
                                            text={profile.settings.payment.bankName}
                                        />
                                         <BankInfoItem 
                                            title="Bank Account name"
                                            text={profile.settings.payment.bankAccountName}
                                        />
                                         <BankInfoItem 
                                            title="Bank Account number"
                                            text={`${profile.settings.payment.bankAccountNumber.substring(0, 4)}*****`}
                                        />
                                        <View style={tailwind('flex flex-row w-full justify-end')}>
                                           <View style={tailwind('w-3 h-3 bg-success-600 rounded-full')} />
                                        </View>
                                    </View>
                                </View>
                                <View style={tailwind('mt-10 w-full flex flex-row')}>
                                    <Text style={tailwind('text-brand-gray-700 text-xs font-medium ml-2')}>At the moment, we do not support changing banking information once it's added. You can contact customer support to help you with that</Text>
                                </View>
                            </View>
                    )}
                   <AddBankModal  
                   enablePanDownToClose 
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
                           value={form.bankAccountName}
                           onChangeText={(value) => onChange('bankAccountName', value)}

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
                   {!modalIsOpen && profile.settings?.payment === undefined && (
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

export function BankInfoItem ({title, text}: {title: string, text:string}): JSX.Element {
    return (
        <View style={tailwind('flex flex-row w-full items-center')}>
            <Text style={tailwind('font-semibold text-sm mr-2')}>{title}</Text>
            <Text style={tailwind('font-medium text-sm')}>{text}</Text>
        </View>
    )
}