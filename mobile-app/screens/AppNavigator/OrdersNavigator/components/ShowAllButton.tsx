import {Text, TouchableOpacity} from "react-native";
import {tailwind} from '@tailwind'

export function ShowAllButton (props: {onPress: () => void, testID: string}): JSX.Element {
    return (
        <TouchableOpacity
            {...props}
            style={tailwind('bg-brand-black-500 rounded-xl py-1 px-2')}
        >
            <Text style={tailwind('text-white font-medium text-sm')}>Show all</Text>
        </TouchableOpacity>
    )
}
