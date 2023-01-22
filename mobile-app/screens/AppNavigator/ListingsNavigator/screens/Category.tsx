import {ScrollView} from 'react-native'
import {tailwind} from '@tailwind'
import {EmptyMenu} from "@components/Empty/Listings";
import {CategoryCard} from "@screens/AppNavigator/ListingsNavigator/screens/components/CategoryCard";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";

export function ListingsCategory (props: {categories: any[]}): JSX.Element {
    const navigation  = useNavigation<NavigationProp<ListingsParams>>()

    function onPress (catId: string): void {
        navigation.navigate("AddCategory",{catId})
    }
    if (props.categories.length <= 0) {
        return (
            <EmptyMenu type='CATEGORY' title="Category" subtitle='Create categories and add them to your menus eg. African Cuisine' />
        )
    }
    return (
        <ScrollView style={tailwind('py-4 px-3')}>
            {props.categories.map((cat => (
                <CategoryCard onPress={() => onPress('id')} name='African Cuisine' isLive menuCount={3} />
            )))}
        </ScrollView>
    )
}
