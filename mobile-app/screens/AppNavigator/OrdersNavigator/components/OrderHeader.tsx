import {View, Text, Pressable} from 'react-native'
import { tailwind} from '@tailwind'
import {updateUserProfile, fetchProfile} from "@store/profile.reducer";
import {useAppDispatch} from "@store/index";
import {useState} from "react";
import { LoaderComponent } from '@components/commons/LoaderComponent';
export function OrderHeaderStatus (props:{status: 'ONLINE' | 'OFFLINE'}): JSX.Element {
    const [loading, setIsLoading] = useState<boolean>(false)
        const dispatch = useAppDispatch()

    const onToggle = async (status: 'ONLINE' | 'OFFLINE'): Promise<void> =>  {
        setIsLoading(true)
        await dispatch(updateUserProfile({status }))
         dispatch(fetchProfile())
        setIsLoading(false)
    }
    return (
            <View style={tailwind(' flex flex-row justify-end mb-3')}>
            
            <View style={tailwind('flex flex-row items-center  rounded-lg w-2/3')}>
            <Pressable  onPress={() => onToggle('ONLINE')}  disabled={loading} style={tailwind('flex flex-row justify-center items-center  pr-1 w-1/2  py-1 px-1 rounded-l-lg', {
                'bg-primary-500  border-0.5 border-primary-500 border-r-0': props.status === 'ONLINE',
                'bg-transparent  border-0.5 border-brand-black-500 border-r-0': props.status === 'OFFLINE'
            })}>
              {!loading ? (
                 <Text style={tailwind('text-sm text-center ', {
                    'text-brand-black-500': props.status === 'OFFLINE',
                    'text-white': props.status === 'ONLINE'
                   })}> Recieving Orders</Text>
    
              ): (
                <LoaderComponent  size='small' />
              )}
            </Pressable>
            <Pressable disabled={loading} onPress={() => onToggle('OFFLINE')}   style={tailwind('flex flex-row items-center w-1/2 justify-center rounded-r-lg py-1', {
                      'bg-primary-500 border-0.5 border-primary-500 border-r-0': props.status === 'OFFLINE',
                      'bg-transparent  border-0.5 border-brand-black-500 border-l-0': props.status === 'ONLINE' 
            })}>
                {!loading ? (
                     <Text style={tailwind('text-sm text-center ', {
                        'text-brand-black-500': props.status === 'ONLINE',
                        'text-white': props.status === 'OFFLINE'
                       })}>  Unavailable</Text>
                ): (
                <LoaderComponent  size='small' />

                )}
            </Pressable>
        </View>
            </View>

    )
}
