import {IconButton} from "@components/commons/buttons/IconButton";
import {tailwind} from "@tailwind";

interface BackButtonProps {
    onPress: () => void
    testID: string
}

export function BackButton (props: BackButtonProps): JSX.Element {
    return (
        <IconButton
            {...props}
            testID="EnterPhoneNumberScreen.BackButton"
            iconSize={30}
            iconName='arrow-left'
            iconType='Feather'
            iconStyle={tailwind('text-brand-black-500')}
            style={tailwind('w-20 h-20 rounded-full bg-brand-gray-200 mt-16 flex items-center justify-center')}
        />
    )
}
