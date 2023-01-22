import {KeyboardType, StyleProp, TextInput, TextInputProps, View, ViewProps} from 'react-native'
import {tailwind} from '@tailwind'

interface TextAreaProps {
    style?: StyleProp<TextInputProps>
    testID: string
    onChangeText: (e: any) => void
    initialText: string
    placeholder: string
    placeHolderStyle?: string
    containerStyle?: StyleProp<ViewProps>
    keyboardPad?: KeyboardType
    textAlign?:  any
}

export function TextArea ( props: TextAreaProps):JSX.Element {
    const {
        placeHolderStyle,
        containerStyle,
        keyboardPad = 'default',
        style,
        ...otherProps
    } = props
    return (
        <View style={[tailwind(), containerStyle]}>
            <TextInput
            keyboardType={keyboardPad}
            style={[tailwind('py-3 px-2.5 flex items-center'), style]}
            placeholderTextColor={placeHolderStyle}
            {...otherProps}
            />
        </View>
    )
}
