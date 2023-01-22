import {Dimensions, KeyboardAvoidingView, ScrollView, StyleProp, Text, View, ViewProps} from 'react-native'
import {tailwind} from '@tailwind'
import {ModalTextInput, TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {PropsWithChildren, useRef, useState} from "react";
import {IconButton} from "@components/commons/buttons/IconButton";
import {AddBankModal as OptionModal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {CloseModalButton} from "@components/commons/buttons/CloseModal";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {useNavigation} from "@react-navigation/native";

export const OPTION_MODAL_NAME = 'ADD_OPTION'

export function AddOption (): JSX.Element {
    const bottomSheetModalRef = useRef<any>(null)
    const navigation = useNavigation()
    const { dismiss } = useBottomSheetModal()

    const [options, setOptions] = useState<any[]>([])
    const [optionForm, setOptionForm] = useState<Record<string, string>>({
        name: '',
        minChoice: '1',
        maxChoice: '0'
    })

    const [addOption, setAddOption] = useState<Record<string, string>>({
        name: '',
        price: '',
    })

    const screenHeight = Dimensions.get('screen').height
    const [_modalIsOpen, setModalIsOpen] = useState<boolean>(false)


    function openModal (): void {
        bottomSheetModalRef.current?.present();
        setModalIsOpen(true)
    }

    const handleInputChange = (type: 'CAT' | 'OPT', value: string,  name: string): void => {

        if (type === 'CAT') {
            setOptionForm(prev => ({...prev, [name]: value}))
            return
        }

        setAddOption((prev) => ({...prev, [name ]: value}))
    }

    const handleAddOption = (): void => {
        setOptions((prevState) => ([...prevState, addOption]))
        setAddOption({name: '', price: ''})
        dismiss(OPTION_MODAL_NAME)
    }

    const checkNullState  = (): boolean => {
        let isNull: boolean = false

        if (addOption.name.length <= 3) {
            isNull = true
        } else if (addOption.price.length <= 1) {
            isNull = true
        }
        return isNull
    }

    const handleOptionDelete = (index: number): void => {
        const _options = options.filter((_, _index) => {
            return _index !== index
        })

        setOptions(_options)
    }
    return (
        <KeyboardAvoidingView style={tailwind('flex-1 h-full px-5 mt-10 overflow-hidden')}>
            <GoBackButton style={tailwind('mb-1')} onPress={() => navigation.goBack()} />
            <View>
                <TextInputWithLabel
                    value={optionForm.name}
                    placeholder='Sauces'
                    label="Option Group Name"
                    labelTestId="AddOption.Name"
                    onChangeText={(value) =>handleInputChange('CAT', value, 'name')}
                />
            </View>
            <View style={tailwind('flex flex-row items-center  mt-5')}>
                <TextInputWithLabel
                    value={optionForm.minChoice}
                    keyboardType='number-pad'
                    moreInfo="Minimum options a customer can select"
                    label="Min Select"
                    labelTestId=""
                    containerStyle={tailwind('w-1/3 mr-5')}
                    onChangeText={(value) =>handleInputChange('CAT', value, 'minChoice')}
                />
                <TextInputWithLabel
                    value={optionForm.maxChoice}
                    keyboardType='number-pad'
                    moreInfo="Maximum  options a customer can select"
                    label="Max Select"
                    labelTestId=""
                    containerStyle={tailwind('w-1/3')}
                    onChangeText={(value) =>handleInputChange('CAT', value, 'maxChoice')}
                />
            </View>

            <SectionWithAddButton
                sectionName='Options'
                onPress={openModal}
                height={screenHeight}
                style={tailwind('mt-10 mb-5')}
            >

                {options.length >= 1 ? options.map((option, index) => (
                    <OptionCard key={`${index}-${option.price}`} delete={handleOptionDelete} index={index} name={option.name} price={option.price} />
                )): (
                    <View style={tailwind('flex flex-row justify-center h-full items-center w-full')}>
                        <Text style={tailwind('text-brand-gray-700 font-medium text-xl')}>No option added</Text>
                    </View>
                )}
            </SectionWithAddButton>
            <OptionModal promptModalName={OPTION_MODAL_NAME} modalRef={bottomSheetModalRef}>
                <CloseModalButton modalName={OPTION_MODAL_NAME}/>
                <View style={tailwind('h-full')}>
                    <ModalTextInput
                        label="Option name"
                        placeholder='Goat meat'
                        labelTestId=""
                        containerStyle={tailwind('mb-6')}
                        onChangeText={(value) =>handleInputChange('OPT', value, 'name')}
                    />
                    <ModalTextInput
                        label="Option Price"
                        moreInfo='Put zero if option is free. All figures are in Naira'
                        placeholder='₦200'
                        labelTestId=""
                        keyboardType='number-pad'
                        containerStyle={tailwind('mb-6')}
                        onChangeText={(value) =>handleInputChange('OPT', value, 'price')}
                    />
                    <GenericButton
                        style={tailwind('mt-10')}
                        onPress={handleAddOption}
                        label="Add option"
                        backgroundColor={tailwind('bg-secondary-700')}
                        testId=""
                        labelColor={tailwind('text-white')}
                        disabled={checkNullState()}
                    />
                </View>
            </OptionModal>
            {options.length !== 0 && optionForm.name.length > 1 && (
                <GenericButton
                    style={tailwind('mb-5')}
                    onPress={() => {}}
                    label="Add option"
                    backgroundColor={tailwind('bg-secondary-700')}
                    testId=""
                    labelColor={tailwind('text-white')}
                />
            )}
        </KeyboardAvoidingView>
    )
}


export function SectionWithAddButton (props: PropsWithChildren<{onPress: () => void, sectionName: string, height?: number, style?: StyleProp<ViewProps>}>): JSX.Element {
    return (
        <ScrollView style={[tailwind(' border-0.5 border-brand-black-500 px-3'), {height: props.height ?? '100%' }, props.style]}>
            <View style={[tailwind('flex flex-row items-center w-full justify-between p-2 border-b-0.5  border-brand-black-500'), {
                shadowOpacity: 0.1,
                shadowRadius: 0.3
            }]}>
                <Text style={tailwind('font-semibold text-sm text-brand-black-500')}>{props.sectionName}</Text>
                <IconButton
                    onPress={props.onPress}
                    iconName="plus"
                    iconType="Feather"
                    iconSize={26}
                    iconStyle={tailwind('text-blue-600 font-semibold')}
                />
            </View>
            {props.children}
        </ScrollView>
    )
}


function OptionCard (props: {name: string, price: string, index: number, delete: (index: number) => void}): JSX.Element {
    return (
        <View style={tailwind('flex flex-row items-center justify-between w-full border-b-0.5  border-brand-gray-400 py-5  px-3')}>
            <Text style={tailwind('text-brand-black-500 font-semibold text-xs')}>{props.name}</Text>
            <View style={tailwind('flex flex-row items-center')}>
                <Text style={tailwind('text-brand-black-500 font-semibold text-xs mr-2')}>{`₦${props.price}`}</Text>
                <IconButton onPress={() => props.delete(props.index)} iconName='trash' iconType='Feather' iconSize={16} iconStyle={tailwind('text-red-500')} />
            </View>
        </View>
    )
}
