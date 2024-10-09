import { tailwind } from '@tailwind';
import {View, Text} from 'react-native'
import { ToastProps } from "react-native-toast-notifications/lib/typescript/toast";
import { IconComponent } from './IconComponent';
interface AppToastProps {
    toast: ToastProps;
    type: "success" | "error" | "warning"
  }

export function AppToast (props: AppToastProps): JSX.Element {
    return  (
        <View style={tailwind('py-4 w-3/4 px-4 mt-16 rounded-lg flex items-center justify-center', {
            'bg-primary-100': props.type === 'success',
            'bg-nana-red': props.type === 'error',
            'bg-nana-yellow': props.type === 'warning'
        })}>
           <View style={tailwind('flex flex-row w-full items-center justify-center')}>
           <Text style={tailwind('text-sm  text-white')}>{props.toast.message as string}</Text>
           <IconComponent iconType='Feather' name={ props.type === 'success' ? 'check-circle' : 'alert-circle'} style={tailwind('text-white ml-2')}  size={14} />
           </View>
        </View>
    )
}
