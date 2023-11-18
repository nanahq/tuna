import { KeyboardAvoidingView, Pressable, ScrollView, Text, View} from 'react-native'
import {useMemo, useState} from "react";
import {Picker} from '@react-native-picker/picker'
import { tailwind} from '@tailwind'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {NavigationProp, useNavigation} from "@react-navigation/native";

import {IconComponent} from "@components/commons/IconComponent";

import {GenericButton} from "@components/commons/buttons/GenericButton";

import {ListingCategoryI} from "@nanahq/sticky";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {_api} from "@api/_request";

import {  showTost } from '@components/commons/Toast';
import { useToast } from 'react-native-toast-notifications';

import DateTimePicker, {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {fetchScheduled} from "@store/listings.reducer";
import * as Device from 'expo-device'
import {AndroidPickerListing} from "@screens/AppNavigator/ListingsNavigator/screens/components/AndroidPicker";

export function AddScheduledListing (): JSX.Element {
    const navigation = useNavigation()
    const dispatch = useAppDispatch()

    const {listingsCategory} = useAppSelector((state: RootState) => state.listings)

    const toast = useToast()

    const [menuForm, setMenuForm] = useState({
        availableDate: new Date() as any,
        listing: "",
        quantity: '' as any
    })



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
    }, [listingsCategory])


    const [loading, setLoading] = useState<boolean>(false)
    async function onSubmitCb (): Promise<void>  {

        try {
            setLoading(true)
            const res = (await _api.requestData({
                method: 'post',
                url: 'listing/scheduled',
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
                data: {...menuForm, availableDate: menuForm.availableDate.getTime()}
            })).data

            await dispatch(fetchScheduled())
            if (res.status === 1) {
                showTost(toast, 'Scheduled Listing!', 'success')
                setTimeout(() => {
                    void navigation.goBack()
                }, 3000)
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
                <GoBackButton onPress={() => navigation.goBack()} />
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
                <GenericButton loading={loading} onPress={() => onSubmitCb()} label='Add Listing' backgroundColor={tailwind({'bg-brand-black-500': !loading, 'bg-brand-gray-700': loading})} labelColor={tailwind('text-white')} testId="" style={tailwind('w-full my-20')} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}



function SelectHeader (props: {navigation: NavigationProp<any>}): JSX.Element {
    return (
        <View style={tailwind('flex flex-row w-full items-center justify-between mt-10')}>
            <Text style={tailwind('font-medium text-sm text-brand-black-500')}>Category</Text>
            <Pressable onPress={() => props.navigation.navigate("AddCategory")} style={tailwind('flex flex-row items-center')}>
                <Text style={tailwind('font-semibold text-xs text-brand-black-500')}>Add new category</Text>
                <IconComponent iconType='Feather' name='plus-circle' style={tailwind('text-brand-black-500 ml-1')} />
            </Pressable>
        </View>
    )
}


function OptionHeader (props: {navigation: NavigationProp<any>}): JSX.Element {
    return (
        <View style={tailwind('flex flex-row w-full items-center justify-between mt-3')}>
            <Text style={tailwind('text-sm text-brand-black-500')}>No options added yet?</Text>
            <Pressable onPress={() => props.navigation.navigate("AddOption")} style={tailwind('flex flex-row items-center')}>
                <Text style={tailwind('font-semibold text-xs text-brand-black-500')}>Add new option</Text>
                <IconComponent iconType='Feather' name='plus-circle' style={tailwind('text-brand-black-500 ml-1')} />
            </Pressable>
        </View>
    )
}

function CategoryItem ({cat, onPress}: {cat: ListingCategoryI, onPress: () => void}): JSX.Element {
    return (
        <Pressable onPress={onPress} style={tailwind('flex flex-col items-center w-full mb-3  py-4 px-2 border-b-0.5 border-brand-black-500')}>
            <View style={tailwind('flex w-full flex-row items-center justify-between')}>
                <Text style={tailwind('text-brand-black-500 text-sm  font-medium')}>{cat.name}</Text>
            </View>
        </Pressable>
    )
}
