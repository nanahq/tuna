import {tailwind} from "@tailwind";
import { View, Text} from "react-native";

import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {GenericButton} from "@components/commons/buttons/GenericButton";

import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {EmptyOrder} from "@screens/AppNavigator/OrdersNavigator/components/EmptyOrder";
import { RootState, useAppSelector } from "@store/index";
import { IconComponent } from "@components/commons/IconComponent";
import {ModalScreenName} from "@screens/AppNavigator/ModalNavigator/ModalScreenName";
import {SettingsScreenName} from "@screens/AppNavigator/SettingsNavigator/SettingsScreenName.enum";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import {useEffect} from "react";


export function PaymentSettings (): JSX.Element {
    const {profile, hasFetchedProfile} = useAppSelector((state: RootState) => state.profile)
    const navigation  = useNavigation<NavigationProp<any>>()


    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />
        })
    }, [])


    if (!hasFetchedProfile) {
        return <LoaderComponent />
    }

    function addPayment (): void {
      navigation.navigate<any>(ModalScreenName.ADD_BANK_ACCOUNT_SCREEN, {
          callback: navigation.navigate(SettingsScreenName.PAYMENT_PROFILE, {})
      })
    }



    return (
        <View style={tailwind('flex-1 bg-white px-5')}>
            <View style={tailwind('flex-grow ')}>
                <ProfileSection sectionName="Bank information" editable={false}>
                    <View style={tailwind('flex flex-col')}>
                       <View style={tailwind('flex flex-row items-center')}>
                       <IconComponent iconType="Feather" name='info' style={tailwind('text-brand-gray-700')} size={14} />
                        <Text style={tailwind('text-brand-gray-700 text-xs font-medium ml-2')}>
                                Add your banking information here. Information provided here will be used to make payout.
                            </Text>

                       </View>
                    </View>

                    {profile.settings?.payment === undefined && (
                        <EmptyOrder  msg='No Bank account added yet'/>
                    )}
                    {profile.settings?.payment !== undefined && (
                            <View style={tailwind('flex flex-col w-full mt-10')}>
                                <View style={tailwind('')}>
                                    <Text style={tailwind('text-black text-lg')}>Payout banks</Text>
                                </View>
                                <View style={tailwind('flex flex-col mt-5 w-full')}>
                                    <View style={tailwind(' flex w-full border-0.5 border-gray-300 rounded-lg py-3 px-4 bg-white')}>
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
                                            text={`${profile.settings.payment.bankAccountNumber.substring(0, 6)}*****`}
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
                </ProfileSection>
            </View>
            {profile.settings?.payment === undefined && (
                <GenericButton

                    style={tailwind('my-4 px-5')}
                    onPress={addPayment}
                    label='Add Bank'
                    labelColor={tailwind('text-white font-medium')}
                    backgroundColor={tailwind('bg-primary-500')} testId="Loc.Cord"
                />
            )}
    </View>
    )
}

export function BankInfoItem ({title, text}: {title: string, text:string}): JSX.Element {
    return (
        <View style={tailwind('flex flex-row w-full items-center')}>
            <Text style={tailwind('mr-2')} >{title}</Text>
            <Text style={tailwind('text-sm w-28')} numberOfLines={1} ellipsizeMode="tail">{text}</Text>
        </View>
    )
}
