import {View, Text, Pressable} from 'react-native'
import { tailwind} from '@tailwind'
import {updateUserProfile, fetchProfile} from "@store/profile.reducer";
import {useAppDispatch} from "@store/index";
import {useState} from "react";
import { LoaderComponent } from '@components/commons/LoaderComponent';
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";

export function OrderHeaderStatus (props:{status: 'ONLINE' | 'OFFLINE'}): JSX.Element {
    const [loading, setIsLoading] = useState<{type: 'ONLINE' | 'OFFLINE', state: boolean}>({
        type: 'ONLINE',
        state: false
    })
      const dispatch = useAppDispatch()
        const toast = useToast()

    const onToggle = async (status: 'ONLINE' | 'OFFLINE'): Promise<void> =>  {
        setIsLoading({
            state: true,
            type: status
        })
        await dispatch(updateUserProfile({status }))
         await dispatch(fetchProfile())
         setIsLoading({
            state: false,
            type: status
        })

        showTost(toast, 'Status updated!', 'success')
    }
    return (
            <View style={tailwind('flex flex-row justify-end mb-3')}>
            <View style={tailwind('flex flex-row items-center  rounded-lg w-2/3')}>
            <Pressable  onPress={() => onToggle('ONLINE')}  disabled={loading.state} style={tailwind('flex flex-row justify-center items-center  pr-1 w-1/2  py-1 px-1 rounded-l-lg', {
                'bg-green-500  border-0.5 border-green-500 border-r-0': props.status === 'ONLINE',
                'bg-white  border-0.5 border-brand-black-500 border-r-0': props.status === 'OFFLINE'
            })}>
              {loading.state && loading.type === 'ONLINE' ? (
                <LoaderComponent  size='small' />

              ): (
                <Text style={tailwind('text-sm text-center ', {
                    'text-brand-black-500': props.status === 'OFFLINE',
                    'text-white': props.status === 'ONLINE'
                   })}>Accepting</Text>
              )}
            </Pressable>
            <Pressable disabled={loading.state} onPress={() => onToggle('OFFLINE')}   style={tailwind('flex flex-row items-center w-1/2 justify-center rounded-r-lg py-1', {
                      'bg-brand-gray-800 border-0.5 border-brand-gray-800 border-r-0': props.status === 'OFFLINE',
                      'bg-white  border-0.5 border-brand-black-500 border-l-0': props.status === 'ONLINE'
            })}>
                {loading.state && loading.type === 'OFFLINE' ? (
                 <LoaderComponent  size='small' />
                ): (
                <Text style={tailwind('text-sm text-center ', {
                    'text-brand-black-500': props.status === 'ONLINE',
                    'text-white': props.status === 'OFFLINE'
                   })}>Unavailable</Text>
                )}
            </Pressable>
        </View>
            </View>

    )
}
