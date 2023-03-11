import {KeyboardAvoidingView, ScrollView, Switch, Text, View} from 'react-native'
import {useEffect, useState} from "react";
import {getColor, tailwind} from '@tailwind'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {ListingMenuI, ListingOptionGroupI} from '@imagyne/eatlater-types'
import {useForm} from "react-hook-form";
import {StackScreenProps} from "@react-navigation/stack";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {ControlledTextInputWithLabel} from "@components/commons/inputs/ControlledTextInput";
import {ImagePreviewComponent} from "@screens/AppNavigator/ListingsNavigator/screens/components/ImagePreviewComponent";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {deleteMenu, fetchMenus} from "@store/listings.reducer";
import {_api} from "@api/_request";
import Toast from "react-native-toast-message";

interface MenuFormInterface {
    isLive: boolean,
    isAvailable: boolean

}

type SingleMenuNavProps = StackScreenProps<ListingsParams, "SingleMenu">

export function SingleMenu ({route, navigation}: SingleMenuNavProps): JSX.Element {
    const dispatch = useAppDispatch()
    const { control, setValue} = useForm<Partial<ListingMenuI>>()
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingUpdate, setUpadateLoading] = useState<boolean>(false)
    const [menuForm, setMenuForm] = useState<MenuFormInterface>({
        isAvailable: false,
        isLive: false
    })

    const [image, setImage] = useState<string>('')
    const [_, setOptions] = useState<ListingOptionGroupI[]>([])
    const [hasEdit, setHasEdit] = useState<boolean>(false)
    // state
    const {listingsOptionGroup} = useAppSelector((state: RootState) => state.listings)

    useEffect(() => {
        if (route?.params?.menu !== undefined) {
            const menu = route?.params?.menu
            setValue('name', menu.name)
            setValue("desc", menu.desc)
            setValue("price", menu.price)
            setValue("serving", menu.serving)
            setMenuForm({
                isLive: menu.isLive,
                isAvailable: menu.isAvailable
            })
            setImage(menu.photo)
            setOptions(listingsOptionGroup.filter(group => !(group._id in menu.optionGroups)))
        }
    }, [])

    const handleDeleteListing = async () => {
        setLoading(true)
        await dispatch(deleteMenu(route?.params?.menu._id))
        setLoading(false)
        navigation.goBack()
    }

    const handleUpdate = async () => {
        setUpadateLoading(true)

        try {
            const res = (await _api.requestData({
                method: 'put',
                url: 'listing/menu',
                data: {...menuForm, menuId: route?.params?.menu._id}
            })).data


            if (res.status === 1) {
                Toast.show({
                    type: 'success',
                    text1: 'Menu updated!',
                    autoHide: true,
                })
            }
            await dispatch(fetchMenus())
            setHasEdit(false)
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error.message !== 'string' ? error.message[0] : error.message,
                autoHide: true,
            })
        } finally {
            setUpadateLoading(false)
        }
    }

    const handleSetOption = (name: keyof MenuFormInterface, value: boolean): void => {
        if (route?.params?.menu[name] !== value) {
            setHasEdit(true)
        } else {
            setHasEdit(false)
        }

        setMenuForm((prevState) => ({...prevState, [name]: value}))
    }


    return (
        <KeyboardAvoidingView style={tailwind('px-5 bg-brand-gray-500 ')}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <GoBackButton onPress={() => navigation.goBack()} />
                <ControlledTextInputWithLabel
                    label="Menu Name"
                    labelTestId=""
                    placeholder='Moi Moi'
                    name='name'
                    control={control}
                    editable={false}
                />
                <ControlledTextInputWithLabel
                    editable={false}
                    containerStyle={tailwind('mt-5')}
                    label="Menu Description"
                    labelTestId=""
                    placeholder='Jollof rice cooked to absolute perfection...'
                    textAlignVertical="top"
                    multiline
                    numberOfLines={4}
                    style={{
                        height: 150
                    }}
                    name='desc'
                    control={control}
                />

                <View style={tailwind('flex flex-row items-center justify-between w-full mt-5')}>
                    <ControlledTextInputWithLabel
                        editable={false}
                        keyboardType='number-pad'
                        label='Price'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        collapsable
                        placeholder="1200"
                        name='price'
                        control={control}
                    />
                    <ControlledTextInputWithLabel
                        editable={false}
                        label='Serving/Price type'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        placeholder='per bowl'
                        name='serving'
                        control={control}
                    />
                </View>
                    <ImagePreviewComponent uri={image}  />
                {/* @todo(siradji): Implement option addition */}
                {/* <View style={tailwind('flex flex-col mt-10')}> */}
                {/*     <Text style={tailwind('font-medium text-brand-black-500 my-3')}>Menu Options</Text> */}
                {/*      */}
                {/*     <OptionHeader navigation={navigation} /> */}
                {/*     {options.length >= 1 && ( */}
                {/*         <Modal promptModalName={OPTION_PICKER_MODAL} modalRef={bottomSheetModalRef}> */}
                {/*                 <Picker */}
                {/*                     onValueChange={(value) => handleOptionSelection(value) } */}
                {/*                 > */}
                {/*                     {options.map(option => ( */}
                {/*                         <Picker.Item label={option.name} value={option._id} key={option._id} /> */}
                {/*                     ))} */}
                {/*                 </Picker> */}
                {/*         </Modal> */}
                {/*     )} */}
                {/*     <Pressable  onPress={openModal} style={tailwind(' mt-3 flex flex-row w-full justify-between items-center bg-brand-blue-200 p-2 rounded-sm')}> */}
                {/*         <Text style={tailwind('text-brand-black-500 font-medium')}>{}</Text> */}
                {/*         <IconComponent iconType='Feather' name='chevron-down' style={tailwind('text-brand-black-500')} size={14} /> */}
                {/*     </Pressable> */}
                {/* </View> */}
                <View style={tailwind('flex flex-row items-center mt-10')}>
                    <View style={tailwind('flex flex-col w-1/2')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Live</Text>
                        <Text style={tailwind('text-brand-gray-700 text-xs')}>Customer will be able to see this menu but won't be able to place order if availability is turned off</Text>
                    </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-500')}}
                        thumbColor={menuForm.isLive ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(value) => handleSetOption('isLive', value)}
                        value={menuForm.isLive}
                    />
                </View>
                <View style={tailwind('flex flex-row items-center mt-5')}>
                    <View style={tailwind('flex flex-col w-1/2')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Available</Text>
                        <Text style={tailwind('text-brand-gray-700 text-xs')}>This menu is available to customers to place orders.</Text>
                    </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-500')}}
                        thumbColor={menuForm.isAvailable ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(value) => handleSetOption('isAvailable', value)}
                        value={menuForm.isAvailable}
                    />
                </View>

                {hasEdit   && (
                    <GenericButton loading={loadingUpdate} onPress={() => handleUpdate()}  label='Update Menu' backgroundColor={tailwind('bg-primary-700')} labelColor={tailwind('text-white')} testId="" style={tailwind('w-full mt-10')} />

                )}
                    <View style={tailwind(' flex flex-col w-full border-0.5 border-dashed border-brand-black-500 py-3 px-4 mt-5 mb-10')}>
                        <Text style={tailwind('text-brand-gray-400 text-xs font-medium mb-4')}>
                            This Listing will be deleted and can not be undone. Pending orders will still show the listing and must be delivered to the customer
                        </Text>
                        <GenericButton
                            loading={loading}
                            onPress={() => handleDeleteListing()}
                            label='Delete Menu'
                            backgroundColor={tailwind({
                                'bg-brand-gray-500': !loading,
                                'bg-red-500': loading
                            })}
                            labelColor={tailwind({
                                'text-red-500': !loading,
                                'text-white': loading
                            })}
                            testId=""
                            style={tailwind('w-full  border-0.5 border-red-500')}
                        />
                    </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
