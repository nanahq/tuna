import {StyleProp, Text, TextInput, TextInputProps, View} from 'react-native'
import {tailwind} from "@tailwind";
import {forwardRef, useState} from 'react'
import * as Device from 'expo-device'

export interface TextInputWithLabelProps extends TextInputProps {
    labelStyle?:StyleProp<TextInputProps>
    containerStyle?:StyleProp<TextInputProps>
    label: string
    labelTestId: string
    moreInfo?: string
}

export const  TextInputWithLabel =  forwardRef<any, TextInputWithLabelProps>(
    (props: TextInputWithLabelProps, ref): JSX.Element => {
        const {
            moreInfo,
            labelStyle,
            label,
            labelTestId,
            containerStyle,
            style,
            ...rest
        } = props

        const [inputFocus, setInputFocus] = useState<boolean>(false)

        return (
            <View style={[tailwind('flex flex-col'), containerStyle]}>
                <View style={tailwind('flex flex-col mb-2.5 w-full ')}>
                    <Text
                        testID={labelTestId}
                        style={[tailwind('font-medium text-sm text-brand-black-500'), labelStyle]}>
                        {label}
                    </Text>
                    {moreInfo !== undefined && (
                        <Text
                            testID={labelTestId}
                            style={[tailwind('font-normal text-xs text-brand-gray-700'), labelStyle]}>
                            {moreInfo}
                        </Text>
                    )}
                </View>
                <TextInput
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    ref={ref}
                    style={[tailwind('rounded-lg bg-brand-blue-200 py-3.5 px-3 font-medium text-lg text-brand-black-500', {
                        'text-base': Device.osName === 'iOS',
                        'border-0.5 border-brand-black-500': inputFocus
                    }), style]}
                    {...rest}
                />
            </View>
        )
    }
)
