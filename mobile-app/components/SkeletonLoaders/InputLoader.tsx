import ContentLoader, {IContentLoaderProps, Rect} from "react-content-loader/native";
import * as React from "react";
import { View} from 'react-native'


export function InputLoaderFull (
    props: JSX.IntrinsicAttributes &
        IContentLoaderProps & { children?: React.ReactNode }
): JSX.Element {
    return (

        <ContentLoader
            width={375}
            height={40}
            viewBox="0 0 375 40"
            backgroundColor="#ecebeb"
            foregroundColor="#4a4a4a"
            {...props}
        >
            <Rect x="0" y="0" rx="2" ry="2" width="40" height="40" />
            <Rect x="150" y="0" rx="2" ry="2" width="40" height="40" />
            <Rect x="300" y="0" rx="2" ry="2" width="40" height="40" />
        </ContentLoader>
    )
}

export function AccountSettingsLoaderScreen (): JSX.Element {
    return (
        <View>
                <InputLoaderFull />
        </View>
    )
}