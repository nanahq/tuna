import { useNetInfo, fetch } from "@react-native-community/netinfo";
import { View, Image, Text } from "react-native";
import ImageConnectionProblem from "@assets/images/misc/connection_problem.png";
import { tailwind } from "@tailwind";
import Lottie from 'lottie-react-native'
import Animation from '@assets/app/12701-no-internet-connection.json'
import { IconButton } from "./buttons/IconButton";

export default function ConnectionBoundary(
  props: React.PropsWithChildren<any>
): JSX.Element | null {
  const netInfo = useNetInfo();
  const noConnection = (): boolean => {
    return netInfo.isConnected === false;
  };

  return noConnection() ? <ConnectionErrorComponent /> : props.children;
}

function ConnectionErrorComponent(): JSX.Element {
  const checkConnectivity = (): void => {
    void fetch();
  };
  return (
    <View style={tailwind('flex-1 bg-white flex-col items-center justify-center')}>
         <Lottie
                style={{
                    width: 300,
                    height: 300
                }}
                source={Animation}
                  autoPlay
                   loop
                    />
                    <IconButton 
                    onPress={checkConnectivity}
                    iconType="Feather"
                    iconSize={28}
                    iconLabel="retry"
                        iconName="rotate-ccw"
                  />
    </View>
  );
}
