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
import ConnectionBoundary from '@components/commons/ConnectionBoundary';
import { AppToast } from '@components/commons/AppToast';
import { ToastProps } from "react-native-toast-notifications/lib/typescript/toast";
import { ToastProvider } from "react-native-toast-notifications"

export default function App() {
  const isLoaded = useCachedResource()
 const logger = useLogger()


 // delay splash screen till cached resources are loaded
  if (!isLoaded) {
    setTimeout(() => {
        SplashScreen.preventAutoHideAsync().catch(logger.error);
    }, 2000)
    return null;
  }

  const customToast = {
    app_toast_success: (toast: ToastProps) => <AppToast  type="success" toast={toast} />,
    app_toast_error: (toast: ToastProps) => <AppToast type="error" toast={toast} />,
  };

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
                <ConnectionBoundary>
                   <GestureHandlerRootView
                       style={tailwind('flex-1')}
                   >
                       <BottomSheetModalProvider>
                          <ToastProvider renderType={customToast}>
                          <MainScreen />
                          </ToastProvider>
                       </BottomSheetModalProvider>
                   </GestureHandlerRootView>
                </ConnectionBoundary>
               </StoreProvider>
           </AuthPersistenceProvider>
       </ErrorBoundary>
    </NativeLoggingProvider>
  );
}
