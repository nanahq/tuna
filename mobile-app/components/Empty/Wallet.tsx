import {Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";

export function EmptyWallet (): JSX.Element {
    return (
        <View style={tailwind('flex flex-col items-center mt-20 justify-center w-full')}>
            <IconComponent
                iconType="Feather"
                name="info"  size={60}
                style={tailwind('text-yellow-500')}
            />
            <View style={tailwind('flex flex-col items-center w-3/4 mt-2')}>
                <Text style={tailwind('font-semibold text-2xl text-brand-gray-800 mb-1')}>No transaction history</Text>
            </View>
        </View>
    )
}
