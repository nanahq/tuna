import {PropsWithChildren, ReactElement, ReactNode} from "react";
import {Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {EditButton} from "@screens/AppNavigator/SettingsNavigator/components/EditButton";

interface ProfileSectionProps {
    sectionName: string
    onPress?: () => void
    editable?: boolean
    leftComponent?: ReactElement | ReactNode

}
export function ProfileSection (props: PropsWithChildren<ProfileSectionProps>): JSX.Element {
    const {editable = true} = props
    return (
        <View style={tailwind('mt-4')}>
            <View style={tailwind('mb-1.5 mt-2 flex w-full flex-row items-baseline justify-between')}>
                <Text style={tailwind('text-brand-black-500 font-medium text-lg ')}>{props.sectionName}</Text>
                {editable && props.onPress !== undefined && (<EditButton onPress={props.onPress} />)}
                {props.leftComponent !== undefined && props.leftComponent}
            </View>
            {props.children}
        </View>
    )
}
