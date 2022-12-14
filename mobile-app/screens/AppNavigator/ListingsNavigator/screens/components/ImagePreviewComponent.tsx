import {Image, ImageSourcePropType, View} from 'react-native'
import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";

export function ImagePreviewComponent ({uri, onDelete}: {uri: ImageSourcePropType, onDelete: () => void}): JSX.Element {
    return (
        <View style={tailwind('mb-2 relative')}>
            <Image source={uri} style={tailwind('w-24 h-24')}  resizeMode='cover'/>
            <IconButton
            onPress={onDelete}
            iconSize={18}
            iconStyle={tailwind('text-brand-black-500')}
            style={tailwind('bg-brand-blue-200 rounded-full p-1 absolute top-0 right-0')}
            iconName='x'
            iconType='Feather'
            />
        </View>
    )
}
