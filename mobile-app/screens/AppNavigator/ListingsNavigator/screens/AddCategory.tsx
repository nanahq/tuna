
import { Pressable, ScrollView, Switch, Text, View} from "react-native";
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
import {ControlledTextInputWithLabel} from "@components/commons/inputs/ControlledTextInput";
import { ListingMenuI} from "@nanahq/sticky";
import {IconButton} from "@components/commons/buttons/IconButton";
import {useAppDispatch, useAppSelector} from "@store/index";
import {addOrUpdateCategory} from "@store/listings.reducer";
import Toast from "react-native-toast-message";
import { showTost } from "@components/commons/Toast";
import { useToast } from "react-native-toast-notifications";
import {TouchableOpacity} from "react-native-gesture-handler";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";

type AddCategoryNavProps = StackScreenProps<ListingsParams, "AddCategory">
enum TagSelection {
    'SELECT'= 'SELECT',
    'UNSELECT' = 'UNSELECT'
}

const operations = [
    {
        label: 'Pre order',
        value: 'PRE_ORDER'
    },
    {
        label: 'On demand',
        value: 'ON_DEMAND'
    }
]
export const CAT_TAGS = [
    'Burgers',
    'Ice Cream',
    'Chicken',
    'Snacks',
    'Shawarma',
    'Rice',
    'Drinks',
    'Sandwich',
    'Bulk orders',
    'Desserts',
    'Arabic',
    'American',
    'Nigerian'
]


export function AddCategory ({route, navigation}: AddCategoryNavProps): JSX.Element {
    const {profile} = useAppSelector(state => state.profile)

    const [isLive, setIsLive] = useState<boolean>(false)
    const [isNextDayDelivery, setIsNextDayDelivery] = useState<boolean>(false)
    const [operationType,setType ] = useState<string | undefined>(undefined);
    const [tags, setTags] = useState<string[]>([])
    const dispatch = useAppDispatch()
    const toast = useToast()

    const [menu, setMenu] = useState<ListingMenuI[]>([])
    const [name, setName] = useState<string>('')
    const [loading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        if (route?.params?.category !== undefined) {
         setName( route?.params?.category.name)
        setMenu(route?.params?.category.listingsMenu)
         setIsLive(route?.params?.category?.isLive)
         setIsNextDayDelivery(route?.params?.category?.nextDayDelivery)
        setTags(route?.params?.category.tags)
            //@ts-ignore
            setType(route?.params?.category?.type)
        }
    }, [])


    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />
        })
    }, [])


    const toggleSwitchNextDelivery = () => setIsNextDayDelivery(prev => !prev)
    const toggleSwitch = (): void => {
        setIsLive((prev) => !prev)
    }

    const handleSelectOperationType = (value: string, type: 'SELECT' | 'UNSELECT'): void => {
        if (type === 'UNSELECT') {
            setType('')
        } else {
            setType(value)
        }
    }

    function selectTags (tag: string, action: TagSelection): void  {
        switch (action) {
            case TagSelection.SELECT:
                if(tags.length === 3) {
                    showTost(toast, 'Can not select more than 3 tags', 'warning')
                    break;
                }
                setTags((prevState) => [...prevState, tag])
                break;
            case TagSelection.UNSELECT:
                setTags(tags.filter(_tag => tag !== _tag))
                break;
        }

    }

    function deleteMenu (menu: ListingMenuI): void {
        setMenu((prev) => prev.filter(m => m._id !== menu._id))
    }

   async function onSubmit () {
        let type: string = 'CREATE'
        let payload;
        if (route?.params?.category !== undefined) {
            type = 'UPDATE'
            payload = {
                name,
                isLive,
                tags,
                nextDayDelivery: isNextDayDelivery,
                listingsMenu: menu.map((m) => m._id),
                catId: route?.params?.category._id
            }
        } else {
            payload = {
                name,
                isLive,
                tags,
                nextDayDelivery: isNextDayDelivery,
                type: operationType ?? profile?.settings?.operations?.deliveryType
            }
        }

       setIsLoading(true)
       try {
           const res =  await dispatch(addOrUpdateCategory({payload, type})).unwrap()

           if (res.status === 1) {
               showTost(toast, 'Category added!', 'success')
               setTimeout(() => {
                   void navigation.goBack()
               }, 500)
           }
       } catch (error: any) {
          showTost(toast, typeof error.message !== 'string' ? error.message[0] : error.message, 'error')
       } finally {
           setIsLoading(false)
       }

    }


    function checkDirty (): boolean {
        const category = route?.params?.category
        if (category === undefined) {
return true
}
        if (name !== category.name) {
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

        // @ts-ignore
        if(operations !== category?.type) {
            return true
        }
        return false
    }
    return (
        <ScrollView style={tailwind('flex-1 bg-white px-5')}>
            <View style={tailwind('flex flex-col mt-5')}>
                <TextInputWithLabel
                    defaultValue={name}
                    onChangeText={value => setName(value)}
                    label="Category Name"
                    labelTestId="AddCategory.Name"
                    moreInfo='Eg African Cuisine, Lunch - Must not be less than 5 characters'
                />

                <View style={tailwind('flex flex-row items-center mt-5')}>
                   <View style={tailwind('flex flex-col w-1/2')}>
                       <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Live</Text>
                       <Text style={tailwind('text-brand-gray-700 text-xs')}>Customer will be able to see all menu associated with this category</Text>
                   </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-100')}}
                        thumbColor={isLive ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isLive}
                    />
                </View>
                <View style={tailwind('flex flex-row items-center mt-5')}>
                    <View style={tailwind('flex flex-col w-1/2')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Next day delivery</Text>
                        <Text style={tailwind('text-brand-gray-700 text-xs')}>Customers will have to place order 24 hours ahead of time. Applicable to bulk order etc</Text>
                    </View>
                    <Switch
                        trackColor={{false: '#767577', true: getColor('primary-100')}}
                        thumbColor={isNextDayDelivery ? getColor('brand-gray-500') : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchNextDelivery}
                        value={isNextDayDelivery}
                    />
                </View>
                <View style={tailwind('flex flex-row items-center w-full mt-5')}>
                    {  profile?.settings?.operations?.deliveryType === 'PRE_AND_INSTANT' && operations?.map(type => {
                        return (
                            <TouchableOpacity key={type.value} style={tailwind('w-28  flex flex-row items-center justify-center border-brand-gray-400 rounded-sm  border-0.5 py-2 px-1 mr-1 relative', {
                                'border-primary-100': type.value === operationType
                            })} onPress={() => handleSelectOperationType(type.value, type.value === operationType ? 'UNSELECT': 'SELECT')}>
                                <Text >{type.label}</Text>
                                <View
                                    style={tailwind('rounded-full w-2 h-2 absolute bottom-1 right-1', {
                                        'bg-primary-100': type.value === operationType,
                                        'border-0.5 border-brand-gray-400': type.value !== operationType
                                    })}
                                />
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View>
                    <TextWithMoreInfo
                        containerStyle={tailwind('mt-5')}
                        text="Tags"
                        moreInfo='Add tags relevant to menus in this category.This will help your business appear on customer searches. choose up to 3'
                     />
                    <View style={tailwind('border-0.5 border-dashed border-brand-gray-700 py-4 px-3 flex flex-row items-center flex-wrap')}>
                        {CAT_TAGS.map(tag => (
                            <Tag onPress={selectTags} label={tag} key={tag} selected={tags.indexOf(tag) !== -1}  />
                        ))}
                    </View>
                </View>

                {checkDirty()  && menu.length <= 0 && (
                    <GenericButton loading={loading} onPress={onSubmit} label={route?.params?.category !== undefined ? 'Update category' : 'Add category'} backgroundColor={tailwind('bg-brand-black-500')} labelColor={tailwind('text-white')} style={tailwind('my-5')} testId="" />
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
                    <GenericButton loading={loading} onPress={onSubmit} label={route?.params?.category !== undefined ? 'Update category' : 'Add category'} backgroundColor={tailwind('bg-brand-black-500')} labelColor={tailwind('text-white')} style={tailwind('my-5')} testId="" />
                )}
            </View>

        </ScrollView>
    )
}

export function Tag (props: {label: string, onPress: (tag: string, action: TagSelection) => void, selected: boolean}): JSX.Element {
    return (
        <Pressable
            onPress={() => props.onPress(props.label, props.selected ? TagSelection.UNSELECT : TagSelection.SELECT)}
            style={tailwind('rounded-lg p-2 flex flex-row items-center border-0.5 border-brand-black-500 mr-2 my-1', {
            'border-primary-100 bg-primary-100 text-white': props.selected
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
