import {Image, View, Text} from 'react-native'
import {tailwind} from "@tailwind";

export function ImagePreviewComponent ({uri = ''}: {uri: string, }): JSX.Element {
    return (
        <View style={tailwind('flex w-full mt-4')}>
            <Text style={tailwind('mb-2 font-semibold text-brand-black-500')}>Listing Image</Text>
            <View style={tailwind('flex w-full h-36')}>
                <Image source={{uri}} style={tailwind('w-full h-full')}  resizeMode='cover'/>
            </View>
        </View>
    )
}
