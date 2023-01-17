import {View} from 'react-native'
import {getColor, tailwind} from '@tailwind'
import {useState} from 'react'
import SwitchSelector from "react-native-switch-selector";

export function OrderHeaderStatus (): JSX.Element {
    const [isAvailable, setIsAvailable] = useState<boolean>(true)
    const onToggle = (value: boolean): void => setIsAvailable(value)

    return (
            <View style={[tailwind(' flex flex-row justify-end')]}>
               <View style={tailwind('w-1/2')}>
                   <SwitchSelector
                       height={25}
                       initial={0}
                       onPress={(value: boolean) => onToggle(value)}
                       textColor={getColor('brand-gray-800')} //'#7a44cf'
                       selectedColor="#ffffff"
                       buttonColor={isAvailable ? getColor('primary-500') : getColor('brand-gray-800')}
                       borderColor={isAvailable ? getColor('primary-500') : getColor('brand-gray-800')}
                       hasPadding
                       options={[
                           { label: "Available", value: true, },
                           { label: "Unavailable", value: false,  }
                       ]}
                       testID="gender-switch-selector"
                       accessibilityLabel="gender-switch-selector"
                   />
               </View>
            </View>

    )
}
