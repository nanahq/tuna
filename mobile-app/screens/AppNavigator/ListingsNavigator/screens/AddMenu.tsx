import {KeyboardAvoidingView, Pressable, ScrollView, Switch, Text, View} from 'react-native'
import {useRef, useState} from "react";

import {getColor, tailwind} from '@tailwind'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {NavigationProp, useNavigation} from "@react-navigation/native";

import {AddBankModal as Modal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import {IconComponent} from "@components/commons/IconComponent";

import {TextWithMoreInfo} from "@components/Text/TextWithMoreInfo";
import {GenericButton} from "@components/commons/buttons/GenericButton";

import {
    ListingsPhotosUploadButton
} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsPhotosUploadButton";
import * as ImagePicker from "expo-image-picker";
import {useForm} from "react-hook-form";
import {ListingCategoryI, ListingMenuI, ListingOptionGroupI} from "@imagyne/eatlater-types";
import {ControlledTextInputWithLabel} from "@components/commons/inputs/ControlledTextInput";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {addMenu, fetchMenus} from "@store/listings.reducer";
import * as Device from "expo-device";
import Toast from "react-native-toast-message";
import {_api} from "@api/_request";


export const CATEGORY_PICKER_MODAL = 'CAT_MENU_MODAL'

const MAX_SELECTION_LIMIT = 1

interface MenuFormInterface {
    photo: ImagePicker.ImagePickerAsset | any
    isLive: boolean
     isAvailable: boolean
    categoryId: string
}
export function AddMenu (): JSX.Element {
    const navigation = useNavigation()
    const bottomSheetModalRef = useRef<any>(null)
    const { dismiss } = useBottomSheetModal()

    const {listingsCategory} = useAppSelector((state: RootState) => state.listings)
    const dispatch = useAppDispatch()

    const {handleSubmit, formState: {errors}, control} = useForm<Partial<ListingMenuI>>()

    const [menuForm, setMenuForm] = useState<MenuFormInterface>({
        photo: null,
        isLive: true,
        isAvailable: true,
        categoryId: ''
    })

    const [category, setCategory] = useState<{name: string, id: string}>({
        name: 'Select Category',
        id: ''
    })
    const [options, setOptions] = useState<ListingOptionGroupI[]>([])

    const [loading, setLoading] = useState<boolean>(false)

    function updateForm (value: string, key: keyof Omit<MenuFormInterface, 'photo'>): void {
        setMenuForm((prevState) => ({...prevState, [key]: value}))
    }

    const openModal = (): void =>  bottomSheetModalRef.current?.present();

    function onSelectCategory (value: string): void {
        dismiss(CATEGORY_PICKER_MODAL)
        updateForm(value, 'categoryId')
    }

    function inModalAddCat (): void {
        dismiss(CATEGORY_PICKER_MODAL)
        navigation.navigate("AddCategory" as unknown as never)

    }

    async function pickImage(): Promise<void> {
        // No permissions request is necessary for launching the image library
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


    async function onSubmitCb (data: any ): Promise<void>  {
        const extension = menuForm.photo.fileName.split('.')[1]
        const imagePayload = {
            uri: Device.osName === 'Andriod' ? menuForm.photo.uri : menuForm.photo.uri.replace('file://', ''),
            name: `${menuForm.photo.assetId}.${extension}`,
            type: `image/${extension}`
        } as any

        const payload = new FormData()
        payload.append('name', data.name)
        payload.append('price', data.price)
        payload.append('desc', data.desc)
        payload.append('serving', data.serving)

        payload.append('isLive', `${menuForm.isLive}`)
        payload.append('isAvailable', `${menuForm.isAvailable}`)
        payload.append('categoryId', category.id)
        payload.append('optionGroups', '63f93c3a248f6c43d0b764f7')

        payload.append('listingImage', imagePayload )
      try {
          setLoading(true)
         const res = (await _api.requestData({
              method: 'post',
              url: 'listing/menu',
              headers:{
                  'Content-Type': 'multipart/form-data',
                  'Access-Control-Allow-Origin': '*'
              },
              data: payload
          })).data
          await dispatch(fetchMenus())
          if (res.status === 1) {
              Toast.show({
                  type: 'success',
                  text1: 'Menu created!',
                  autoHide: true,
              })

              setTimeout(() => {
                  void navigation.goBack()
              }, 3000)
          }
      } catch (error: any){
          Toast.show({
              type: 'error',
              text1: error.message !== 'string' ? error.message[0] : error.message,
              autoHide: true,
          })
      } finally {
          setLoading(false)
      }
    }

    return (
        <KeyboardAvoidingView style={tailwind('px-5 bg-white')}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBackButton onPress={() => navigation.goBack()} />
                <ControlledTextInputWithLabel
                    name='name'
                    control={control}
                    label="Menu Name"
                    labelTestId=""
                    placeholder='Jollof rice'
                    rules={{required: {
                            value: true,
                            message: "Required"
                        }}}
                    error={errors.name !== undefined}
                    errorMessage={errors.name?.message}
                />
                <ControlledTextInputWithLabel
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
                    rules={{required: {
                            value: true,
                            message: "Required"
                        }}}
                    error={errors.desc !== undefined}
                    errorMessage={errors.desc?.message}
                />

                <View style={tailwind('flex flex-row items-center justify-between w-full mt-5')}>
                    <ControlledTextInputWithLabel
                        keyboardType='number-pad'
                        label='Price'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        collapsable
                        placeholder="1200"
                        name='price'
                        control={control}
                        rules={{required: {
                                value: true,
                                message: "Required"
                            }}}
                        error={errors.price !== undefined}
                        errorMessage={errors.price?.message}
                    />
                    <ControlledTextInputWithLabel
                        label='Serving/Price type'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        placeholder='per bowl'
                        name='serving'
                        control={control}
                        rules={{required: {
                                value: true,
                                message: "Required"
                            }}}
                        error={errors.serving !== undefined}
                        errorMessage={errors.serving?.message}
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
                    <SelectHeader navigation={navigation} />
                    <Pressable  onPress={openModal} style={tailwind(' mt-3 flex flex-row w-full justify-between items-center bg-brand-blue-200 p-2 rounded-sm')}>
                        <Text style={tailwind('text-brand-black-500 font-medium')}>{category.name}</Text>
                        <IconComponent iconType='Feather' name='chevron-down' style={tailwind('text-brand-black-500')} size={14} />
                    </Pressable>
                    <Modal enablePanDownToClose promptModalName={CATEGORY_PICKER_MODAL} modalRef={bottomSheetModalRef}>
                        {listingsCategory.length <= 0 ? (
                            <View style={tailwind('flex flex-col items-center justify-center flex-1 w-full')}>
                                <View style={tailwind('flex flex-col items-center justify-center')}>
                                    <IconComponent iconType='Feather' name='alert-circle' size={30} style={tailwind('text-yellow-600')} />
                                    <Text style={tailwind('text-brand-gray-800 text-lg')}>You don't have any category saved</Text>
                                    <Pressable onPress={inModalAddCat} style={tailwind('flex mt-4 flex-row items-center')}>
                                        <Text style={tailwind('font-semibold text-xs text-brand-black-500')}>Add new category</Text>
                                        <IconComponent iconType='Feather' name='plus-circle' style={tailwind('text-brand-black-500 ml-1')} />
                                    </Pressable>
                                </View>
                            </View>
                        ): (
                            <ScrollView style={tailwind('flex flex-1 w-full')}>
                                {listingsCategory.map((cat) => (
                                    <CategoryItem cat={cat} key={cat._id} onPress={() => handleCategorySelection(cat)} />
                                ))}
                            </ScrollView>
                        )}

                    </Modal>
                </View>
                {/* <View style={tailwind('flex flex-col mt-10')}> */}
                {/*     <TextWithMoreInfo */}
                {/*         moreInfo="Add option(s) to menu to allow your customers to customize their order. For example, Main Protein or Sauce type. This is entirly optional" */}
                {/*         text="Menu options" */}
                {/*     /> */}
                {/*     <OptionHeader navigation={navigation} /> */}
                {/*     <Pressable  onPress={openModal} style={tailwind(' mt-3 flex flex-row w-full justify-between items-center bg-brand-blue-200 p-2 rounded-sm')}> */}
                {/*         <Text style={tailwind('text-brand-black-500 font-medium')}>{menuForm.categoryId}</Text> */}
                {/*         <IconComponent iconType='Feather' name='chevron-down' style={tailwind('text-brand-black-500')} size={14} /> */}
                {/*     </Pressable> */}
                {/* </View> */}
                <View style={tailwind('flex flex-row items-center mt-10')}>
                    <View style={tailwind('flex flex-col w-1/2')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Live</Text>
                        <Text style={tailwind('text-brand-gray-700 text-xs')}>Customer will be able to see this menu</Text>
                    </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-500')}}
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
                        trackColor={{false: '#767577', true: getColor('primary-500')}}
                        thumbColor={menuForm.isAvailable ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setMenuForm(prevState => ({...prevState, 'isAvailable': !prevState.isAvailable}))}
                        value={menuForm.isAvailable}
                    />
                </View>
                <GenericButton loading={loading} onPress={handleSubmit(onSubmitCb)} label='Add Menu' backgroundColor={tailwind({'bg-secondary-700': !loading, 'bg-brand-gray-700': loading})} labelColor={tailwind('text-white')} testId="" style={tailwind('w-full my-20')} />
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
                <Text style={tailwind('text-brand-black-500  font-semibold')}>{cat.name}</Text>
                <View style={tailwind('flex flex-row items-center')}>
                    <Text style={tailwind('text-brand-black-500  font-semibold')}>status</Text>
                    <View
                        style={tailwind('h-3 w-3 rounded-full ml-1', {
                            'bg-primary-500': cat.isLive,
                            'bg-brand-gray-700': !cat.isLive
                        })}
                    />
                </View>
            </View>
        </Pressable>
    )
}