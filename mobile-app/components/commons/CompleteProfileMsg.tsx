import {View, Text} from 'react-native'
import {tailwind} from '@tailwind'
import { IconComponent } from './IconComponent'

export function CompleteProfileMsg (props: {type: 'PROFILE' | 'ACCOUNT'}): JSX.Element {
    return (
        <View style={tailwind('flex flex-col   w-full rounded-lg py-4 px-3 bg-warning-200')}>
           <View style={tailwind('flex w-full  flex-row items-center')}>
           <IconComponent iconType='Feather' name='alert-triangle' />
               {props.type === 'PROFILE' ? (
                   <Text style={tailwind('text-xs text-brand-black-500 ml-1')}>Complete your vendor's profile to start selling on Nana.</Text>

               ) : (
                   <Text style={tailwind('text-xs text-brand-black-500 ml-1')}>You Account is under review! Don't worry it will get approved in a few hours.</Text>
               )}
           </View>
        </View>
    )
}
