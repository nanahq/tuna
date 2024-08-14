import {Image, SafeAreaView, Text, View} from 'react-native'
import AppLogo from '@assets/onboarding/nana-logo.png'
import {tailwind} from "@tailwind";
import {useEffect, useState} from "react";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Device from "expo-device";
import {_api} from "@api/_request";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {LogoutButtonWithText} from "@screens/OnboardingNavigator/screens/components/LoginButtonWithText";
import {cookieParser} from '../../../../../utils/cookieParser';
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useAnalytics} from "@segment/analytics-react-native";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

interface LoginForm {
    email: string
    password: string
}
export function LoginScreen (): JSX.Element {
    const {setToken} = useAuthPersistence()

    const [_loading, _setLoading] = useState<boolean>(false)

    const toast = useToast()
    const analytics = useAnalytics()

    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: ''
    })

    const [error,setError] = useState<Record<keyof LoginForm , boolean>>({
        email: false,
        password: false
    })


    useEffect(() => {
        void analytics.screen(OnboardingScreenName.LOGIN)
    }, [])

    const checkForm = (): void => {
        if(form.email === '') {
            setError(prev => ({...prev, email: true}))
            return
        }

        if(form.password === '') {
            setError(prev => ({...prev, password: true}))
            return
        }
    }

    async function onContinuePress (): Promise<void> {
        setError({
            email: false,
            password: false
        })
        checkForm()
        try {
            _setLoading(true)
           const {cookies} = await _api.requestData<LoginForm>({
                method: 'POST',
                url: 'auth/login',
                data: {...form, email: form.email.toLowerCase()}
            })
            await  setToken(cookieParser(cookies[0]))
            await analytics.track('EVENT:LOGIN', {
                email: form.email.toLowerCase()
            })
        } catch (error: any) {
            if (Number(error?.statusCode) === 500) {
                showTost(toast,'Can not login at this time. Try again in a bit', 'error')
            } else {
                showTost(toast,typeof error.message !== 'string' ? error.message[0] : error.message, 'error')
            }
        } finally {
            _setLoading(false)
        }
    }
    return (
        <SafeAreaView style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('flex flex-col px-5 py-3')}>
                <View testID="LoginScreen.Image" style={tailwind('flex flex-row w-full justify-center')}>
                    <Image source={AppLogo} resizeMode="contain" style={tailwind('w-24 h-24 rounded-lg')} />
                </View>
                <View style={tailwind('mt-2')}>
                    <TextInputWithLabel
                        placeholder="Email"
                        defaultValue={form.email}
                        onChangeText={(value) => setForm((prev) => ({...prev, email: value}))}
                        error={error.email}
                        errorMessage="Required"
                        label='Business Email'
                        keyboardType="email-address"
                        testID='SignupProfileScreen.FirstName.Input'
                        containerStyle={tailwind('mt-5')}
                        labelTestId="SignupProfileScreen.FirstName.Label"
                    />
                    <TextInputWithLabel
                        placeholder="Password"
                        defaultValue={form.password}
                        onChangeText={(value) => setForm((prev) => ({...prev, password: value}))}
                        error={error.password}
                        errorMessage="Required"
                        label='Password'
                        testID='SignupProfileScreen.FirstName.Input'
                        containerStyle={tailwind('mt-5')}
                        labelTestId="SignupProfileScreen.FirstName.Label"
                        secureTextEntry={true as any}
                    />

                    <GenericButton
                        style={tailwind({
                            'mt-1': Device.osName === 'Android',
                            'mt-2': Device.osName === 'iOS'
                        })}
                        onPress={onContinuePress}
                        labelColor={tailwind('text-white')}
                        label="Log in"
                        backgroundColor={tailwind('bg-primary-500')}
                        testId="LoginScreen.LoginButton"
                        loading={_loading}
                    />

                </View>
                <LogoutButtonWithText style={tailwind('text-brand-black-500')} />
            </View>
        </SafeAreaView>
    )
}
