import * as SplashScreen from 'expo-splash-screen'
import {MainScreen} from "@screens/Main";
import {useCachedResource} from "@hooks/useCachedResource";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {tailwind} from "@tailwind";
import {NativeLoggingProvider, useLogger} from "@contexts/NativeLoggingProvider";

export default function App() {
  const isLoaded = useCachedResource()
   const logger = useLogger()


   // delay splashscreen till cached resources are loaded
  if(!isLoaded) {
    SplashScreen.preventAutoHideAsync().catch(logger.error);
    return null;
  }

  return (
    <NativeLoggingProvider>
        <GestureHandlerRootView
            style={tailwind('flex-1')}
        >
            <MainScreen />
        </GestureHandlerRootView>
    </NativeLoggingProvider>
  );
}
