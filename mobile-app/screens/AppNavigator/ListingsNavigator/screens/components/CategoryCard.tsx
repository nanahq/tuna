import {Pressable, Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {IconButton} from "@components/commons/buttons/IconButton";
import {ListingCategoryI} from "@imagyne/eatlater-types";

export interface CategoryCardProps {
 category: ListingCategoryI
    onPress: (cat: ListingCategoryI) => void
}

export function CategoryCard (props: CategoryCardProps): JSX.Element {
    return (
            <Pressable onPress={() => props.onPress(props.category)} style={[tailwind('flex flex-col w-full px-2 mb-4'), {
            }]}>
                <View style={tailwind('border-0.5 border-brand-black-500 bg-white  rounded-lg p-3')}>

                <View style={tailwind('flex flex-row w-full items-baseline justify-between')}>
                    <Text style={tailwind('text-brand-black-500 font-semibold text-lg mb-5')}>{props.category.name}</Text>
                    <IconButton iconName="more-horizontal" iconType="Feather" iconSize={24} iconStyle={tailwind('text-brand-green-500')} />
                </View>
                    <View style={tailwind('flex flex-row w-full items-center justify-between')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')} >{`Menu: ${props.category.listingsMenu.length}`}</Text>
                        <View style={tailwind('flex flex-row items-center')}>
                            <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Status</Text>
                            <View
                                style={tailwind('rounded-full h-2 w-2 ml-1', {
                                    'bg-primary-500': props.category.isLive,
                                    'bg-brand-gray-700': !props.category.isLive
                                })}
                            />
                        </View>
                    </View>
                </View>
            </Pressable>
    )
}
