import {IconButton} from "@components/commons/buttons/IconButton";
import {tailwind} from "@tailwind";

export function EditButton (props: {onPress: () => void}): JSX.Element {
    return (
        <IconButton
            onPress={props.onPress}
            iconStyle={tailwind('text-brand-black-500')}
            iconSize={20}
            iconType='Feather'
            iconName='edit-2'
        />
    )
}
