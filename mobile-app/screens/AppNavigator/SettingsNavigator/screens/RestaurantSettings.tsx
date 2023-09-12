import { SafeAreaView, ScrollView, Text, View} from "react-native";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {getColor, tailwind} from "@tailwind";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useRef, useState} from "react";
import {VendorOperationSetting} from '@imagyne/eatlater-types'

import { RootState, useAppDispatch, useAppSelector } from "@store/index";
import { LoaderComponent } from "@components/commons/LoaderComponent";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import { _api } from "@api/_request";
import {  showTost } from "@components/commons/Toast";
import { fetchProfile } from "@store/profile.reducer";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useToast } from "react-native-toast-notifications";
import { GoBackButton } from "../components/Goback";


const operations = [
  {
    label: 'Pre order',
    value: 'PRE_ORDER'
  },
  {
    label: 'On demand',
    value: 'ON_DEMAND'
  },
  {
    label: 'Both',
    value: 'PRE_AND_INSTANT'
  },
]


export function RestaurantSettings (): JSX.Element {
    const navigation = useNavigation()
    const {profile,  hasFetchedProfile} = useAppSelector((state: RootState) => state.profile )
    const dispatch = useAppDispatch()

    const toast = useToast()

    const startTimeRef = useRef<any>(null)
    const endTimeTimeRef = useRef<any>(null)

    const [loading, setLoading] = useState<boolean>(false)
    const [operationType,setType ] = useState<string>('');
    const [operationForm, setOperationForm] = useState<any>( {
        startTime: new Date(),
        cutoffTime: new Date(),
        placementTime: '',
        preparationTime: '',
        minOrder: '0'
    })



    useEffect(() => {
        if (profile?.settings?.operations !== undefined) {
            const ops = profile?.settings?.operations
            setOperationForm((prev: any) => ({
                ...prev,
                    startTime: new Date(ops.startTime as string),
                    cutoffTime:new Date(ops.cutoffTime as string),
                    placementTime: String(ops.placementTime),
                    minOrder: String(ops.minOrder),
                    preparationTime: String(ops.preparationTime)
            }))

            setType(ops.deliveryType)
        }
    }, [])


    useEffect(() => {
        startTimeRef?.current?.blur()
        endTimeTimeRef?.current?.blur()
    }, [])
    if (!hasFetchedProfile) {
        return (
            <View style={tailwind('flex-1 w-full bg-white justify-center items-center')}>
                <View>
                    <LoaderComponent size="large" color={getColor('primary-500')}/>
                </View>
            </View>
        )
    }

    const updateTime = (name: keyof VendorOperationSetting, value: Date | undefined ) => {
        const currentTime = value
        setOperationForm((prev: any) => ({...prev, [name]: currentTime}))
    }


    const handleSettingsUpdate = async (): Promise<void> => {
        const payload: VendorOperationSetting = {
            ...operationForm,
            startTime: String(operationForm.startTime),
            cutoffTime: String(operationForm.cutoffTime),
            minOrder:   Number(operationForm.minOrder),
            deliveryType: operationType
        }
        setLoading(true)
        try {
            await _api.requestData({
                method: 'post',
                url: 'vendor/settings',
                data: {
                    payment: profile.settings?.payment,
                    operations: payload
                }
            })
        dispatch(fetchProfile())
        showTost(toast,  'Settings updated!', 'success')
        } catch (error: any) {
        showTost(toast,   typeof error?.message === 'string' ? error.messase : error.message[0], 'error')

        } finally {
            setLoading(false)

        }
    }

    const handleSelectOperationType = (value: string, type: 'SELECT' | 'UNSELECT'): void => {
            if (type === 'UNSELECT') {
                setType('')
            } else {
                setType(value)
            }
    }

    return (
        <SafeAreaView style={tailwind('flex-1')}>
            <ScrollView style={tailwind('flex w-full bg-white px-5 mt-5')}>
                <GoBackButton onPress={() => navigation.goBack()} />
                <ProfileSection sectionName="Operations">
                    <View style={tailwind('flex flex-row  w-full items-center')}>
                        <View style={tailwind('w-2/3')}>
                            <Text  style={tailwind('font-medium text-sm text-brand-black-500')}>Operation start time</Text>
                            <Text style={tailwind('font-normal text-xs text-brand-gray-700')}>
                                Time you start operation. This will be used to prevent customer from ordering before you start working
                            </Text>
                        </View>
                        <DateTimePicker
                            style={tailwind('w-1/3')}
                            is24Hour
                            value={operationForm.startTime}
                            mode='time'
                            onChange={(_, value) => {
                                 updateTime('startTime',value)
                            }}
                        />
                    </View>
                    <View style={tailwind('flex flex-row  w-full items-center')}>
                        <View style={tailwind('w-2/3 mt-6')}>
                            <Text  style={tailwind('font-medium text-sm text-brand-black-500')}>Cut off time</Text>
                            <Text style={tailwind('font-normal text-xs text-brand-gray-700')}>
                                Customers won't be able to place order after this time
                            </Text>
                        </View>
                        <DateTimePicker
                            style={tailwind('w-1/3 mt-6')}
                            is24Hour
                            value={operationForm.cutoffTime}
                            mode='time'
                            onChange={(_, value) => updateTime('cutoffTime', value)}
                        />
                    </View>
                    <TextInputWithLabel
                        containerStyle={tailwind('mt-6 w-2/3')}
                        placeholder="1 hour"
                        label="Minimum Order placement time"
                        moreInfo='Minimum time in hours between operation time and order delivery time'
                        labelTestId="min.place"
                        value={operationForm.placementTime}
                        keyboardType='number-pad'
                        onChangeText={(value) => setOperationForm((prev: any) => ({...prev, 'placementTime': value})) }
                    />
                    <TextInputWithLabel
                        containerStyle={tailwind('mt-6 w-2/3')}
                        placeholder="N2000"
                        label="Minimum Order"
                        moreInfo='Minimum order value.'
                        labelTestId="min.order"
                        value={operationForm.minOrder}
                        keyboardType='number-pad'
                        onChangeText={(value) => setOperationForm((prev: any) => ({...prev, 'minOrder': value})) }
                    />
                     <TextInputWithLabel
                        containerStyle={tailwind('mt-6 w-2/3')}
                        placeholder="30"
                        label="Preparation time"
                        moreInfo='Average time it takes to prepare a meal. This should be in minutes'
                        labelTestId="min.place"
                        value={operationForm.preparationTime}
                        keyboardType='number-pad'
                        onChangeText={(value) => setOperationForm((prev: any) => ({...prev, 'preparationTime': value})) }
                    />

                    <View style={tailwind('flex flex-col mt-5')}>
                            <Text style={tailwind('font-medium text-sm text-brand-black-500 mb-5')}>
                                What type of service do you deliver?
                            </Text>
                        <View style={tailwind('flex flex-row items-center w-full')}>
                            {operations?.map(type => (
                                <TouchableOpacity key={type.value} style={tailwind('w-28  flex flex-row items-center justify-center border-brand-gray-400 rounded-sm  border-0.5 py-2 px-1 mr-1 relative', {
                                    'border-primary-800': type.value === operationType
                                })} onPress={() => handleSelectOperationType(type.value, type.value === operationType ? 'UNSELECT': 'SELECT')}>
                                    <Text >{type.label}</Text>
                                    <View
                                        style={tailwind('rounded-full w-2 h-2 absolute bottom-1 right-1', {
                                            'bg-primary-500': type.value === operationType,
                                            'border-0.5 border-brand-gray-400': type.value !== operationType
                                        })}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <GenericButton
                    loading={loading}
                    backgroundColor={tailwind('bg-brand-black-500')}
                        label="Save settings"
                        onPress={() => handleSettingsUpdate()}
                        labelColor={tailwind('text-white')}
                        style={tailwind('mt-16 mb-10')}
                        testId=''

                    />
                </ProfileSection>
            </ScrollView>
        </SafeAreaView>
    )
}
