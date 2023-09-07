import { View} from 'react-native'
import {tailwind} from '@tailwind'
import {EmptyMenu} from "@components/Empty/Listings";
import {CategoryCard} from "@screens/AppNavigator/ListingsNavigator/screens/components/CategoryCard";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ListingsParams} from "@screens/AppNavigator/ListingsNavigator/ListingsNavigator";
import {ListingCategoryI} from "@imagyne/eatlater-types";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import {useCallback} from "react";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";

export function ListingsCategory (props: {categories: ListingCategoryI[], state: boolean}): JSX.Element {
    const navigation  = useNavigation<NavigationProp<ListingsParams>>()

    function onPress (category: ListingCategoryI): void {
        navigation.navigate("AddCategory",{category})
    }

    const renderItem = useCallback(({item}:  ListRenderItemInfo<ListingCategoryI>): JSX.Element => {
        return <CategoryCard
            onPress={onPress}
            category={item}
        />
    }, [])


    if (props.categories.length <= 0) {
        return (
            <EmptyMenu type='CATEGORY' title="Category" subtitle='Create categories and add them to your menus eg. African Cuisine' />
        )
    }

    if (props.state) {
        return <View style={tailwind('flex h-full w-full items-center justify-center')}>
            <LoaderComponent style={tailwind('text-primary-500')} size='large' />
        </View>

    }


    return (
        <View style={tailwind('flex-1  bg-white')}>
            <FlashList
                contentContainerStyle={tailwind('py-4')}
                data={props.categories}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                estimatedItemSize={props.categories.length}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )

}
