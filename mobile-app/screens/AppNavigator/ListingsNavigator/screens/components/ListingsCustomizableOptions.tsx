import {tailwind} from "@tailwind";
import {Text, TouchableOpacity} from "react-native";

export function ListingsCustomizableOptions (props: {onAdd: () => void, disabled: boolean}): JSX.Element {
    return (
        <TouchableOpacity
            style={tailwind('py-2 px-4 rounded-lg w-1/2 ', {
                'bg-brand-black-500': !props.disabled,
                'bg-brand-gray-400': props.disabled
            })}
            onPress={props.onAdd}
            disabled={props.disabled}
        >
            <Text style={tailwind('text-white font-semibold text-lg text-center')}>Add Option</Text>
        </TouchableOpacity>
    )
}
