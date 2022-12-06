import {StyleProp, Text, TextInput, TextInputProps, View} from 'react-native'
import {tailwind} from "@tailwind";
import {forwardRef} from 'react'

interface TextInputWithLabelProps extends  TextInputProps {
    labelStyle?:StyleProp<TextInputProps>
    containerStyle?:StyleProp<TextInputProps>
    label: string
    labelTestId: string
}

export const  TextInputWithLabel =  forwardRef<any, TextInputWithLabelProps>(
    (props: TextInputWithLabelProps, ref): JSX.Element => {
        const {
            labelStyle,
            label,
            labelTestId,
            containerStyle,
            style,
            ...rest
        } = props
        return (
            <View style={[tailwind('flex flex-col'), containerStyle]}>
                <Text
                    testID={labelTestId}
                    style={[tailwind('mb-2.5 font-medium text-sm text-brand-black-500'), labelStyle]}>{
                    label}
                </Text>
                <TextInput
                    ref={ref}
                    style={[tailwind('rounded-lg bg-brand-blue-200 py-3.5 px-3'), style]}
                    {...rest}
                />
            </View>
        )
    }
)
