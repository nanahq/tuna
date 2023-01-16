import {tailwind} from "@tailwind";
import {View} from "react-native";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {ScrolledView} from "@components/views/ScrolledView";
import {useState} from "react";


export interface AccountProfile {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    password: string
    confirmPassword: string
}

export function AccountProfile (): JSX.Element {
    const [form, setForm] = useState<AccountProfile>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    function onChange (name: string, value: string): void {
        setForm((prevState) => ({...prevState, [name]: value}))
    }
    return (
        <ScrolledView testId="SignupProfileScreen.View" style={[tailwind('flex w-full px-5')]}>
            <View style={tailwind('flex flex-row items-center justify-between w-full mt-10')}>
                <TextInputWithLabel

                    label='First Name'
                    testID='SignupProfileScreen.FirstName.Input'
                    style={{
                        width: 160
                    }}
                    labelTestId="SignupProfileScreen.FirstName.Label"
                    value={form.firstName}
                    onChangeText={(value) => onChange('firstName', value)}
                />
                <TextInputWithLabel
                    label='Last Name'
                    testID='SignupProfileScreen.LastName.Input'
                    labelTestId="SignupProfileScreen.LastName.Label"
                    style={{
                        width: 160
                    }}
                    value={form.lastName}
                    onChangeText={(value) => onChange('lastName', value)}
                />
            </View>
            <TextInputWithLabel
                label='Phone Number'
                testID='SignupProfileScreen.PhoneNumber.Input'
                labelTestId="SignupProfileScreen.PhoneNumber.Label"
                containerStyle={tailwind('w-full mt-5')}
                value={form.phoneNumber}
                onChangeText={(value) => onChange('phoneNumber', value)}

            />
            <TextInputWithLabel
                label='Email'
                testID='SignupProfileScreen.Email.Input'
                labelTestId="SignupProfileScreen.Email.Label"
                containerStyle={tailwind('w-full mt-5')}
                value={form.email}
                onChangeText={(value) => onChange('email', value)}

            />
            <TextInputWithLabel
                label='Password'
                testID='SignupProfileScreen.Password.Input'
                labelTestId="SignupProfileScreen.Password.Label"
                containerStyle={tailwind('w-full mt-5')}
                value={form.password}
                onChangeText={(value) => onChange('password', value)}

            />
            <TextInputWithLabel
                label='Confirm Password'
                testID='SignupProfileScreen.ConfirmPassword.Input'
                labelTestId="SignupProfileScreen.ConfirmPassword.Label"
                containerStyle={tailwind('w-full mt-5')}
                value={form.confirmPassword}
                onChangeText={(value) => {
                    onChange('confirmPassword', value)
                }}
            />
        </ScrolledView>
    )
}
