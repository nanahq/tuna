import {createStackNavigator} from "@react-navigation/stack";
import {tailwind} from "@tailwind";
import {HomeScreen} from '../Screens/Home.screen'

const HomeStack = createStackNavigator<any>();

export function HomeNavigator(): JSX.Element {

    return (
        <HomeStack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                headerTitleAlign: "center",
            }}
        >

            <HomeStack.Screen
                component={HomeScreen}
                name="PortfolioScreen"
                options={{
                    headerBackgroundContainerStyle: tailwind("overflow-hidden bg-brand-black-500 w-full h-24"),
                    // headerLeft: () => <HeaderSettingButton />,
                    headerLeftContainerStyle: tailwind("pl-5"),
                    // headerRight: () => (
                    //     <HeaderNetworkStatus onPress={goToNetworkSelect} />
                    // ),
                    headerTitle: () => <></>,
                }}
            />

        </HomeStack.Navigator>
    );
}
