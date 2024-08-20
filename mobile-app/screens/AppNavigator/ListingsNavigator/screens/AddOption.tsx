import {
    Dimensions,
    ScrollView,
    StyleProp,
    Text,
    View,
     ViewStyle
} from 'react-native'
import {tailwind} from '@tailwind'
import {ModalTextInput, TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {PropsWithChildren, useEffect, useRef, useState} from "react";
import {IconButton} from "@components/commons/buttons/IconButton";
import {AddBankModal as OptionModal} from "@screens/AppNavigator/SettingsNavigator/components/AddBankModal";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {CloseModalButton} from "@components/commons/buttons/CloseModal";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import {GoBackButton} from "@screens/AppNavigator/SettingsNavigator/components/Goback";
import {StackScreenProps} from "@react-navigation/stack";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {ListingOption} from "@nanahq/sticky";
import {useAppDispatch} from "@store/index";
import {updateOptionGroup} from "@store/listings.reducer";
import { useToast } from 'react-native-toast-notifications';
import { showTost } from '@components/commons/Toast';



export const OPTION_MODAL_NAME = 'ADD_OPTION'


type AddOptionNavProps = StackScreenProps<ListingsParams, "AddOption">
interface OptionFormI {
    name: string
    min: string
    max: string
}
export function AddOption ({route, navigation}: AddOptionNavProps): JSX.Element {
    const bottomSheetModalRef = useRef<any>(null)
    const { dismiss } = useBottomSheetModal()
    const dispatch = useAppDispatch()
    const toast = useToast()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    // Form
    const [form, setForm] = useState<OptionFormI>({
        name: '',
        max: '',
        min: ''
    })

    const [options, setOptions] = useState<ListingOption[]>([])

    const [addOption, setAddOption] = useState<any>({
        name: '',
        price: '',
    })

    const screenHeight = Dimensions.get('screen').height

    useEffect(() => {
        if (route?.params?.option !== undefined) {
            const op = route?.params?.option
            setForm({
                name: op.name,
                max: String(op.max ),
                min: String(op.min )
            })
            setOptions(op.options)
        }

        navigation.setOptions({
            headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />
        })
    }, [])

    function openModal (): void {
        bottomSheetModalRef.current?.present();
    }

    const handleInputChange = (value: string,  name: string): void =>  setAddOption((prev: any) => ({...prev, [name ]: value}))


    const handleAddOption = (): void => {
        setOptions((prevState) => ([...prevState, addOption]))
        setAddOption({name: '', price: ''})
        dismiss(OPTION_MODAL_NAME)
    }

    const checkNullState  = (): boolean => {
        let isNull: boolean = false
        if (addOption.name.length <= 3) {
            isNull = true
        } else if (addOption.price.length <= 0) {
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

    const checkDirty = (): boolean => {
        if (form.name !== route?.params?.option.name) {
return true
}
        if (form.min !== route?.params?.option.min.toString()) {
return true
}
        if (form.max !== route?.params?.option.max.toString()) {
return true
}
        return options.length !== route?.params?.option.options.length;
    }

    const addOrUpdateOption = async (): Promise<void> => {
        let payload: any = {
            ...form,
            options: [...options],
        }

        const type = route?.params?.option._id !== undefined ? 'update' : 'new'

        if (type === 'update') {
            payload = {...payload, optionId: route?.params?.option._id }
        }

        setIsLoading(true)

        try {
           const res = await dispatch(updateOptionGroup({payload, type})).unwrap()
           if (res.status === 1) {
               showTost(toast, 'Option added!', 'success')
               setTimeout(() => {
                  void navigation.goBack()
               }, 3000)
           }
        } catch (error: any) {
           showTost(toast,  typeof error.message !== 'string' ? error.message[0] : error.message, 'error')
        } finally {
            setIsLoading(false)
        }
    }


    return (
           <ScrollView showsVerticalScrollIndicator={false} style={tailwind('flex-1 py-5 bg-white px-5')}>
               <View>
                   <TextInputWithLabel
                       defaultValue={form.name}
                       placeholder='Sauces'
                       label="Option Group Name"
                       labelTestId="AddOption.Name"
                       onChangeText={(value) => setForm(prev => ({...prev, name: value}))}
                   />
               </View>
               <View style={tailwind('flex flex-row items-center  mt-5')}>
                   <TextInputWithLabel
                       defaultValue={form.min}
                       onChangeText={(value) => setForm(prev => ({...prev, min: value}))}
                       keyboardType='number-pad'
                       moreInfo="Minimum options a customer can select"
                       label="Min Select"
                       labelTestId=""
                       containerStyle={tailwind('w-1/3 mr-5')}
                   />
                   <TextInputWithLabel
                       defaultValue={form.max}
                       onChangeText={(value) => setForm(prev => ({...prev, max: value}))}
                       keyboardType='number-pad'
                       moreInfo="Maximum  options a customer can select"
                       label="Max Select"
                       labelTestId=""
                       containerStyle={tailwind('w-1/3')}
                   />
               </View>
               <SectionWithAddButton
                   sectionName='Options'
                   onPress={openModal}
                   height={screenHeight / 2 - 100}
                   style={tailwind('mt-10 mb-5')}
               >
                   {options ? options.map((option, index) => (
                       <OptionCard key={`${index}-${option.price}`} delete={handleOptionDelete} index={index} name={option.name} price={option.price} />
                   )): (
                       <View style={tailwind('flex flex-row justify-center h-full items-center w-full')}>
                           <Text style={tailwind('text-brand-gray-700 font-medium text-xl')}>No option added</Text>
                       </View>
                   )}
               </SectionWithAddButton>
               <OptionModal promptModalName={OPTION_MODAL_NAME} modalRef={bottomSheetModalRef}>
                   <CloseModalButton modalName={OPTION_MODAL_NAME}/>
                   <View style={tailwind('flex-1')}>
                       <ModalTextInput
                           label="Option name"
                           placeholder='Goat meat'
                           labelTestId=""
                           containerStyle={tailwind('mb-6')}
                           onChangeText={(value) =>handleInputChange( value, 'name')}
                       />
                       <ModalTextInput
                           label="Option Price"
                           moreInfo='Put zero if option is free. All figures are in Naira'
                           placeholder='₦200'
                           labelTestId=""
                           keyboardType='number-pad'
                           containerStyle={tailwind('mb-6')}
                           onChangeText={(value) =>handleInputChange(value, 'price')}
                       />
                       <GenericButton
                           style={tailwind('mt-10')}
                           onPress={handleAddOption}
                           label="Add option"
                           backgroundColor={tailwind('bg-brand-black-500')}
                           testId=""
                           labelColor={tailwind('text-white')}
                           disabled={checkNullState()}
                       />
                   </View>
               </OptionModal>
               {checkDirty()  && (
                   <GenericButton
                       disabled={isLoading}
                       loading={isLoading}
                       style={tailwind('mb-20')}
                       onPress={addOrUpdateOption}
                       label={route?.params?.option !== undefined ? 'Update option group' : 'Add option'}
                       backgroundColor={tailwind('bg-brand-black-500')}
                       testId=""
                       labelColor={tailwind('text-white')}
                   />
               )}
           </ScrollView>
    )
}


export function SectionWithAddButton (props: PropsWithChildren<{onPress: () => void, sectionName: string, height?: number, style?: StyleProp<ViewStyle>}>): JSX.Element {
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
