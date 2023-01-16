import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";

export function GoBackButton ({onPress}: {onPress: () => void}) : JSX.Element  {{
    return (
        <IconButton
            iconName='arrow-left'
            iconType='Feather'
            iconSize={24}
            iconStyle={tailwind('text-brand-black-500')}
            style={tailwind('mb-2')}
            onPress={onPress}
        />
    )
}}
