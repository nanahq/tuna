import * as SplashScreen from 'expo-splash-screen'
import {MainScreen} from "@screens/Main";
import {useCachedResource} from "@hooks/useCachedResource";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {tailwind} from "@tailwind";
import {NativeLoggingProvider, useLogger} from "@contexts/NativeLoggingProvider";
import {AuthPersistenceProvider} from "@contexts/AuthPersistenceProvider";
import {persistence} from "@api/persistence";

export default function App() {
  const isLoaded = useCachedResource()
   const logger = useLogger()


   // delay splashscreen till cached resources are loaded
  if (!isLoaded) {
    SplashScreen.preventAutoHideAsync().catch(logger.error);
    return null;
  }

  return (
    <NativeLoggingProvider>
       <AuthPersistenceProvider
           api={{
               ...persistence
           }}
       >
           <GestureHandlerRootView
               style={tailwind('flex-1')}
           >
               <MainScreen />
           </GestureHandlerRootView>
       </AuthPersistenceProvider>
    </NativeLoggingProvider>
  );
}
