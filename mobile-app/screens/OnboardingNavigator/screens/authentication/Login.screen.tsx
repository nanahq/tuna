import {Image, Text, View} from 'react-native'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import AppLogo from '@assets/onboarding/app-logo.png'
import {tailwind} from "@tailwind";
import {useState} from "react";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Device from "expo-device";
import {_api} from "@api/_request";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {LogoutButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import Toast from "react-native-toast-message";
import {ControlledTextInputWithLabel} from "@components/commons/inputs/ControlledTextInput";
import {useForm} from "react-hook-form";
import {cookieParser} from '../../../../../utils/cookieParser';


interface LoginForm {
    email: string
    password: string
}
export function LoginScreen (): JSX.Element {
    const {setToken} = useAuthPersistence()
    const {top: topInsert} = useSafeAreaInsets()

    const [_loading, _setLoading] = useState<boolean>(false)
    

// form
    const {control, formState: {errors}, handleSubmit} = useForm<LoginForm>({
        criteriaMode: 'all',
        mode: 'onTouched'
    })

    async function onContinuePress (data: LoginForm): Promise<void> {
        try {
            _setLoading(true)
           const {cookies} = await _api.requestData<LoginForm>({
                method: 'POST',
                url: 'auth/login',
                data: data
            })
            await  setToken(cookieParser(cookies[0]))
        } catch (error: any) {
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
            <View style={tailwind('mt-10')}>
                <Text testID="LoginScreen.WelcomeText" style={tailwind('font-semibold text-xl text-brand-black-500 mb-5')}>Welcome back</Text>
                <ControlledTextInputWithLabel
                    label="Email"
                    labelTestId="LoginScreen.Phone.Label"
                    testID="LoginScreen.Phone.Input"
                    containerStyle={tailwind('w-full mb-4')}
                    placeholder='your@email.com'
                    name='email'
                    control={control}
                    rules={{required: {
                            value: true,
                            message: "Required"
                        }}}
                    error={errors.email !== undefined}
                    errorMessage={errors.email?.message}
                />

                <ControlledTextInputWithLabel
                    label="Password"
                    labelTestId="LoginScreen.Password.Label"
                    testID="LoginScreen.Phone.Password"
                    containerStyle={tailwind('w-full mb-20')}
                    name="password"
                    control={control}
                    rules={{required: {
                            value: true,
                            message: "Required"
                        }}}
                    error={errors.password !== undefined}
                    errorMessage={errors.password?.message}
                    secureTextEntry
                />

                <GenericButton
                    style={tailwind({
                        'mt-1': Device.osName === 'Android',
                        'mt-2': Device.osName === 'iOS'
                    })}
                    onPress={handleSubmit(onContinuePress)}
                    labelColor={tailwind('text-white')}
                    label={_loading ? 'Login in...' : 'Log in'}
                    backgroundColor={tailwind('bg-brand-black-500')}
                    testId="LoginScreen.LoginButton"
                    loading={_loading}
                />

            </View>
            <LogoutButtonWithText style={tailwind('text-primary-700 font-semibold')} />
        </View>
    )
}
