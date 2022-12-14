import {Text, TouchableOpacity} from "react-native";
import {tailwind} from '@tailwind'

export function ListingsPhotosUploadButton (props: {onPress: () => Promise<void>, disabled: boolean}): JSX.Element {
    return (
        <TouchableOpacity
            style={tailwind('py-2 px-4 rounded-lg', {
                'bg-brand-black-500': !props.disabled,
                'bg-brand-gray-400': props.disabled
            })}
            onPress={props.onPress}
            disabled={props.disabled}

        >
            <Text style={tailwind('text-white font-semibold text-lg text-center')}>{props.disabled ? 'Max selected' : 'Upload Photo'}</Text>
        </TouchableOpacity>
    )
}
