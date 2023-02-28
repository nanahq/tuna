import {View} from 'react-native'
import {getColor, tailwind} from '@tailwind'
import SwitchSelector from "react-native-switch-selector";
import {updateUserProfile, fetchProfile} from "@store/profile.reducer";
import {useAppDispatch} from "@store/index";
import {useState} from "react";

export function OrderHeaderStatus (props:{status: 'ONLINE' | 'OFFLINE'}): JSX.Element {
    const [loading, setIsLoading] = useState<boolean>(false)
        const dispatch = useAppDispatch()
    const onToggle = async (value: boolean): Promise<void> =>  {
        setIsLoading(true)
        await dispatch(updateUserProfile({status: value ? 'ONLINE' : 'OFFLINE'}))
        dispatch(fetchProfile())
        setIsLoading(false)
    }
    return (
            <View style={tailwind(' flex flex-row justify-end')}>
               <View style={tailwind('w-1/2')}>
                   <SwitchSelector
                       disabled={loading}
                       height={25}
                       initial={0}
                       onPress={(value: boolean) => void onToggle(value)}
                       textColor={getColor('brand-gray-800')} // '#7a44cf'
                       selectedColor="#ffffff"
                       buttonColor={props.status === 'ONLINE' ? getColor('primary-500') : getColor('brand-gray-800')}
                       borderColor={props.status === 'ONLINE' ? getColor('primary-500') : getColor('brand-gray-800')}
                       hasPadding
                       options={[
                           { label: "Available", value: props.status !== 'ONLINE', },
                           { label: "Unavailable", value: props.status !== 'OFFLINE',  }
                       ]}
                       testID="gender-switch-selector"
                       accessibilityLabel="gender-switch-selector"
                   />
               </View>
            </View>

    )
}
