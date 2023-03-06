import {View, Text} from 'react-native'
import {tailwind} from '@tailwind'
import { IconComponent } from './IconComponent'

export function CompleteProfileMsg (): JSX.Element {
    return (
        <View style={tailwind('flex flex-col   w-full rounded-lg py-4 px-3 bg-warning-200')}>
           <View style={tailwind('flex w-full  flex-row items-center')}>
           <IconComponent iconType='Feather' name='alert-triangle' />
            <Text style={tailwind('text-xs text-brand-black-500 font-medium ml-2')}>Your listings are not visible. Complete your vendor's profile to start selling on EatLater.</Text>
           </View>
        </View>
    )
}
