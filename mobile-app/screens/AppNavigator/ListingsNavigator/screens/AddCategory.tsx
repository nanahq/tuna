import {Dimensions, Pressable, ScrollView, Switch, Text, View} from "react-native";
import {getColor, tailwind} from '@tailwind'
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {EmptyMenu} from "@components/Empty/Listings";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {IconComponent} from "@components/commons/IconComponent";
import {TextWithMoreInfo} from "@components/Text/TextWithMoreInfo";

type AddCategoryNavProps = StackScreenProps<ListingsParams, "AddCategory">
enum TagSelection {
    'SELECT'= 'SELECT',
    'UNSELECT' = 'UNSELECT'
}
export const CAT_TAGS = [
    'African',
    'Lunch',
    'Traditional',
    'Gluten free',
    'Halal',
    'Vegan',
    'meat',
    'Italian',
]

export function AddCategory ({route, navigation}: AddCategoryNavProps): JSX.Element {
    const screenHeight = Dimensions.get('screen').height
    const [isLive, setIsLive] = useState<boolean>(false)
    const [categoryName, setCategoryName] = useState<string>('')
    const [initialValue, setInitialValue] = useState<string>('')
    const [tags, setTags] = useState<string[]>([])
    //Checks if the form has been edited
    const [formIsDirty, setFormIsDirty] = useState<boolean>(false)

    const [menu, _setMenu] = useState<any[]>([])

    useEffect(() => {
        if(route?.params?.catId !== undefined) {
          void  getCategory(route?.params?.catId)
        }
    }, [])

    const toggleSwitch = (): void => {
        const hasChanged = categoryName !== initialValue
        setIsLive((prev) => !prev)

        setFormIsDirty((prev) => hasChanged ? prev : !prev )
    }

    async function getCategory (catId: string): Promise<any> {
        setInitialValue(catId)
        setCategoryName(catId)
    }


    const onFormDirty = (value: string): void =>  {
        setCategoryName(value)
        setFormIsDirty( categoryName !== initialValue)
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

    return (
        <ScrollView style={tailwind('h-full px-5')}>
            <GoBackButton onPress={() => navigation.goBack()}  style={tailwind('mt-5 mb-1')}/>
            <View style={tailwind('flex flex-col mt-5')}>
                <TextInputWithLabel
                    value={categoryName}
                    onChangeText={(value) => onFormDirty(value)}
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
                        text={'Tags'}
                        moreInfo='Add keywords relevant to menus in this category. Optional'
                     />
                    <View style={tailwind('border-0.5 border-dashed border-brand-gray-700 py-4 px-3 flex flex-row items-center flex-wrap')}>
                        {CAT_TAGS.map(tag => (
                            <Tag onPress={selectTags} label={tag} selected={tags.indexOf(tag) !== -1}  />
                        ))}
                    </View>
                </View>
                {formIsDirty &&  categoryName.length >= 5 && <GenericButton onPress={() => {}} label="Save changes" labelColor={tailwind('text-white')} style={tailwind('mt-4')} backgroundColor={tailwind('bg-secondary-700')} testId="AddCategory.Save.Button" />}
                {menu && menu.length >= 1 && (
                    <View style={tailwind('mt-6 flex flex-col')}>
                        <Text style={tailwind('text-brand-black-500 text-lg font-medium mb-1')}>Menu items</Text>
                        <ScrollView style={[tailwind(' border-0.5 border-brand-black-500 p-2'), {height: (screenHeight / 2 - 40)}]}>
                            {menu.length <= 0 && (
                                <EmptyMenu title="Empty" type="CATEGORY" />
                            )}

                        </ScrollView>
                    </View>
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
            'border-secondary-500 bg-secondary-500 text-white': props.selected
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
