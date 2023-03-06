import Toast  from "react-native-toast-message";
export const ShowToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
        type: type,
        text1: message,
        autoHide: true
    });
}