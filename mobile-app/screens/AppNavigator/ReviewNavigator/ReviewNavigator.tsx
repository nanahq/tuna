import {createStackNavigator} from "@react-navigation/stack";
import {tailwind} from "@tailwind";
import {ReviewsScreenName} from "@screens/AppNavigator/ReviewNavigator/ReviewsScreenName.enum";
import {ReviewScreen} from "@screens/AppNavigator/ReviewNavigator/screen/ReviewScreen";

export interface ReviewsParamList {
    GetReview: {
        reviewId: string
    } | undefined,

    [key: string]: undefined | object;
}

const ReviewStack = createStackNavigator<ReviewsParamList>();

export function ReviewNavigator(): JSX.Element {
    return (
        <ReviewStack.Navigator
            initialRouteName={ReviewsScreenName.REVIEWS}
            screenOptions={{
                headerShown: true,
            }}
        >
            <ReviewStack.Screen
                component={ReviewScreen}
                name={ReviewsScreenName.REVIEWS}
                options={{
                    headerShown: true,
                    headerTitle: "Reviews and ratings"
                }}
            />
            <ReviewStack.Screen
                component={ReviewScreen}
                name={ReviewsScreenName.GET_REVIEW}
                options={{
                    headerTitleStyle: tailwind('hidden'),
                    headerShown: true,
                }}
            />
        </ReviewStack.Navigator>
    )
}
