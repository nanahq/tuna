import {IconButton} from "@components/commons/buttons/IconButton";
import {tailwind} from "@tailwind";

export function AddButton ({onPress}: {onPress: () => void}): JSX.Element {
    return (
        <IconButton
            onPress={onPress}
            iconName='plus-circle'
            iconType="Feather"
            iconStyle={tailwind('text-secondary-500')}
            iconSize={32}
            style={tailwind('rounded-full h-20 w-20 bg-white flex items-center justify-center  absolute bottom-10 right-5')}
        />
    )
}
