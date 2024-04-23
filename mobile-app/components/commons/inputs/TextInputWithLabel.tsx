import {StyleProp, Text, TextInput, TextInputProps, View, ViewStyle} from 'react-native'
import {getColor, tailwind} from "@tailwind";
import {forwardRef, PropsWithChildren, useState} from 'react'
import * as Device from 'expo-device'
import {BottomSheetTextInputProps} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import {BottomSheetTextInput} from "@gorhom/bottom-sheet";

export interface TextInputWithLabelProps extends TextInputProps {
    labelStyle?:StyleProp<TextInputProps>
    containerStyle?:StyleProp<ViewStyle>
    label: string
    labelTestId: string
    moreInfo?: string,

    error?: boolean

    errorMessage?: string
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
            error,
            errorMessage,
            ...rest
        } = props

        const [inputFocus, setInputFocus] = useState<boolean>(false)

        return (
            <View style={[tailwind('flex flex-col'), containerStyle as any]}>
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
                    returnKeyType='done'
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    placeholderTextColor={props.placeholderTextColor ?? getColor('brand-gray-800')}
                    ref={ref}
                    style={[tailwind('rounded-lg border-1.5 border-gray-200  flex w-full items-center px-3 py-3 font-medium  text-lg text-brand-black-500', {
                        'text-base': Device.osName === 'iOS',
                        'border-1.5 border-primary-100': inputFocus
                    }), {
                        height: 50,
                        lineHeight: 15
                    } ,style]}
                    {...rest}
                />
                {errorMessage !== undefined && <FieldErrorText>{error ? errorMessage : ''}</FieldErrorText>}
            </View>
        )
    }
)

export interface ModalTextInputProps extends BottomSheetTextInputProps {
    labelStyle?:StyleProp<TextInputProps>
    containerStyle?:StyleProp<TextInputProps>
    label: string
    labelTestId: string
    moreInfo?: string
    placeholderTextColor?: string
}


export function ModalTextInput (props: ModalTextInputProps): JSX.Element {
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
        <View style={[tailwind('flex flex-col'), containerStyle as any]}>
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
            <BottomSheetTextInput
                placeholderTextColor={props.placeholderTextColor ?? getColor('brand-gray-800')}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                style={[tailwind('rounded-lg bg-primary-200 py-3.5 px-3 font-medium text-lg text-brand-black-500', {
                    'text-base': Device.osName === 'iOS',
                    'border-0.5 border-brand-black-500': inputFocus
                }),{lineHeight: 15, height: 50}, style]}
                {...rest}
            />
        </View>
    )
}

function FieldErrorText (props: PropsWithChildren<{}>): JSX.Element {
    return (
        <Text style={tailwind('text-xs text-red-500')}>
            {props.children}
        </Text>
    )
}
