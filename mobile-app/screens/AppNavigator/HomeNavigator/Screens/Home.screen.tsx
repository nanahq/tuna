import {Text, View} from 'react-native'
import {tailwind} from "@tailwind";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import {useLogger} from "@contexts/NativeLoggingProvider";
import {HeaderLogoutButton} from "@screens/AppNavigator/HomeNavigator/Components/HeaderLogoutButton";

export function HomeScreen (): JSX.Element {
    const logger = useLogger()
    // Hide splashscreen when first page is loaded to prevent white screen
    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
    }, []);
    return (
        <View style={tailwind('bg-white h-full')}>
            <Text>Home</Text>
            <HeaderLogoutButton />
        </View>
    )
}
