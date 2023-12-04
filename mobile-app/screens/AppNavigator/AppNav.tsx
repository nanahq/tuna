import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {AppLinking, BottomTabNavigator} from "@screens/AppNavigator/BottomNavigator";
import * as Linking from "expo-linking"
import {useEffect, useRef, useState} from "react";
import {fetchProfile, fetchUserSubscription, updateUserProfile} from "@store/profile.reducer";
import {fetchOrders} from "@store/orders.reducer";
import { useAppDispatch} from "@store/index";
import {fetchAllListings} from "@store/listings.reducer";
import { fetchWallet } from "@store/wallet.reducer";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device'
import {Notification} from "expo-notifications";
import {fetchDeliveries} from "@store/delivery.reducer";
import {ModalScreenName} from "@screens/AppNavigator/ModalNavigator/ModalScreenName";
import {AddBankAccontScreen} from "@screens/AppNavigator/ModalNavigator/AddBankAccont.Screen";
import Constants from "expo-constants";
import {AddOptionModal} from "@screens/AppNavigator/ModalNavigator/AddOptionNavigator";

const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    App: undefined
    [ModalScreenName.ADD_BANK_ACCOUNT_SCREEN]: {
        callback?: () => void
    }

    [ModalScreenName.ADD_OPTION_SCREEN]: {
        callback?: () => void
    }
    [key: string]: undefined | Object
}


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

if (Device.osName === 'Android') {
    void Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
    });
}

export function AppNavigator(): JSX.Element {
    const [notification, setNotification] = useState<Notification | undefined>(undefined);
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const isAndroid = Device.osName === 'Android'

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            dispatch(updateUserProfile({expoNotificationToken: token}))
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchProfile() as any)
        dispatch(fetchOrders() as any)
        dispatch(fetchAllListings())
        dispatch(fetchWallet())
        dispatch(fetchDeliveries())
        dispatch(fetchUserSubscription() as any)
    }, [])

    return (
        <NavigationContainer linking={LinkingConfiguration}>
            <App.Navigator   screenOptions={{ headerShown: false}}>
                <App.Group screenOptions={{
                    cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forRevealFromBottomAndroid : CardStyleInterpolators.forHorizontalIOS,
                    cardShadowEnabled: true,
                    cardOverlayEnabled: true,
                    animationEnabled: true,
                }}>
                    <App.Screen component={BottomTabNavigator} name="App" />
                </App.Group>
                <App.Group
                    screenOptions={{
                        headerShown: false,
                        presentation: 'modal',
                        cardShadowEnabled: true,
                        cardOverlayEnabled: true,
                        animationEnabled: true,
                    }}
                >
                    <App.Screen
                        name={ModalScreenName.ADD_BANK_ACCOUNT_SCREEN}
                        component={AddBankAccontScreen}
                    />

                    <App.Screen
                        name={ModalScreenName.ADD_OPTION_SCREEN}
                        component={AddOptionModal}
                    />
                </App.Group>
            </App.Navigator>
        </NavigationContainer>
    );
}

const LinkingConfiguration: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [Linking.createURL("/")],
    config: {
        screens: {
            App: {
                path: "app",
                screens: AppLinking,
            }
        },
    },
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Device.osName === 'Android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants?.expoConfig?.extra?.eas?.projectId})).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
