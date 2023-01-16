import * as SplashScreen from 'expo-splash-screen'
import {MainScreen} from "@screens/Main";
import {useCachedResource} from "@hooks/useCachedResource";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {tailwind} from "@tailwind";
import {NativeLoggingProvider, useLogger} from "@contexts/NativeLoggingProvider";
import {AuthPersistenceProvider} from "@contexts/AuthPersistenceProvider";
import {persistence} from "@api/persistence";
import ErrorBoundary from "@screens/ErrorBoundary/ErrorBoundary";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {StoreProvider} from "@store/StoreProvider";

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
       <ErrorBoundary>
           <AuthPersistenceProvider
               api={{
                  get: persistence.getSecure,
                   set: persistence.setSecure,
                   delete: persistence.deleteSecure
               }}
           >
               <StoreProvider>
                   <GestureHandlerRootView
                       style={tailwind('flex-1')}
                   >
                       <BottomSheetModalProvider>
                           <MainScreen />
                       </BottomSheetModalProvider>
                   </GestureHandlerRootView>
               </StoreProvider>
           </AuthPersistenceProvider>
       </ErrorBoundary>
    </NativeLoggingProvider>
  );
}
