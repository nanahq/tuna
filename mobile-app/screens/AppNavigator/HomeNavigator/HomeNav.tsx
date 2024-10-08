import {createStackNavigator} from "@react-navigation/stack";
import {tailwind} from "@tailwind";
import {HomeScreen} from "@screens/AppNavigator/HomeNavigator/Screens/Home.screen";
import {HeaderLogoutButton} from "@screens/AppNavigator/HomeNavigator/Components/HeaderLogoutButton";
import * as Device from 'expo-device'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {HeaderProfileOverview} from "@screens/AppNavigator/HomeNavigator/Components/HeaderProfileOverview";

const HomeStack = createStackNavigator<any>();

export function HomeNavigator(): JSX.Element {
    const insets = useSafeAreaInsets();
    return (
        <HomeStack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                headerTitleAlign: "center",
            }}
        >

            <HomeStack.Screen
                component={HomeScreen}
                name="HomeScreen"
                options={{
                    headerTitleAlign: 'left',
                    headerBackTitleVisible: false,
                    headerRightContainerStyle: tailwind("pr-5"),
                    headerLeftContainerStyle: tailwind("pl-5 relative right-2"),
                    headerStyle: [tailwind('bg-white border-b-0.5 border-brand-black-500'), {
                        height: (Device.osName !== "Android" ? 100 : 118) + insets.top,
                        shadowOpacity: 0,
                    }],
                    headerBackgroundContainerStyle: tailwind("overflow-hidden"),
                    headerRight: () => <HeaderLogoutButton />,
                    headerLeft: () => <HeaderProfileOverview />,
                    headerTitle: () => <></>
                }}
            />

        </HomeStack.Navigator>
    );
}
