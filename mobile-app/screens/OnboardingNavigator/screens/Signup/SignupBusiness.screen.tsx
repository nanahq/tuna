import React, {useEffect, useRef, useState} from 'react';
import {TextInput, View, ScrollView} from 'react-native';
import { tailwind } from '@tailwind';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GenericButton } from '@components/commons/buttons/GenericButton';
import { TextInputWithLabel } from '@components/commons/inputs/TextInputWithLabel';
import { TermsAndConditionsSection } from '@screens/OnboardingNavigator/screens/components/TermsAndConditionsPage';
import { WelcomeButtonSheet } from '@screens/OnboardingNavigator/screens/components/WelcomeBottomSheet';
import { LoginButtonWithText } from '@screens/OnboardingNavigator/screens/components/LoginButtonWithText';
import { useToast } from 'react-native-toast-notifications';
import { showTost } from '@components/commons/Toast';
import { OnboardingParamsList } from '@screens/OnboardingNavigator/OnboardingNav';
import { _api } from '@api/_request';
import {SignupProfileForm} from "@screens/OnboardingNavigator/screens/Signup/SignupProfile.screen";
import {useAnalytics} from "@segment/analytics-react-native";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

interface SignupBusinessForm {
    email: string;
    businessName: string;
    businessAddress: string;
}

interface SignupPayload extends Omit<SignupProfileForm, 'confirmPassword'> {
    email: string;
    businessName: string;
    businessAddress: string;
}

type SignupBusinessProps = StackScreenProps<OnboardingParamsList, any>;

export function SignupBusinessScreen({ route, navigation }: SignupBusinessProps): JSX.Element {
    const bottomSheetModalRef = useRef<any>(null);
    const [_loading, _setLoading] = useState<boolean>(false);
    const toast = useToast();
    const businessNameRef = useRef<TextInput>(null)
    const analytics = useAnalytics()
    const openModal = (): void => bottomSheetModalRef.current?.present();

    useEffect(() => {
        void analytics.screen(OnboardingScreenName.SIGN_UP_BUSINESS)
        const focusTextInput = setTimeout(() => {
            businessNameRef?.current?.focus();
        }, 500);
        return () => clearTimeout(focusTextInput);
    }, [])
    const [form, setForm] = useState<SignupBusinessForm>({
        businessAddress: '',
        email: '',
        businessName: '',
    });

    const [errors, setErrors] = useState<Record<keyof SignupBusinessForm, boolean>>({
        businessAddress: false,
        email: false,
        businessName: false,
    });

    function checkForErrors(): void {
        if (form.businessName === '') {
            setErrors((prev) => ({ ...prev, businessName: true }));
            return;
        }

        if (form.email === '') {
            setErrors((prev) => ({ ...prev, email: true }));
            return;
        }

        if (form.businessAddress === '') {
            setErrors((prev) => ({ ...prev, businessAddress: true }));
            return;
        }
    }

    async function onContinuePress(): Promise<void> {
        setErrors({
            businessAddress: false,
            email: false,
            businessName: false,
        });

        checkForErrors();

        try {
            _setLoading(true);
            await _api.requestData<SignupPayload>({
                method: 'POST',
                url: 'vendor/register',
                data: {
                    ...route.params as Omit<SignupProfileForm, 'confirmPassword'>,
                    ...form,
                },
            });

            void analytics.track('EVENT:SIGNUP', {
                email: form.email,
                business: form.businessName
            })
            navigation.navigate(OnboardingScreenName.WELCOME)
        } catch (error: any) {
            if (Number(error?.statusCode) === 500) {
                showTost(toast, 'Something went wrong. cannot create a new account', 'error');
            } else {
                showTost(toast, typeof error.message !== 'string' ? error.message[0] : error.message, 'error');
            }
        } finally {
            _setLoading(false);
        }
    }

    return (
        <SafeAreaView style={tailwind('flex-1 bg-white')}>
            <ScrollView style={tailwind('flex-1 px-5')}>
                    <View testID="SignupBusiness.View" style={tailwind('flex-col flex-grow')}>
                        <TextInputWithLabel
                            ref={businessNameRef}
                            defaultValue={form.businessName}
                            onChangeText={(value) => setForm((prev) => ({ ...prev, businessName: value }))}
                            error={errors.businessName}
                            errorMessage="Required"
                            label="What is the name of your restaurant/business?"
                            testID="SignupProfileScreen.FirstName.Input"
                            containerStyle={tailwind('mt-5')}
                            labelTestId="SignupProfileScreen.FirstName.Label"
                        />
                        <TextInputWithLabel
                            defaultValue={form.email}
                            onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))}
                            error={errors.email}
                            errorMessage="Required"
                            label="Email to receive business updates about your account"
                            testID="SignupProfileScreen.FirstName.Input"
                            containerStyle={tailwind('mt-5')}
                            labelTestId="SignupProfileScreen.FirstName.Label"
                        />
                        <TextInputWithLabel
                            defaultValue={form.businessAddress}
                            onChangeText={(value) => setForm((prev) => ({ ...prev, businessAddress: value }))}
                            error={errors.businessAddress}
                            errorMessage="Required"
                            label="Address of your business"
                            testID="SignupProfileScreen.FirstName.Input"
                            containerStyle={tailwind('mt-5')}
                            labelTestId="SignupProfileScreen.FirstName.Label"
                        />
                    </View>
                    <View style={tailwind('flex-1 mb-12')}>
                        <TermsAndConditionsSection />
                        <GenericButton
                            onPress={onContinuePress}
                            labelColor={tailwind('text-white')}
                            label={_loading ? 'Creating your account' : 'Create account'}
                            backgroundColor={tailwind('bg-primary-500')}
                            testId="OnboardingScreen.SignupBusinessScreen.ContinueButton"
                            loading={_loading}
                        />
                        {!_loading && <LoginButtonWithText style={tailwind('text-brand-black-500')} />}
                    </View>
            </ScrollView>
            <WelcomeButtonSheet promptModalName="WELCOME_MODAL" modalRef={bottomSheetModalRef} />
        </SafeAreaView>
    );
}
