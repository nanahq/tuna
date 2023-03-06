import {SafeAreaView, ScrollView, Text, View} from "react-native";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {getColor, tailwind} from "@tailwind";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState} from "react";
import {VendorOperationSetting} from '@imagyne/eatlater-types'
import { RootState, useAppDispatch, useAppSelector } from "@store/index";
import { LoaderComponent } from "@components/commons/LoaderComponent";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import { _api } from "@api/_request";
import { ShowToast } from "@components/commons/Toast";
import { fetchProfile } from "@store/profile.reducer";
import { GoBackButton } from "../components/Goback";
import { useNavigation } from "@react-navigation/native";

export function RestaurantSettings (): JSX.Element {
    const navigation = useNavigation()
    const {profile,  hasFetchedProfile} = useAppSelector((state: RootState) => state.profile )
    const dispatch = useAppDispatch()

    const [operationForm, setOperationForm] = useState<any>( {
        startTime: new Date(),
        cutoffTime: new Date(),
        placementTime: '',
        minOrder: 0
    })


    useEffect(() => {
        if(profile?.settings?.operations !== undefined) {
            const ops = profile.settings.operations
            setOperationForm((prev: any) => ({
                ...prev,
                    startTime: new Date(ops.startTime as string),
                    cutoffTime:new Date(ops.cutoffTime as string),
                    placementTime: ops.placementTime,
                    minOrder: String(ops.minOrder)
            }))
        }
    }, [])
    const [loading, setLoading] = useState<boolean>(false)

    if(!hasFetchedProfile) {
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
            minOrder:   Number(operationForm.minOrder)
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
        ShowToast('success', 'Settings updated!')
        } catch (error: any) {
        ShowToast('error', typeof error?.message === 'string' ? error.messase : error.message[0])
            
        } finally {
            setLoading(false)
        
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={tailwind('flex w-full h-full px-5 mt-5')}>
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
                            onChange={(_, value) => updateTime('startTime',value)}
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
                    <GenericButton
                    loading={loading}
                    backgroundColor={tailwind('bg-brand-black-500')}
                        label="Save settings"
                        onPress={() => handleSettingsUpdate()}
                        labelColor={tailwind('text-white')}
                        style={tailwind('mt-16')}
                        testId=''
                
                    />
                </ProfileSection>
            </ScrollView>
        </SafeAreaView>
    )
}
