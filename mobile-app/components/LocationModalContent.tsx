import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {IconComponent} from "@components/commons/IconComponent";
import {GenericButton} from "@components/commons/buttons/GenericButton";

export function LocationModalContent (props: {requestLocation: () => void}): JSX.Element {
    return (
        <View style={tailwind('flex flex-col w-full items-center mt-8')}>
                <IconComponent iconType='Feather' name='map-pin' size={80} style={tailwind('mb-3 text-brand-gray-400')} />
            <View style={tailwind('flex flex-col items-center mb-10')}>
                <Text style={tailwind('font-semibold text-2xl text-brand-black-500 mb-3')}>Share Location</Text>
                <Text style={tailwind('font-light text-sm text-brand-black-500')}>We use precise location to help our riders and customers locate your business and calculate shipping cost. Make sure your current location is where your business is located.</Text>
            </View>
            <GenericButton  onPress={props.requestLocation} labelColor={tailwind('text-white')} label="Enable location" backgroundColor={tailwind('bg-primary-500 w-full')} testId="" />
        </View>
    )
}
