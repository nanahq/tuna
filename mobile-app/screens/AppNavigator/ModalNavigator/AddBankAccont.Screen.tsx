import {View, Text, TextInput} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {ModalScreenName} from "@screens/AppNavigator/ModalNavigator/ModalScreenName";
import React, {useEffect, useState} from "react";
import {tailwind} from "@tailwind";
import {ModalBackIcon} from "@screens/AppNavigator/ModalNavigator/components/ModalCloseIcon";
import {Picker} from "@react-native-picker/picker";
import {_api} from "@api/_request";
import {LoaderComponent, LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {fetchProfile} from "@store/profile.reducer";
import {useAppDispatch, useAppSelector} from "@store/index";

type BankAccountModalProps = StackScreenProps<AppParamList, ModalScreenName.ADD_BANK_ACCOUNT_SCREEN>

const supportedBanksArray: string[] = [
    '044', // ACCESS_BANK
    '050', // ECO_BANK
    '070', // FIDELITY_BANK
    '011', // FIRST_BANK
    '214', // FCMB
    '058', // GT_BANK
    '082', // KEY_STONE_BANK
    '221', // STANBIC_BANK
    '232', // STERLING_BANK
    '032', // UNION_BANK
    '033', // UBA
    '215', // UNITY_BANK
    '035', // WEMA_BANK
    '057', // ZENITH_BANK,
    "50515", // moniepoint
    "999992", // OPAY
    "302", // TAJ,
    "301" //JAIZ
];
export const AddBankAccontScreen: React.FC<BankAccountModalProps> = ({navigation, route}) => {
   const {profile} = useAppSelector(state => state.profile)

    const [loading, setLoading] = useState(true)
    const [banks, setBanks] = useState<Array<{label: string, value: string}>>([])
    const [selectedBank, setSelectedBank] = useState<string>('044')
    const [bankAccountNumber, setBankAccountNumber] = useState<string>('')
    const [resolvingBank, setResolvingBank] = useState(false)
    const [bankAccountName, setBankAccountName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const toast = useToast()
    const dispatch = useAppDispatch()
    const handleClose = () => {
        if(route.params?.callback !== undefined) {
            route.params.callback()
        } else {
            navigation.goBack()
        }
    }
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Add Bank Details',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            headerStyle:  {
                shadowOpacity: 8,
                shadowRadius: 12,
            },
            headerLeft: () => <ModalBackIcon onPress={handleClose} />,
        })
    }, [])


    useEffect(() => {
        void fetchBanks()
    }, [])


    const fetchBanks = async () => {
        try {
            const {data} = await _api.requestData({
                method: 'GET',
                baseUrl: 'https://api.paystack.co',
                url: 'bank?country=nigeria&currency=ngn',
                headers: {
                    Authorization: 'Bearer sk_test_7ea3cdc260ea80eb194a8fb13606683bad280467'
                }
            })

            const formattedBanks = data?.data?.filter((bank: any) => {
                return bank.active && supportedBanksArray.includes(bank.code)
            })
                .map((bank: any) => ({value: bank.code, label: bank.name}))

            setBanks(formattedBanks)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    const handleValueChange = (value: string) => {
        setSelectedBank(value);
    };

    useEffect(() => {
            setBankAccountNumber('')
            setBankAccountName('')
    }, [selectedBank])




    const handleAccountNumber = async (value: string) => {
        if (value.length <= 10) {
            setBankAccountNumber(value);

            if(value.length === 10) {
                if (selectedBank !== undefined) {
                    try {
                        setResolvingBank(true)
                        const {data} = await _api.requestData({
                            method: 'GET',
                            baseUrl: 'https://api.paystack.co',
                            url: `bank/resolve?account_number=${value}&bank_code=${selectedBank}`,
                            headers: {
                                Authorization: 'Bearer sk_test_7ea3cdc260ea80eb194a8fb13606683bad280467'
                            }
                        })
                        setBankAccountName(data.data.account_name)
                    } catch (error) {
                        console.log(error)
                        showTost(toast, 'Failed to validate account number. Check your details', 'error')
                    } finally {
                        setResolvingBank(false)
                    }
                }
            }
        }
    };

    async function updateProfile (): Promise<void> {
        setSubmitting(true)
        try {
            await _api.requestData({
                method: 'post',
                url: 'vendor/settings',
                data: {
                    operations: profile?.settings?.operations,
                    payment: {
                        bankName: banks.find(b => b.value === selectedBank)?.label,
                        bankAccountNumber,
                        bankAccountName
                    }
                }
            })
            setTimeout(() => {
                if(route.params?.callback) {
                    route.params.callback()
                }
            }, 500)
            dispatch(fetchProfile())
            showTost(toast,'Bank Details added', 'success')
        } catch (error: any) {
            showTost(toast, typeof error?.message === 'string' ? error.message : error.message[0], 'error')

        } finally {
            setSubmitting(false)
        }

    }


        if(loading) {
        return <LoaderComponentScreen />
    }
    return (
       <View style={tailwind('flex-1 bg-white py-5  px-5')}>
           <View style={tailwind('flex-grow')}>
               <View style={tailwind('flex flex-col mb-5')}>
                   <View style={tailwind('flex flex-col mb-2.5 w-full ')}>
                       <Text
                           style={tailwind('font-medium text-sm text-brand-black-500')}>
                           Bank Name
                       </Text>

                   </View>
                   <View style={tailwind('rounded-lg bg-primary-200 px-3 font-medium  text-lg text-brand-black-500')}>
                       <Picker selectedValue={selectedBank} onValueChange={handleValueChange}>
                           {banks.map((item, index) => (
                               <Picker.Item key={index} label={item.label} value={item.value} />
                           ))}
                       </Picker>
                   </View>
               </View>
               <TextInputWithLabel editable={!resolvingBank} containerStyle={tailwind('mb-5')} keyboardType="number-pad" defaultValue={bankAccountNumber} onChangeText={(value) => handleAccountNumber(value)} label="Account Number" labelTestId="" error={false} />
               {resolvingBank && <LoaderComponent size="small" />}
               <TextInputWithLabel editable={false}  defaultValue={bankAccountName} label="Account Name" labelTestId="" error={false} />
           </View>
           <GenericButton loading={submitting} labelColor={tailwind('text-white font-medium')} style={tailwind('mb-10')} onPress={updateProfile} label="Add Bank Account" backgroundColor={tailwind('bg-primary-500')} testId="" />
       </View>
    )
}

