import { KeyboardAvoidingView, ScrollView, Text, View} from 'react-native'
import React, {useEffect, useMemo, useState} from "react";
import {Picker} from '@react-native-picker/picker'
import { tailwind} from '@tailwind'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";


import {GenericButton} from "@components/commons/buttons/GenericButton";

import {ListingApprovalStatus} from "@nanahq/sticky";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {_api} from "@api/_request";

import {  showTost } from '@components/commons/Toast';
import { useToast } from 'react-native-toast-notifications';

import DateTimePicker, {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {fetchScheduled} from "@store/listings.reducer";
import * as Device from 'expo-device'
import {AndroidPickerListing} from "@screens/AppNavigator/ListingsNavigator/screens/components/AndroidPicker";
import { StackScreenProps} from "@react-navigation/stack";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {ListingsScreenName} from "@screens/AppNavigator/ListingsNavigator/ListingsScreenName.enum";

type AddScheduledListingNavigationProps = StackScreenProps<ListingsParams, ListingsScreenName.SCHEDULED>
export const AddScheduledListing:React.FC<AddScheduledListingNavigationProps> =  ({navigation}) => {
    const dispatch = useAppDispatch()

    const {listingsCategory} = useAppSelector((state: RootState) => state.listings)

    const toast = useToast()

    const [menuForm, setMenuForm] = useState({
        availableDate: new Date() as any,
        listing: "",
        quantity: '' as any
    })
    const [loading, setLoading] = useState<boolean>(false)



    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />
        })
    }, [])


    const showDatePickerAndriod = () => {
        DateTimePickerAndroid.open({
            is24Hour: true,
            value:menuForm.availableDate,
            mode:'date',
            onChange: (_, value) => setMenuForm((prev) => ({...prev, availableDate: value}))
        })
    }



    const preOrderListingsCategories = useMemo(() =>{
        return listingsCategory.filter((li) => li.type === 'PRE_ORDER')
            .flatMap(cat => cat.listingsMenu)
            .filter(li => li.status === ListingApprovalStatus.APPROVED)
    }, [listingsCategory])



    async function onSubmitCb (): Promise<void>  {
        const data = {...menuForm, availableDate: menuForm.availableDate.getTime(), quantity: +menuForm.quantity}

        if(Object.values(menuForm).includes('')) {
            showTost(toast, 'fill all the fields', 'warning')
            return
        }

        try {
            setLoading(true)
            const res = (await _api.requestData({
                method: 'post',
                url: 'listing/scheduled',
                headers:{
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                data
            })).data

            if (res.status === 1) {
                showTost(toast, 'Scheduled Listing!', 'success')
                setTimeout(() => {
                    void navigation.goBack()
                }, 500)

                dispatch(fetchScheduled())
            }

        } catch (error: any){
            showTost(  toast, typeof error.message !== 'string' ? error.message[0] : error.message, 'error')

        } finally {
            setLoading(false)
        }


    }


    return (
        <KeyboardAvoidingView style={tailwind('px-5 bg-white flex-1')}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={tailwind('w-2/3 mt-6')}>
                        <Text  style={tailwind('font-medium text-sm text-brand-black-500')}>Menu</Text>
                        <Text style={tailwind('font-normal text-xs text-brand-gray-700')}>
                            Food menu you want to add a schedule. These menu are from pre-orders category
                        </Text>
                    </View>
                    <Picker
                        style={{padding: 0, margin: 0}}
                        selectedValue={menuForm.listing}
                        onValueChange={(item) => setMenuForm((prev) => ({...prev, listing: item}))}
                    >
                        <Picker.Item  value="" label="Select Menu/Food Item"  />
                        {preOrderListingsCategories.map((cat, index) => (
                            <Picker.Item key={index} value={cat._id} label={cat.name}  />
                        ))}
                    </Picker>
                </View>
                <TextInputWithLabel
                    onChangeText={(value) => setMenuForm((prev) => ({...prev, quantity: value as any}))}
                    keyboardType='number-pad'
                    label='Quantity'
                    labelTestId=""
                    containerStyle={tailwind('w-1/2')}
                    collapsable
                    placeholder="20"
                    value={menuForm.quantity as any}
                    moreInfo="Number of packs/servings you will be making of this food."
                />

                <View style={tailwind('flex flex-row  items-center w-full ')}>
                    <View style={tailwind('w-2/3 mt-6')}>
                        <Text  style={tailwind('font-medium text-sm text-brand-black-500')}>Available Date</Text>
                        <Text style={tailwind('font-normal text-xs text-brand-gray-700')}>
                            Date in the future when this listing will be available
                        </Text>
                    </View>
                    {Device.osName === 'Android' ? (
                        <AndroidPickerListing time={menuForm.availableDate} onPress={showDatePickerAndriod} />
                    ) : (
                        <DateTimePicker
                            minimumDate={new Date()}
                            style={tailwind('w-1/3 mt-6')}
                            value={menuForm.availableDate as any}
                            mode='date'
                            onChange={(_, value) => setMenuForm((prev) => ({...prev, availableDate: value as any}))}
                        />
                    )}

                </View>
                <GenericButton disabled={loading} loading={loading} onPress={() => onSubmitCb()} label='Add Listing' backgroundColor={tailwind({'bg-brand-black-500': !loading, 'bg-brand-gray-700': loading})} labelColor={tailwind('text-white')} testId="" style={tailwind('w-full my-20')} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

