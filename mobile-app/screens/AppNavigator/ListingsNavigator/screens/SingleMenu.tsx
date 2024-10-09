import {Dimensions, KeyboardAvoidingView, ScrollView, Switch, Text, View} from 'react-native'
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
import {TouchableOpacity} from "react-native-gesture-handler";
import {showTost} from "@components/commons/Toast";
import {useToast} from "react-native-toast-notifications";

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
    const height = Dimensions.get('screen').height
    const toast = useToast()
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
    const [optionString, setOptionString] = useState([])
    // state
    const {listingsOptionGroup} = useAppSelector((state: RootState) => state.listings)

    function handleOptionSelection (optionId: string, type: 'SELECT'| 'UNSELECT'): void {
        switch (type) {
            case 'SELECT':
                setOptionString((prev: any) => ([...prev, optionId]))
                break;
            case 'UNSELECT':
                setOptionString(optionString.filter((prevId) => prevId !== optionId))
                break;
            default:
                break;
        }
    }


    useEffect(() => {
        if (route?.params?.menu !== undefined) {
            const menu = route.params.menu as ListingMenuI
            setImage(menu.photo)
            setOptions(listingsOptionGroup.filter(group => !(group._id in menu.optionGroups)))
            setOptionString(menu.optionGroups.map(op => op._id))
        }

        navigation.setOptions({
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
            headerTitle: route.params?.menu.name ?? 'Menu'
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
                data: {...menuForm, menuId: route?.params?.menu._id, optionGroups: optionString}
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
            showTost(toast, 'Menu Updated', 'success')
        } catch (error: any) {
            showTost(toast, 'Failed to update menu', 'error')
        } finally {
            setUpadateLoading(false)
        }
    }

    useEffect(() => {
        const menu = route?.params?.menu as ListingMenuI
        if(menu !== undefined) {
            if(menu.isLive !== menuForm.isLive || menu.isAvailable !== menuForm.isAvailable ||menu.price !== menuForm.price || menu.desc !== menuForm.desc || menu.name !== menuForm.name || menuForm.serving !== menu.serving) {
                setHasEdit(true)
            } else if(optionString.length !== menu.optionGroups.length) {
                setHasEdit(true)
            } else {
                setHasEdit(false)

            }
        }

    }, [menuForm.serving, menuForm.price, menuForm.name, menuForm.desc, optionString.length])

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
                <View style={tailwind('flex flex-col mt-10')}>
                    <Text style={tailwind('font-medium text-brand-black-500 my-3')}>Menu Options</Text>
                    <ScrollView style={[tailwind(' pb-3 pt-2'), {
                        height: listingsOptionGroup.length < 3 ?  listingsOptionGroup.length * 70 : height/2
                    }] }>
                        {listingsOptionGroup.length > 0 &&  listingsOptionGroup.map((option: any) => {
                            const isSelected = optionString.some((_option) => option._id === _option)
                            return  (
                                <TouchableOpacity key={option._id} onPress={() => handleOptionSelection(option._id,  isSelected ? 'UNSELECT': 'SELECT')} style={tailwind('flex flex-row px-2 w-full items-center justify-between border-0.5 mb-2 border-brand-black-500 py-3 ')}>
                                    <Text style={tailwind('text-brand-black-500 text-sm font-medium')}>{option.name}</Text>
                                    <View
                                        style={tailwind('w-4 h-4  border-0.5 border-brand-black-500', {
                                            'bg-primary-100 border-0':  isSelected
                                        })}
                                    />
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
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
