import {IconButton} from "@components/commons/buttons/IconButton";
import {tailwind} from "@tailwind";
import {NavigationProp} from "@react-navigation/native";
import * as Device from 'expo-device';

export function AddListingsButton ({navigation, route}: {navigation: NavigationProp<any>, route: string}): JSX.Element {
    return (
        <IconButton
            onPress={() => navigation.navigate(route)}
        iconName='plus'
        iconType="Feather"
        iconStyle={tailwind('text-primary-500')}
        iconSize={32}
        style={[tailwind('rounded-full h-20 w-20 bg-white flex items-center justify-center  absolute bottom-10 right-5'), {
            shadowOpacity: 0.1,
            shadowRadius: 12,
        }, Device.osName === 'Android' && {elevation: 5} ]}
        />
    )
}
