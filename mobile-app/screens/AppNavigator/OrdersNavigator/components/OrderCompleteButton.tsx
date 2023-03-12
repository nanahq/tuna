import {Text, TouchableOpacity} from "react-native";
import {tailwind} from "@tailwind";

export function OrderCompleteButton (): JSX.Element {
    return (
        <TouchableOpacity
            onPress={() => {}}
            style={[tailwind('bg-success-600 rounded-xl flex flex-row items-center justify-center'), {
                width: 255,
                height: 50
            }]}
        >
            <Text style={tailwind('text-white text-lg font-semibold text-center')}>Complete Order</Text>
        </TouchableOpacity>
    )
}
