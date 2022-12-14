import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {tailwind} from '@tailwind'
import {Keyboard, Text, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {IconButton} from "@components/commons/buttons/IconButton";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {DaysList} from "@typings/Days";
import {useCallback, useEffect, useState} from "react";
import {ListingDateCheckBox} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingAvailableDateRow";
import {ScrolledView} from "@components/views/ScrolledView";
import * as ImagePicker from 'expo-image-picker'
import {
    ListingsPhotosUploadButton
} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsPhotosUploadButton";
import {ImagePreviewComponent} from "@screens/AppNavigator/ListingsNavigator/screens/components/ImagePreviewComponent";
import {
    ListingsCustomizableOptions
} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsCustomizableOptions";
import {ListingsCheckBox} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingsCheckBox";
import {GenericButton} from "@components/commons/buttons/GenericButton";


type AddListingsProps = StackScreenProps<ListingsParams, "AddListing">
type ListingAvailableDay = keyof DaysList | 'EVERYDAY'
interface AddListingForm {
    listingName: string
    listingPrice: string
    listingDesc: string
}
const MAX_SELECTION_LIMIT = 6

interface ListingsAvailability {
    day: ListingAvailableDay
    checked: boolean
}
interface Options {
    optionName: string
    optionCost: string
}

interface OptionsCompleted extends Options  {
    optionType: 'CUSTOM' | 'ADDON'
}
export function AddListingsScreen ({navigation}: AddListingsProps): JSX.Element {
    const [isAddon, setIsAddon] = useState<boolean>(false)
    const [isCustom, setIsCustom] = useState<boolean>(false)


    const [form, setForm] = useState<AddListingForm>({
        listingName: '',
        listingPrice: '',
        listingDesc: '',
    })

    const [optionsForm, setOptionForm] = useState<Options>({
        optionCost: '',
        optionName: ''
    })

    const [options, setOptions] = useState<OptionsCompleted[]>([])

    const [maxSelectionReached, setMaxSelectionReached] = useState<boolean>(false)

    const [availableDays, setAvailableDays] = useState<Array<ListingsAvailability>>([
        {
            day: "EVERYDAY",
            checked: false
        },
        {
            day: "MONDAY",
            checked: false
        },
        {
            day: "TUESDAY",
            checked: false
        },
        {
            day: "WEDNESDAY",
            checked: false
        },
        {
            day: "THURSDAY",
            checked: false
        },
        {
            day: "FRIDAY",
            checked: false
        },

        {
            day: "SATURDAY",
            checked: false
        },
        {
            day: "SUNDAY",
            checked: false
        },
    ])

    const [images, setImages] = useState<string[] >([]);
    const {bottom: bottomInset} = useSafeAreaInsets()


    //Check if images selected does not exceed threshold
    useEffect(() => {
        if(images.length >= MAX_SELECTION_LIMIT) {
            setMaxSelectionReached(true)
        } else {
            setMaxSelectionReached(false)

        }
    }, [images.length])

        function checkNullState (): boolean {
            let isValidForm: boolean[] = []

            Object.keys(form).forEach((formItem) => {
                // @ts-ignore
                if (formItem in form && form[formItem].length > 1) {
                    isValidForm.push(true)
                } else {
                    isValidForm.push(false)
                }
            })

            return isValidForm.some(state => !state) || !availableDays.some( days => days.checked)
        }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: MAX_SELECTION_LIMIT,
        });


        if (!result.canceled) {
            const image = result?.assets.map(assets => assets.uri)
            setImages((prevState: string[]) => [...prevState, ...image]);
        }
    };

    const onCheckBoxChange = useCallback((day: ListingAvailableDay ): void => {
        const newDates = availableDays.map( (item) => {
            if(item.day === day) {
                item.checked = !item.checked
            }
            return item
        })
        setAvailableDays(newDates)
    }, [] )


    function goBack (): void {
        navigation.goBack()
    }

    function onChange (name: keyof AddListingForm, value: string): void {
        setForm((prevState) => ({...prevState, [name]: value}))
    }


    function onOptionChange (name: keyof Options, value: string): void {
        setOptionForm((prevState) => ({...prevState, [name]: value}))
    }

    function onRemoveImage (image: string): void {
        if(images.indexOf(image) !== -1) {
            setImages(images.filter(i => i !== image))
        }
    }

    function dismissKeyboard () {
        Keyboard.dismiss
    }


    function AddOptions (): void {
        const options = {...optionsForm, optionType: isAddon ? 'ADDON' : 'CUSTOM'} as OptionsCompleted
        setOptions(prevState => [...prevState, options])
        setOptionForm({
            optionName: '',
            optionCost: ''
        })
        setIsAddon(false)
        setIsCustom(false)
    }
    return (
        <SafeAreaView style={tailwind('flex-1 bg-white')}>
            <ScrolledView testId="AddListingsScreen" style={[tailwind('p-5')]}>
                <IconButton
                    iconName='arrow-left'
                    iconType='Feather'
                    iconSize={24}
                    iconStyle={tailwind('text-brand-black-500')}
                    style={tailwind('mb-2')}
                    onPress={goBack}
                />
                <Text style={tailwind('text-brand-black-500 text-lg mb-2 font-semibold')} >Add a new Listing</Text>
                <View style={[ {paddingBottom: bottomInset + 150}]}>
                    <TextInputWithLabel
                        label='Listing name'
                        testID='AddListingsScreen.listingName.text'
                        labelTestId="AddListingsScreen.listingName.label"
                        containerStyle={tailwind('w-full mt-5')}
                        value={form.listingName}
                        onChangeText={(value) => onChange('listingName', value)}
                        onSubmitEditing={dismissKeyboard}
                        labelStyle={tailwind('font-semibold text-brand-black-500')}
                    />
                    <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                        <TextInputWithLabel
                            keyboardType='numeric'
                            label='Price'
                            testID='AddListingsScreen.listingPrice.text'
                            labelTestId="AddListingsScreen.listingPrice.label"
                            containerStyle={tailwind('w-full mt-5')}
                            value={form.listingPrice}
                            onChangeText={(value) => onChange('listingPrice', value)}
                            style={{
                                width: 160
                            }}
                            onSubmitEditing={dismissKeyboard}
                            labelStyle={tailwind('font-semibold text-brand-black-500')}
                        />
                    </View>
                    <TextInputWithLabel
                        label='Listing Description'
                        testID='AddListingsScreen.listingDesc.text'
                        labelTestId="AddListingsScreen.listingDesc.label"
                        containerStyle={tailwind('w-full mt-5')}
                        value={form.listingName}
                        onChangeText={(value) => onChange('listingDesc', value)}
                        onSubmitEditing={dismissKeyboard}
                        labelStyle={tailwind('font-semibold text-brand-black-500')}
                    />
                    <View style={tailwind('mt-4')}>
                        <Text style={tailwind('mb-2.5 font-medium text-sm text-brand-black-500 font-semibold')}>Listings Availability</Text>
                        <View style={tailwind('flex flex-row items-center flex-wrap')}>
                            {availableDays.map(({day, checked}) => (
                                <ListingDateCheckBox  key={day} onChange={() => onCheckBoxChange(day)} date={day} checked={checked} />
                            ))}
                        </View>
                    </View>
                    <View style={tailwind('mt-4')}>
                        <Text style={tailwind(' font-medium text-sm text-brand-black-500 font-semibold')}>Listings Photos</Text>
                        <Text style={tailwind('text-xs text-brand-gray-800 mb-2')}>Amazing photos sell more</Text>
                        {images && images.length > 0 && (
                            <View style={tailwind('flex flex-row items-center flex-wrap justify-between mb-5')}>
                                {images.map((image) => (
                                    <ImagePreviewComponent key={image} onDelete={() => onRemoveImage(image)} uri={{uri: image}} />
                                ))}
                            </View>
                        )}
                        <ListingsPhotosUploadButton onPress={pickImage} disabled={maxSelectionReached} />
                    </View>

                    <View style={tailwind('mt-10')}>
                        <Text style={tailwind(' font-medium text-sm text-brand-black-500 font-semibold')}>Order Customization and Options</Text>
                        <Text style={tailwind('text-xs text-brand-gray-800 mb-2')}>Customizable option eg. with chicken or beef</Text>
                            <View>
                                {options && options.length > 0 && (
                                    <View style={tailwind('flex flex-col w-full mb-2 mt-3 w-full')}>
                                        {options.map((option, index) => (
                                            <View key={`${option.optionName}-${index}`} style={tailwind('flex flex-row items-center p-4 justify-between bg-brand-blue-200 mb-2 rounded-lg  w-full')}>
                                                <View style={tailwind('flex flex-row items-center')}>
                                                    <Text style={tailwind('font-medium text-brand-black-500 text-xs pr-1')}>Name:</Text>
                                                    <Text style={tailwind('font-medium text-brand-black-500 text-xs')}>{option.optionName}</Text>
                                                </View>
                                                <View style={tailwind('flex flex-row items-center')}>
                                                    <Text style={tailwind('font-medium text-brand-black-500 text-xs pr-1')}>Cost:</Text>
                                                    <Text style={tailwind('font-medium text-brand-black-500 text-xs')}>{option.optionCost === '0' ? 'Free' : option.optionCost}</Text>
                                                </View>
                                                <View style={tailwind('flex flex-row items-center')}>
                                                    <Text style={tailwind('font-medium text-brand-black-500 text-xs pr-1')}>Type:</Text>
                                                    <Text style={tailwind('font-medium text-brand-black-500 text-xs')}>{isAddon ? 'ADDON': 'CUSTOM'}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                                    <TextInputWithLabel
                                        label='Option name'
                                        placeholder='Eg Chicken or With Sauce'
                                        testID='AddListingsScreen.options.text'
                                        labelTestId="AddListingsScreen.options.label"
                                        containerStyle={tailwind(' w-1/2 mt-5')}
                                        value={optionsForm.optionName}
                                        onChangeText={(value) => onOptionChange('optionName', value)}
                                        style={{
                                            width: 160
                                        }}
                                        onSubmitEditing={dismissKeyboard}
                                        labelStyle={tailwind('font-semibold text-brand-black-500')}
                                    />
                                    <TextInputWithLabel
                                        keyboardType='numeric'
                                        label='Option cost'
                                        testID='AddListingsScreen.options.text'
                                        placeholder="Put 0 (zero) if free"
                                        labelTestId="AddListingsScreen.options.label"
                                        containerStyle={tailwind('w-1/2 mt-5')}
                                        value={optionsForm.optionCost}
                                        onChangeText={(value) => onOptionChange('optionCost', value)}
                                        style={{
                                            width: 160
                                        }}
                                        onSubmitEditing={dismissKeyboard}
                                        labelStyle={tailwind('font-semibold text-brand-black-500')}
                                    />
                                </View>

                                <View style={tailwind('flex flex-row mt-4 items-center  w-full justify-end')}>
                                    <ListingsCheckBox onChange={() => {
                                        setIsAddon(!isAddon)
                                        setIsCustom(false)
                                    }} text='ADDON' checked={isAddon} />
                                    <ListingsCheckBox onChange={() => {
                                        setIsCustom(!isCustom)
                                        setIsAddon(false)
                                    }} text='CUSTOM' checked={isCustom} />
                                </View>
                            </View>
                        <ListingsCustomizableOptions onAdd={AddOptions} disabled={optionsForm.optionCost === '' || optionsForm.optionName === '' || (!isCustom && !isAddon)} />
                    </View>
                    <GenericButton
                        onPress={() => {}}
                        style={tailwind('mt-10')}
                        label="Add Listing" labelColor={tailwind('text-white')}
                        backgroundColor={tailwind('bg-secondary-500')}
                        testId="AddListingsButton"
                        disabled={checkNullState()}
                    />
                </View>
            </ScrolledView>
        </SafeAreaView>
    )
}
