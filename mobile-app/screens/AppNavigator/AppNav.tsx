import {createStackNavigator} from "@react-navigation/stack";
import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {AppLinking, BottomTabNavigator} from "@screens/AppNavigator/BottomNavigator";
import * as Linking from "expo-linking"
import {useEffect, useRef, useState} from "react";
import {fetchProfile, updateUserProfile} from "@store/profile.reducer";
import {fetchOrders} from "@store/orders.reducer";
import { useAppDispatch} from "@store/index";
import {fetchAllListings} from "@store/listings.reducer";
import { fetchWallet } from "@store/wallet.reducer";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device'
import {Notification} from "expo-notifications";
import Constants from "expo-constants";

const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    App: undefined
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


    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            dispatch(updateUserProfile({expoNotificationToken: token}))
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log({notification})
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
    }, [])



    return (
        <NavigationContainer linking={LinkingConfiguration}>
            <App.Navigator   screenOptions={{ headerShown: false}}>
                <App.Screen component={BottomTabNavigator} name="App" />
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
