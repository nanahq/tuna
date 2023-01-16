import {SafeAreaView, ScrollView, Text, View} from "react-native";
import {ProfileSection} from "@screens/AppNavigator/SettingsNavigator/components/ProfileSections";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {tailwind} from "@tailwind";
import DateTimePicker from '@react-native-community/datetimepicker';
import {useCallback, useState} from "react";
import {ListingDateCheckBox} from "@screens/AppNavigator/ListingsNavigator/screens/components/ListingAvailableDateRow";

interface OpsSettings {
    businessOperationDays: string[]
    minStartTime:  Date
    minOrderIntervalTime:  Date
    maxOrderIntervalDate:  Date
    minOrder: string
}
export function RestaurantSettings (): JSX.Element {
    const [availableDays, setAvailableDays] = useState<Array<any>>([
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
    const [operationForm, setOperationForm] = useState<OpsSettings>( {
        businessOperationDays: [],
        minStartTime: new Date(),
        minOrderIntervalTime:new Date(),
        maxOrderIntervalDate:new Date() ,
        minOrder: ""
    })


    const updateTime = (name: keyof OpsSettings, value: Date | undefined ) => {
        const currentTime = value
        console.log(currentTime)
        setOperationForm((prev) => ({...prev, [name]: currentTime}))
    }

    const onCheckBoxChange = useCallback((day: any ): void => {
        let newDates;
        if(day === 'EVERYDAY') {
            newDates = availableDays.map( (item) => {
                    item.checked = true
                return item
            })
        }

         newDates = availableDays.map( (item) => {
            if(item.day === day) {
                item.checked = !item.checked
            }
            return item
        })
        setAvailableDays(newDates)
    }, [] )

    return (
        <SafeAreaView>
            <ScrollView style={[tailwind('flex w-full h-full px-5 mt-5')]}>
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
                            is24Hour={true}
                            value={operationForm.minStartTime}
                            mode='time'
                            onChange={(_, value) => updateTime('minStartTime', value)}
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
                            is24Hour={true}
                            value={operationForm.minStartTime}
                            mode='time'
                            onChange={(_, value) => updateTime('maxOrderIntervalDate', value)}
                        />
                    </View>
                    <TextInputWithLabel
                        containerStyle={tailwind('mt-6 w-2/3')}
                        placeholder="2000"
                        label="Minimum Order placement time"
                        moreInfo='Minimum time in hours between operation time and order delivery time'
                        labelTestId="min.order"
                        value={operationForm.minOrder}
                        keyboardType='number-pad'
                        onChangeText={(value) => setOperationForm((prev) => ({...prev, ['minOrder']: value})) }
                    />
                    <TextInputWithLabel
                        containerStyle={tailwind('mt-6 w-2/3')}
                        placeholder="2000"
                        label="Minimum Order"
                        moreInfo='Minimum order value a customer must place'
                        labelTestId="min.order"
                        value={operationForm.minOrder}
                        keyboardType='number-pad'
                        onChangeText={(value) => setOperationForm((prev) => ({...prev, ['minOrder']: value})) }
                    />

                    <View style={tailwind('mt-4 mb-10 border-0.5 border-gray-700 border-dashed py-5 px-4 rounded')}>
                        <Text style={tailwind('mb-2.5 font-medium text-sm text-brand-black-500 font-semibold')}>Availability</Text>
                        <View style={tailwind('flex flex-row items-center flex-wrap')}>
                            {availableDays.map(({day, checked}) => (
                                <ListingDateCheckBox  key={day} onChange={() => onCheckBoxChange(day)} date={day} checked={checked} />
                            ))}
                        </View>
                    </View>
                </ProfileSection>
            </ScrollView>
        </SafeAreaView>
    )
}
