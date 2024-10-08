import {Dimensions, KeyboardAvoidingView, Pressable, ScrollView, Switch, Text, View} from 'react-native'
import {useEffect, useRef, useState} from "react";

import {getColor, tailwind} from '@tailwind'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {NavigationProp, useNavigation} from "@react-navigation/native";

import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import {IconComponent} from "@components/commons/IconComponent";

import {TextWithMoreInfo} from "@components/Text/TextWithMoreInfo";
import {GenericButton} from "@components/commons/buttons/GenericButton";

import {
    ListingsPhotosUploadButton
} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsPhotosUploadButton";
import * as ImagePicker from "expo-image-picker";
import {useForm} from "react-hook-form";
import {ListingCategoryI, ListingMenuI} from "@nanahq/sticky";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import { fetchMenus} from "@store/listings.reducer";
import  mime from 'mime'
import {_api} from "@api/_request";

import uuid from 'react-native-uuid'
import {  showTost } from '@components/commons/Toast';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useToast } from 'react-native-toast-notifications';
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import * as Device from "expo-device";
import * as FileSystem from "expo-file-system";
import {CategoryPickerModal} from "@screens/AppNavigator/ListingsNavigator/screens/components/CategoryPickerModal";
import {StackNavigationProp, StackScreenProps} from "@react-navigation/stack";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {ListingsScreenName} from "@screens/AppNavigator/ListingsNavigator/ListingsScreenName.enum";

export const CATEGORY_PICKER_MODAL = 'CAT_MENU_MODAL'


const MAX_SELECTION_LIMIT = 1

interface MenuFormInterface {
    photo: ImagePicker.ImagePickerAsset | any
    isLive: boolean
     isAvailable: boolean
    name: string

    desc: string

    price: string

    serving: string
}

type AddMenuNavigationProps = StackScreenProps<ListingsParams, ListingsScreenName.ADD_LISTING>
export const AddMenu: React.FC<AddMenuNavigationProps>  = ({navigation}) => {
   const height = Dimensions.get('screen').height
    const bottomSheetModalRef = useRef<any>()
    const { dismiss } = useBottomSheetModal()

    const {listingsCategory, listingsOptionGroup} = useAppSelector((state: RootState) => state.listings)
    const dispatch = useAppDispatch()

    const toast = useToast()

    const {handleSubmit, formState: {errors}, control} = useForm<Partial<ListingMenuI>>()

    const [menuForm, setMenuForm] = useState<MenuFormInterface>({
        photo: null,
        isLive: true,
        isAvailable: true,
        serving: '',
        name: '',
        desc: '',
        price: ''
    })

    const [category, setCategory] = useState<{name: string, id: string}>({
        name: 'Choose Menu Category',
        id: ''
    })
    const [optionsString, setOptionString] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const openModal = (): void =>  bottomSheetModalRef.current?.present();

    function inModalAddCat (): void {
        dismiss(CATEGORY_PICKER_MODAL)
        navigation.navigate("AddCategory" as unknown as never)

    }


    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />
        })
    }, [])

    async function pickImage(): Promise<void> {
        await ImagePicker.requestMediaLibraryPermissionsAsync()
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: MAX_SELECTION_LIMIT,
        });


        if (!result.canceled) {
            setMenuForm((prevState) => ({...prevState, 'photo': result?.assets[0]}));
        }
    }


    function handleCategorySelection (cat: ListingCategoryI): void {
        setCategory({
            name: cat.name,
            id: cat._id
        })
        dismiss(CATEGORY_PICKER_MODAL)
    }

    function handleOptionSelection (optionId: string, type: 'SELECT'| 'UNSELECT'): void {
        switch (type) {
            case 'SELECT':
                setOptionString((prev: any) => ([...prev, optionId]))
                break;
            case 'UNSELECT':
                setOptionString(optionsString.filter((prevId) => prevId !== optionId))
                break;
            default:
                break;
        }
    }

    async function onSubmitCb (): Promise<void>  {
        if(Object.values(menuForm).some(v => v === '' || v === false || v === null)) {
            showTost(toast, 'Please fill in the form', 'warning')
            return
        }

        if(category.id === '') {
            showTost(toast, 'Please select a category', 'warning')
            return
        }
        let uri = ''
        if (Device.osName === 'Android') {
            const path = await FileSystem.getInfoAsync(menuForm.photo.uri)
            uri = path.uri
        } else {
            uri = menuForm.photo?.uri.replace('file://', '')
        }

        const type = mime.getType(uri)

        const imagePayload = {
            uri,
            type,
            name: `${uuid.v4()}.${type}`,
        } as any

        const payload = new FormData()
        payload.append('name',`${menuForm.name.trim()}`)
        payload.append('price',` ${menuForm.price}`)
        payload.append('desc', `${menuForm.desc.trim()}`)
        payload.append('serving', `${menuForm.serving}`)

        payload.append('isLive', `${menuForm.isLive}`)
        payload.append('isAvailable', `${menuForm.isAvailable}`)
        payload.append('categoryId', category.id)

        if(optionsString.length > 0) {
            payload.append('optionGroups', optionsString.join(',') )
        }
        payload.append('image', imagePayload )

        try {
          setLoading(true)
         const res = (await _api.requestData({
              method: 'post',
              url: 'listing/menu',
              headers:{
                  'Content-Type': 'multipart/form-data',
                  'Access-Control-Allow-Origin': '*'
              },
             transformRequest: (data: any) => {
                 return data
             },
              data: payload
          })).data
          await dispatch(fetchMenus())
          if (res.status === 1) {
            showTost(toast, 'Menu created!', 'success')
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
        <KeyboardAvoidingView style={tailwind('p-5  flex-1 bg-white')}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TextInputWithLabel
                    label="Menu Name"
                    labelTestId=""
                    placeholder='Jollof rice'
                    error={errors.name !== undefined}
                    errorMessage={'Menu name is required'}
                    defaultValue={menuForm.name}
                    onChangeText={value => setMenuForm((prev) => ({...prev, name: value}))}
                />
                <TextInputWithLabel
                    defaultValue={menuForm.desc}
                    onChangeText={value => setMenuForm((prev) => ({...prev, desc: value}))}
                    containerStyle={tailwind('mt-5')}
                    label="Menu Description"
                    labelTestId=""
                    placeholder='Jollof rice cooked to absolute perfection...'

                    textAlignVertical="top"
                    multiline
                    numberOfLines={4}
                    style={{
                        height: 150,
                        paddingVertical: 20
                    }}
                    error={errors.desc !== undefined}
                    errorMessage={errors.desc?.message as any}
                />

                <View style={tailwind('flex flex-row items-center justify-between w-full mt-5')}>
                    <TextInputWithLabel
                        defaultValue={menuForm.price}
                        onChangeText={value => setMenuForm((prev) => ({...prev, price: value}))}
                        keyboardType='number-pad'
                        label='Price'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        collapsable
                        placeholder="1200"
                        error={errors.price !== undefined}
                        errorMessage={errors.price?.message as any}
                    />
                    <TextInputWithLabel
                        defaultValue={menuForm.serving}
                        onChangeText={value => setMenuForm((prev) => ({...prev, serving: value}))}
                        label='Serving/Price type'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        placeholder='per bowl'
                        error={errors.serving !== undefined}
                        errorMessage={errors.serving?.message as any}
                    />
                </View>
                <View style={tailwind('my-10 border-brand-gray-700 border-0.5 border-dashed px-3 py-5 rounded')}>
                    <TextWithMoreInfo
                        moreInfo="Amazing photos sells more!"
                        text="Add a photo of the menu"
                        containerStyle={tailwind('mb-4')}
                    />
                    {menuForm.photo !== null && <Text style={tailwind('text-primary-700 text-sm mb-2')}>Image uploaded successfully</Text>}
                    <ListingsPhotosUploadButton onPress={pickImage} disabled={false}  />
                </View>
                <View>

                    <Pressable  onPress={openModal} style={tailwind(' mt-3 flex flex-row w-full justify-between items-center bg-brand-blue-200 p-2 rounded-sm')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-lg')}>{category.name}</Text>
                        <IconComponent iconType='Feather' name='chevron-down' style={tailwind('text-brand-black-500')} size={14} />
                    </Pressable>
                    <CategoryPickerModal navigation={navigation} listSize={listingsCategory.length}   enablePanDownToClose  promptModalName={CATEGORY_PICKER_MODAL} modalRef={bottomSheetModalRef}>
                        <ScrollView style={tailwind('flex flex-1 w-full')}>
                            {listingsCategory.map((cat, index) => (
                                <CategoryItem cat={cat} key={cat?._id ?? index} onPress={() => handleCategorySelection(cat)} />
                            ))}
                        </ScrollView>
                    </CategoryPickerModal>
                </View>
                <View style={tailwind('flex flex-col mt-10')}>
                    <TextWithMoreInfo
                        moreInfo="Add option(s) to menu to allow your customers to customize their order. For example, Main Protein or Sauce type. This is entirly optional"
                        text="Menu options"
                    />
                    <OptionHeader navigation={navigation} />
                    <View style={tailwind('border-0.5 border-brand-black-500 flex w-full mt-3')}>
        <View style={tailwind('flex flex-row  w-full justify-between items-center bg-white border-b-0.5 border-brand-black-500')}>
            <TextInput
                // value={searchQuery}
                // onChangeText={(value) => setSearchQuery(value)}
                style={tailwind('py-3 px-3')}
                placeholder='search option group'
                placeholderTextColor={getColor('brand-gray-700')}
            />
            <IconComponent iconType='Feather' name='search' size={16} style={tailwind('text-brand-gray-700 mr-2')} />
        </View>
            <ScrollView style={[tailwind('px-3 pb-3 pt-2'), {
            height: height/4
            }] }>
            {listingsOptionGroup.length > 0 &&  listingsOptionGroup.map((option: any) => {
                const isSelected = optionsString.some((_option) => option._id === _option)
                return  (
                    <TouchableOpacity key={option._id} onPress={() => handleOptionSelection(option._id,  isSelected ? 'UNSELECT': 'SELECT')} style={tailwind('flex flex-row px-2 w-full items-center justify-between border-0.5 mb-2 border-brand-black-500 py-3 ')}>
                    <Text style={tailwind('text-brand-black-500 text-sm font-medium')}>{option.name}</Text>
                    <View
                        style={tailwind('w-3 h-3 border-0.5 border-brand-black-500', {
                            'bg-brand-black-500':  isSelected
                        })}
                    />
                </TouchableOpacity>
                )
            })}
            </ScrollView>

        </View>
                 </View>
                <View style={tailwind('flex flex-row items-center mt-10')}>
                    <View style={tailwind('flex flex-col w-1/2')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Live</Text>
                        <Text style={tailwind('text-brand-gray-700 text-xs')}>Customer will be able to see this menu</Text>
                    </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-100')}}
                        thumbColor={menuForm.isLive ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setMenuForm(prevState => ({...prevState, 'isLive': !prevState.isLive}))}
                        value={menuForm.isLive}
                    />
                </View>
                <View style={tailwind('flex flex-row items-center mt-5')}>
                    <View style={tailwind('flex flex-col w-1/2')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Available</Text>
                        <Text style={tailwind('text-brand-gray-700 text-xs')}>This menu is available to customers to place orders</Text>
                    </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-100')}}
                        thumbColor={menuForm.isAvailable ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setMenuForm(prevState => ({...prevState, 'isAvailable': !prevState.isAvailable}))}
                        value={menuForm.isAvailable}
                    />
                </View>
                <GenericButton loading={loading} disabled={category.id === ''} onPress={onSubmitCb} label='Add Menu' backgroundColor={tailwind({'bg-brand-black-500': !loading, 'bg-brand-gray-700': loading})} labelColor={tailwind('text-white')} testId="" style={tailwind('w-full my-20')} />
            </ScrollView>
        </KeyboardAvoidingView>
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
        <Pressable onPress={onPress} style={tailwind('flex flex-col items-center w-full mb-3  py-4 px-2 border-b-0.5 border-gray-200')}>
            <View style={tailwind('flex w-full flex-row items-center justify-between')}>
                <Text style={tailwind('text-brand-black-500 text-lg uppercase font-medium')}>{cat.name}</Text>
            </View>
        </Pressable>
    )
}
