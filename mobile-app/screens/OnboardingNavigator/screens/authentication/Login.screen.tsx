import {Image, Text, View} from 'react-native'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import AppLogo from '@assets/onboarding/app-logo.png'
import {tailwind} from "@tailwind";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useState} from "react";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Device from "expo-device";
import {_api} from "@api/_request";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {cookieParser} from '../../../../../utils/cookieParser';
import {LogoutButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import Toast from "react-native-toast-message";


interface LoginForm {
    phoneNumber: string
    password: string
}
export function LoginScreen (): JSX.Element {
    const {setToken} = useAuthPersistence()
    const {top: topInsert} = useSafeAreaInsets()

    const [_hasError, _setHasError] = useState<boolean>(false)
    const [_loading, _setLoading] = useState<boolean>(false)
    const [_errorMessage, _setErrorMessage] = useState<string | Array<string> | null>(null)

    const [form, setForm] = useState<LoginForm>({
      phoneNumber: '',
        password: ''
    })

    function onChange (name: string, value: string): void {
        setForm((prevState) => ({...prevState, [name]: value}))
    }

    function checkNullState (): boolean {
        const isValidForm: boolean[] = []

        Object.keys(form).forEach((formItem) => {
            // @ts-ignore
            if (formItem in form && form[formItem].length > 1) {
                isValidForm.push(true)
            } else {
                isValidForm.push(false)
            }
        })

        return isValidForm.some(state => !state)
    }
    async function onContinuePress (): Promise<void> {
        try {
            _setHasError(false)
            _setErrorMessage('')
            _setLoading(true)
           const {cookies} = await _api.requestData<LoginForm>({
                method: 'POST',
                url: 'auth/login',
                data: form
            })
            await  setToken(cookieParser(cookies[0]))
        } catch (error: any) {
            _setHasError(true)
            if (Number(error.statusCode) === 500) {
               Toast.show({
                   type: 'error',
                   text1: 'Something went wrong. Login failed',
                   autoHide: true,
               })
            } else {
                Toast.show({
                    type: 'error',
                    text1: typeof error.message !== 'string' ? error.message[0] : error.message,
                    autoHide: true,
                })
            }
        } finally {
            _setLoading(false)
        }
    }
    return (
        <View
            style={{padding: 20, paddingTop: topInsert + 28}}
        >
            <View testID="LoginScreen.Image" style={tailwind('flex flex-row w-full justify-center')}>
                <Image source={AppLogo} style={tailwind('w-14  h-14 rounded-lg')} />
            </View>
            <View style={tailwind('mt-20')}>
                <Text testID="LoginScreen.WelcomeText" style={tailwind('font-semibold text-xl text-brand-black-500 mb-16')}>Welcome back</Text>
                <TextInputWithLabel
                    label="Phone number"
                    labelTestId="LoginScreen.Phone.Label"
                    testID="LoginScreen.Phone.Input"
                    containerStyle={tailwind('w-full mb-4')}
                    onChangeText={value => onChange('phoneNumber', value)}
                    onChange={() => _setHasError(false)}
                    placeholder='080 000 000 00'
                />

                <TextInputWithLabel
                    label="Password"
                    labelTestId="LoginScreen.Password.Label"
                    testID="LoginScreen.Phone.Password"
                    containerStyle={tailwind('w-full mb-20')}
                    onChangeText={value => onChange('password', value)}
                    secureTextEntry={true}
                />

                <GenericButton
                    style={tailwind({
                        'mt-10': Device.osName === 'Android',
                        'mt-20': Device.osName === 'iOS'
                    })}
                    onPress={onContinuePress}
                    labelColor={tailwind('text-white')}
                    label={_loading ? 'Login in...' : 'Log in'}
                    backgroundColor={tailwind('bg-brand-black-500')}
                    testId="LoginScreen.LoginButton"
                    disabled={checkNullState()}
                    loading={_loading}
                />

            </View>
            <LogoutButtonWithText style={tailwind('text-brand-black-500 font-semibold')} />
        </View>
    )
}
