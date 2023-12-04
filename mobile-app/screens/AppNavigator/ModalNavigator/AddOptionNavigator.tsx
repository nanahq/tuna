import {View, Text, TextInput} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {ModalScreenName} from "@screens/AppNavigator/ModalNavigator/ModalScreenName";
import React, {useEffect, useState} from "react";
import {tailwind} from "@tailwind";
import {ModalBackIcon} from "@screens/AppNavigator/ModalNavigator/components/ModalCloseIcon";
import {Picker} from "@react-native-picker/picker";
import {_api} from "@api/_request";
import {LoaderComponent, LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {fetchProfile} from "@store/profile.reducer";
import {useAppDispatch, useAppSelector} from "@store/index";

type BankAccountModalProps = StackScreenProps<AppParamList, ModalScreenName.ADD_OPTION_SCREEN>

export const AddOptionModal: React.FC<BankAccountModalProps> = ({navigation, route}) => {
    const {profile} = useAppSelector(state => state.profile)

    const [loading, setLoading] = useState(true)

    const toast = useToast()
    const dispatch = useAppDispatch()
    const handleClose = () => {
        if(route.params?.callback !== undefined) {
            route.params.callback()
        } else {
            navigation.goBack()
        }
    }
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Add Menu Option',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            headerStyle:  {
                shadowOpacity: 8,
                shadowRadius: 12,
            },
            headerLeft: () => <ModalBackIcon onPress={handleClose} />,
        })
    }, [])


    if(loading) {
        return <LoaderComponentScreen />
    }
    return (
        <View style={tailwind('flex-1 bg-white py-5  px-5')}>
        </View>
    )
}

