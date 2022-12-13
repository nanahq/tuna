import {Text, TouchableOpacity} from "react-native";
import {OrderStatus} from "@types/Orders.type";
import {tailwind} from "@tailwind";

export function OrderCompleteButton (props: {orderid?: string, status: OrderStatus}): JSX.Element {
    return (
        <TouchableOpacity
            onPress={() => {}}
            style={[tailwind('bg-green-500 rounded-xl flex flex-row items-center justify-center'), {
                width: 255,
                height: 50
            }]}
        >
            <Text style={tailwind('text-white text-lg font-semibold text-center')}>Complete Order</Text>
        </TouchableOpacity>
    )
}
