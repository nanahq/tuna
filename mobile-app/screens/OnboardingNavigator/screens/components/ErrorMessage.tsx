import {Text} from "react-native";
import {tailwind} from "@tailwind";

export function ErrorMessage ({error}: {error: string}): JSX.Element {
    return (
        <Text style={tailwind('text-red-600 text-xs pb-1')}>{error}</Text>
    )
}
