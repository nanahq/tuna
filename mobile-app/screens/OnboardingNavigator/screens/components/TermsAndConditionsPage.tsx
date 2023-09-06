import {Pressable, Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import * as WebBrowser from 'expo-web-browser'


export function TermsAndConditionsSection (): JSX.Element {
    const goToBrowser = async  () =>  await WebBrowser.openBrowserAsync('https://eatlater.ng')
    return (
        <View style={tailwind('flex flex-row flex-wrap w-full mt-5')}>
            <Text style={tailwind('text-black text-xs font-light')}>By proceeding, you consent to the </Text>
            <Pressable onPress={goToBrowser}>
                <Text style={tailwind('text-primary-500 font-bold text-xs')}>Terms and conditions</Text>
            </Pressable>
            <Text style={tailwind('text-black text-xs font-light')}>from Nana and its affiliates.</Text>
        </View>
    )
}
