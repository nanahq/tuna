import {Dimensions, Pressable, ScrollView, Switch, Text, View} from "react-native";
import {getColor, tailwind} from '@tailwind'
import {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {EmptyMenu} from "@components/Empty/Listings";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {IconComponent} from "@components/commons/IconComponent";
import {TextWithMoreInfo} from "@components/Text/TextWithMoreInfo";
import {useForm} from "react-hook-form";
import {CreateListingCategoryDto} from "@imagyne/eatlater-types/dist/dto/listing.dto";
import {ControlledTextInputWithLabel} from "@components/commons/inputs/ControlledTextInput";
import { ListingMenuI} from "@imagyne/eatlater-types";
import {IconButton} from "@components/commons/buttons/IconButton";
import {useAppDispatch} from "@store/index";
import {addOrUpdateCategory, fetchCategories, updateOptionGroup} from "@store/listings.reducer";
import Toast from "react-native-toast-message";

type AddCategoryNavProps = StackScreenProps<ListingsParams, "AddCategory">
enum TagSelection {
    'SELECT'= 'SELECT',
    'UNSELECT' = 'UNSELECT'
}
export const CAT_TAGS = [
    'african',
    'lunch',
    'Traditional',
    'Gluten free',
    'Halal',
    'Vegan',
    'meat',
    'italian',
]


export function AddCategory ({route, navigation}: AddCategoryNavProps): JSX.Element {
    const [isLive, setIsLive] = useState<boolean>(false)
    const [tags, setTags] = useState<string[]>([])
    const dispatch = useAppDispatch()
    const {control, setValue, handleSubmit, getValues} = useForm<CreateListingCategoryDto>()

    const [menu, setMenu] = useState<ListingMenuI[]>([])
    const [loading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        if (route?.params?.category !== undefined) {
         setValue('name', route?.params?.category.name)
        setMenu(route?.params?.category.listingsMenu)
         setIsLive(route?.params?.category.isLive)
        setTags(route?.params?.category.tags)
        }
    }, [])

    const toggleSwitch = (): void => {
        setIsLive((prev) => !prev)
    }



    function selectTags (tag: string, action: TagSelection): void  {
        switch (action) {
            case TagSelection.SELECT:
                setTags((prevState) => [...prevState, tag])
                break;
            case TagSelection.UNSELECT:
                const newTags = tags.filter(_tag => tag !== _tag)
                setTags(newTags)
                break;
        }

    }

    function deleteMenu (menu: ListingMenuI): void {
        setMenu((prev) => prev.filter(m => m._id !== menu._id))
    }

   async function onSubmit (data: CreateListingCategoryDto) {
        let type: string = 'CREATE'
        let payload;
        if (route?.params?.category !== undefined) {
            type = 'UPDATE'
            payload = {
                name: data.name,
                isLive,
                tags,
                listingsMenu: menu.map((m) => m._id),
                catId: route?.params?.category._id
            }
        } else {
            payload = {
                name: data.name,
                isLive,
                tags,
            }
        }


       setIsLoading(true)
       try {
           const res =  await dispatch(addOrUpdateCategory({payload, type})).unwrap()

           if (res.status === 1) {
               Toast.show({
                   type: 'success',
                   text1: 'Operation successful',
                   autoHide: true,
               })

               setTimeout(() => {
                   void navigation.goBack()
               }, 3000)
           }
       } catch (error: any) {
           // Toast.show({
           //     type: 'error',
           //     text1: typeof error.message !== 'string' ? error.message[0] : error.message,
           //     autoHide: true,
           // })
       } finally {
           setIsLoading(false)
       }

    }

    function checkDirty (): boolean {
        const category = route?.params?.category
        if (category === undefined) {
return true
}
        if (getValues('name') !== category.name) {
return true
}
        if (category.isLive !== isLive) {
return true
}
        if (category.tags.join() !== tags.join())  {
return true
}
        if (category.listingsMenu.length !== menu.length) {
return true
}
        return false
    }
    return (
        <ScrollView style={tailwind('h-full px-5')}>
            <GoBackButton onPress={() => navigation.goBack()}  style={tailwind('mt-5 mb-1')}/>
            <View style={tailwind('flex flex-col mt-5')}>
                <ControlledTextInputWithLabel
                    label="Category Name"
                    name="name"
                    control={control}
                    labelTestId="AddCategory.Name"
                    moreInfo='Eg African Cuisine, Lunch - Must not be less than 5 characters'
                />

                <View style={tailwind('flex flex-row items-center mt-5')}>
                   <View style={tailwind('flex flex-col w-1/2')}>
                       <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Live</Text>
                       <Text style={tailwind('text-brand-gray-700 text-xs')}>Customer will be able to see all menu associated with this category</Text>
                   </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-500')}}
                        thumbColor={isLive ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isLive}
                    />
                </View>
                <View>
                    <TextWithMoreInfo
                        containerStyle={tailwind('mt-5')}
                        text="Tags"
                        moreInfo='Add keywords relevant to menus in this category. Optional'
                     />
                    <View style={tailwind('border-0.5 border-dashed border-brand-gray-700 py-4 px-3 flex flex-row items-center flex-wrap')}>
                        {CAT_TAGS.map(tag => (
                            <Tag onPress={selectTags} label={tag} key={tag} selected={tags.indexOf(tag) !== -1}  />
                        ))}
                    </View>
                </View>

                {checkDirty()  && menu.length <= 0 && (
                    <GenericButton loading={loading} onPress={handleSubmit(onSubmit)} label={route?.params?.category !== undefined ? 'Update category' : 'Add category'} backgroundColor={tailwind('bg-primary-500')} labelColor={tailwind('text-white')} style={tailwind('my-5')} testId="" />
                )}
                {menu.length >= 1 ? (
                    <View style={tailwind('my-6 flex flex-col')}>
                        <Text style={tailwind('text-brand-black-500 text-lg font-medium mb-1')}>Menu items</Text>
                        <ScrollView style={tailwind(' border-0.5 border-brand-black-500  p-2')}>
                            {menu.map(m => (
                                <MenuItem menu={m} key={m._id} onPress={() => deleteMenu(m)} />
                            ))}
                        </ScrollView>
                    </View>
                ): (
                  <EmptyMenu title="Empty" type="CATEGORY" />
                )}
                {checkDirty() && (
                    <GenericButton loading={loading} onPress={handleSubmit(onSubmit)} label={route?.params?.category !== undefined ? 'Update category' : 'Add category'} backgroundColor={tailwind('bg-primary-500')} labelColor={tailwind('text-white')} style={tailwind('my-5')} testId="" />
                )}
            </View>

        </ScrollView>
    )
}

function Tag (props: {label: string, onPress: (tag: string, action: TagSelection) => void, selected: boolean}): JSX.Element {
    return (
        <Pressable
            onPress={() => props.onPress(props.label, props.selected ? TagSelection.UNSELECT : TagSelection.SELECT)}
            style={tailwind('rounded-lg p-2 flex flex-row items-center border-0.5 border-brand-black-500 mr-2 my-1', {
            'border-primary-500 bg-primary-500 text-white': props.selected
        })}>
            <Text style={tailwind('text-brand-black-500 font-medium text-center', {
                'text-white': props.selected
            })}>{props.label}</Text>
            {props.selected && (
                <IconComponent iconType='Feather' name='x' size={14} style={tailwind('text-white ml-2')}  />
            )}
        </Pressable>
    )
}

function MenuItem ({menu, onPress}: {menu: ListingMenuI, onPress: () => void}): JSX.Element {
    return (
        <View style={tailwind('border-brand-black-500 border-b-0.5 flex flex flex-col w-full py-2 mt-2')}>
            <View style={tailwind('flex flex-row items-center w-full justify-between ')}>
                <Text style={tailwind('font-semibold text-sm text-brand-black-500')}>{menu.name}</Text>
                <IconButton onPress={onPress} iconType='Feather' iconName='trash' style={tailwind('text-brand-gray-700')} iconSize={16} />
            </View>
        </View>
    )
}
