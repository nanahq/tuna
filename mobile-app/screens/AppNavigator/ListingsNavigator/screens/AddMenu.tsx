import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {KeyboardAvoidingView, Pressable, ScrollView, Switch, Text, View} from 'react-native'
import {useRef, useState} from "react";
import {getColor, tailwind} from '@tailwind'
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker";
import {AddBankModal as Modal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import {IconComponent} from "@components/commons/IconComponent";
import {TextWithMoreInfo} from "@components/Text/TextWithMoreInfo";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {
    ListingsPhotosUploadButton
} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsPhotosUploadButton";
import * as ImagePicker from "expo-image-picker";


export const CATEGORY_PICKER_MODAL = 'CAT_MENU_MODAL'

const MAX_SELECTION_LIMIT = 1

interface MenuFormInterface {
    menuName: string
    menuDescription: string
    menuPrice: string
    menuOptions: string[]
    menuCategory: string
    menuImage: string
    menuIsLive: boolean,
    menuIsAvailable: boolean
    menuPriceType: string
}
export function AddMenu (): JSX.Element {
    const navigation = useNavigation()
    const pickerRef = useRef<any>(null);
    const bottomSheetModalRef = useRef<any>(null)
    const { dismiss } = useBottomSheetModal()

    const [menuForm, setMenuForm] = useState<MenuFormInterface>({
        menuName: '',
        menuDescription: '',
        menuPrice: '',
        menuOptions: [],
        menuCategory: 'Select category',
        menuImage: '',
        menuIsLive: false,
        menuIsAvailable: false ,
        menuPriceType: ''
    })

    const [categories, setCategories] = useState<Record<string, string>[]>([])



    function updateForm (value: string, key: keyof Omit<MenuFormInterface, 'menuImage'>): void {
        setMenuForm((prevState) => ({...prevState, [key]: value}))
    }

    const openModal = (): void =>  bottomSheetModalRef.current?.present();

    function onSelectCategory (value: string): void {
        dismiss(CATEGORY_PICKER_MODAL)
        updateForm(value, 'menuCategory')
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
            const image = result?.assets.map(assets => assets.uri)
            setMenuForm((prevState) => ({...prevState, 'menuImage': image[0]}));
        }
    }

    return (
        <KeyboardAvoidingView style={tailwind('px-5')}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBackButton onPress={() => navigation.goBack()} />
                <TextInputWithLabel
                    value={menuForm.menuName}
                    label="Menu Name"
                    labelTestId=""
                    onChangeText={(value) => updateForm(value, 'menuName')}
                    placeholder='Moi Moi'
                />
                <TextInputWithLabel
                    containerStyle={tailwind('mt-5')}
                    label="Menu Description"
                    labelTestId=""
                    onChangeText={(value) => updateForm(value, 'menuDescription')}
                    value={menuForm.menuDescription}
                    placeholder='Jollof rice cooked to absolute perfection...'
                    textAlignVertical="top"
                    multiline={true}
                    numberOfLines={4}
                    style={{
                        height: 150
                    }}
                    />

                <View style={tailwind('flex flex-row items-center justify-between w-full mt-5')}>
                    <TextInputWithLabel
                        value={menuForm.menuPrice}
                        onChangeText={(value) =>updateForm(value, 'menuPrice')}
                        keyboardType='number-pad'
                        label='Price'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        collapsable={true}
                        placeholder="1200"
                    />
                    <TextInputWithLabel
                        value={menuForm.menuPriceType}
                        onChangeText={(value) =>updateForm(value, 'menuPriceType')}
                        label='Serving/Price type'
                        labelTestId=""
                        containerStyle={tailwind('w-5/12')}
                        placeholder='per bowl'
                    />
                </View>
                <View style={tailwind('my-10 border-brand-gray-700 border-0.5 border-dashed px-3 py-5 rounded')}>
                    <TextWithMoreInfo
                        moreInfo="Amazing photos sells more!"
                        text="Add a photo of the menu"
                        containerStyle={tailwind('mb-4')}
                    />
                    {menuForm.menuImage.length > 1 && <Text style={tailwind('text-primary-700 text-sm mb-2')}>Image uploaded successfully</Text>}
                    <ListingsPhotosUploadButton onPress={pickImage} disabled={false}  />
                </View>
                <View>
                        <SelectHeader navigation={navigation} />
                        <Pressable  onPress={openModal} style={tailwind(' mt-3 flex flex-row w-full justify-between items-center bg-brand-blue-200 p-2 rounded-sm')}>
                            <Text style={tailwind('text-brand-black-500 font-medium')}>{menuForm.menuCategory}</Text>
                            <IconComponent iconType='Feather' name='chevron-down' style={tailwind('text-brand-black-500')} size={14} />
                        </Pressable>
                    <Modal promptModalName={CATEGORY_PICKER_MODAL} modalRef={bottomSheetModalRef}>
                        {categories.length <= 0 ? (
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
                            <Picker
                            selectedValue={menuForm.menuCategory}
                            onValueChange={(value) => onSelectCategory(value) }
                            >
                        {categories.map(cat => (
                            <Picker.Item label={cat.name} value={cat.name} key={cat.id} />
                            ))}
                            </Picker>
                            )}

                    </Modal>
                </View>
                <View style={tailwind('flex flex-col mt-10')}>
                    <TextWithMoreInfo
                        moreInfo="Add option(s) to menu to allow your customers to customize their order. For example, Main Protein or Sauce type. This is entirly optional"
                        text="Menu options"
                    />
                    <OptionHeader navigation={navigation} />
                    <Pressable  onPress={openModal} style={tailwind(' mt-3 flex flex-row w-full justify-between items-center bg-brand-blue-200 p-2 rounded-sm')}>
                        <Text style={tailwind('text-brand-black-500 font-medium')}>{menuForm.menuCategory}</Text>
                        <IconComponent iconType='Feather' name='chevron-down' style={tailwind('text-brand-black-500')} size={14} />
                    </Pressable>
                </View>
                <View style={tailwind('flex flex-row items-center mt-10')}>
                    <View style={tailwind('flex flex-col w-1/2')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Live</Text>
                        <Text style={tailwind('text-brand-gray-700 text-xs')}>Customer will be able to see this menu</Text>
                    </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-500')}}
                        thumbColor={menuForm.menuIsLive ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setMenuForm(prevState => ({...prevState, 'menuIsLive': !prevState.menuIsLive}))}
                        value={menuForm.menuIsLive}
                    />
                </View>
                <View style={tailwind('flex flex-row items-center mt-5')}>
                    <View style={tailwind('flex flex-col w-1/2')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Available</Text>
                        <Text style={tailwind('text-brand-gray-700 text-xs')}>This menu is available to customers to place orders</Text>
                    </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-500')}}
                        thumbColor={menuForm.menuIsLive ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setMenuForm(prevState => ({...prevState, 'menuIsAvailable': !prevState.menuIsAvailable}))}
                        value={menuForm.menuIsAvailable}
                    />
                </View>
                <GenericButton onPress={() => {}} label='Add Menu' backgroundColor={tailwind('bg-secondary-700')} labelColor={tailwind('text-white')} testId="" style={tailwind('w-full my-20')} />
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
