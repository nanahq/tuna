import {KeyboardAvoidingView, ScrollView, Switch, Text, View} from 'react-native'
import {useEffect, useState} from "react";
import {getColor, tailwind} from '@tailwind'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {ListingMenuI, ListingOptionGroupI} from '@nanahq/sticky'
import {useForm} from "react-hook-form";
import {StackScreenProps} from "@react-navigation/stack";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {ControlledTextInputWithLabel} from "@components/commons/inputs/ControlledTextInput";
import {ImagePreviewComponent} from "@screens/AppNavigator/ListingsNavigator/screens/components/ImagePreviewComponent";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {deleteMenu, fetchMenus} from "@store/listings.reducer";
import {_api} from "@api/_request";
import Toast from "react-native-toast-message";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";

interface MenuFormInterface {
    isLive: boolean,
    isAvailable: boolean
    serving: string
    name: string
    desc: string
    price: string



}

type SingleMenuNavProps = StackScreenProps<ListingsParams, "SingleMenu">

export function SingleMenu ({route, navigation}: SingleMenuNavProps): JSX.Element {
    const dispatch = useAppDispatch()
    const { control, setValue} = useForm<Partial<ListingMenuI>>()
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingUpdate, setUpadateLoading] = useState<boolean>(false)
    const [menuForm, setMenuForm] = useState<MenuFormInterface>({
        isAvailable: route.params?.menu.isAvailable,
        isLive: route.params?.menu.isLive,
        serving: route.params?.menu.serving,
        name: route.params?.menu.name,
        desc: route.params?.menu.desc,
        price: route.params?.menu.price,
    })

    const [image, setImage] = useState<string>('')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ _option , setOptions] = useState<ListingOptionGroupI[]>([])
    const [hasEdit, setHasEdit] = useState<boolean>(false)
    // state
    const {listingsOptionGroup} = useAppSelector((state: RootState) => state.listings)

    useEffect(() => {
        if (route?.params?.menu !== undefined) {
            setImage(route?.params?.menu.photo)
            setOptions(listingsOptionGroup.filter(group => !(group._id in route?.params?.menu.optionGroups)))
        }

        navigation.setOptions({
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
            headerTitle: route?.params?.menu.name ?? 'Menu'
        })
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

    useEffect(() => {
        const menu = route?.params?.menu as ListingMenuI
        if(menu !== undefined) {
            if(menu.isLive !== menuForm.isLive || menu.isAvailable !== menuForm.isAvailable ||menu.price !== menuForm.price || menu.desc !== menuForm.desc || menu.name !== menuForm.name || menuForm.serving !== menu.serving) {
                setHasEdit(true)
            } else {
                setHasEdit(false)
            }
        }

    }, [menuForm.serving, menuForm.price, menuForm.name, menuForm.desc])

    const handleSetOption = (name: keyof MenuFormInterface, value: boolean): void => {
        if (route?.params?.menu[name] !== value) {
            setHasEdit(true)
        } else {
            setHasEdit(false)
        }

        setMenuForm((prevState) => ({...prevState, [name]: value}))
    }


    return (
        <KeyboardAvoidingView style={tailwind('px-5 bg-white')}>
            <ScrollView showsVerticalScrollIndicator={false} >
                <TextInputWithLabel
                    defaultValue={menuForm.name}
                    onChangeText={(value) => setMenuForm((prev) => ({...prev, name: value}))}
                    label="Menu Name"
                    labelTestId=""
                    placeholder='Moi Moi'
                    name='name'
                />
                <TextInputWithLabel
                    defaultValue={menuForm.desc}
                    onChangeText={(value) => setMenuForm((prev) => ({...prev, desc: value}))}
                    label="Menu Description"
                    labelTestId=""
                    multiline
                    numberOfLines={4}
                    style={{
                        height: 150
                    }}
                    placeholder='Jollof rice cooked to absolute perfection...'
                    name='name'
                />

                <View style={tailwind('flex flex-row items-center justify-between w-full mt-5')}>
                    <TextInputWithLabel
                        defaultValue={menuForm.price}
                        onChangeText={(value) => setMenuForm((prev) => ({...prev, price: value}))}
                        keyboardType='number-pad'
                        label='Price'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        collapsable
                        placeholder="1200"
                        name='price'
                    />
                    <TextInputWithLabel
                        defaultValue={menuForm.serving}
                        onChangeText={(value) => setMenuForm((prev) => ({...prev, serving: value}))}
                        label='Serving/Price type'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        placeholder='per bowl'
                        name='serving'
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
                        trackColor={{false: '#767577', true: getColor('primary-100')}}
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
                        trackColor={{false: '#767577', true: getColor('primary-100')}}
                        thumbColor={menuForm.isAvailable ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(value) => handleSetOption('isAvailable', value)}
                        value={menuForm.isAvailable}
                    />
                </View>

                {hasEdit   && (
                    <GenericButton loading={loadingUpdate} onPress={() => handleUpdate()}  label='Update Menu' backgroundColor={tailwind('bg-primary-700')} labelColor={tailwind('text-white')} testId="" style={tailwind('w-full mt-10')} />

                )}
                    <View style={tailwind(' flex flex-col w-full  py-3 px-4 my-10')}>
                        <Text style={tailwind('text-red-500 text-xs font-medium mb-4')}>
                            This Listing will be deleted and can not be undone. Pending orders will still show the listing and must be delivered to the customer
                        </Text>
                        <GenericButton
                            loading={loading}
                            onPress={() => handleDeleteListing()}
                            label='Delete Menu'

                            labelColor={tailwind('text-white')}
                            testId=""
                        />
                    </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
