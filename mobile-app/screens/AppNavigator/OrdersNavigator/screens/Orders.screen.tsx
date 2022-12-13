import {SafeAreaView} from "react-native-safe-area-context";
import {tailwind} from '@tailwind'
import {OrdersStats} from "@screens/AppNavigator/OrdersNavigator/components/OrdersStats";
import {OrderCategory} from "@screens/AppNavigator/OrdersNavigator/components/OrderCatergory";
import {ScrolledView} from "@components/views/ScrolledView";

export function OrdersScreen (): JSX.Element {
    return (
        <SafeAreaView
            style={tailwind('w-full bg-white h-full flex-col flex pb-5')}
        >
            <ScrolledView testId="OrdersScreen" style={[tailwind('px-3.5 py-5')]}>
                <OrdersStats completed={1000} cancelled={200} pending={6} />
                <OrderCategory
                    type='PENDING'
                    testId='OrdersScreen.OrderCategory.PENDING'
                />
                <OrderCategory
                    type='DELIVERED'
                    testId='OrdersScreen.OrderCategory.DELIVERED'
                />
            </ScrolledView>
        </SafeAreaView>
    )
}
