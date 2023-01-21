import {Pressable, Text, View} from 'react-native'
import {tailwind} from '@tailwind'
import {IconButton} from "@components/commons/buttons/IconButton";

export interface CategoryCardProps {
    isLive: boolean
    name: string
    menuCount: number
    onPress: () => void
}

export function CategoryCard (props: CategoryCardProps): JSX.Element {
    return (

            <Pressable onPress={props.onPress} style={tailwind('flex flex-col w-full px-3 py-2 border-0.5 border-brand-gray-700 rounded-sm mb-4')}>
                <View style={tailwind('flex flex-row w-full items-center justify-between')}>
                    <Text style={tailwind('text-brand-black-500 font-medium text-lg mb-5')}>{props.name}</Text>
                    <IconButton iconName="trash" iconType="Feather" iconSize={18} iconStyle={tailwind('text-red-500')} />
                </View>
                <View style={tailwind('flex flex-row w-full items-center justify-between')}>
                    <Text style={tailwind('text-brand-black-500 font-medium text-sm')} >{`Menu: ${props.menuCount}`}</Text>
                    <View style={tailwind('flex flex-row items-center')}>
                        <Text style={tailwind('text-brand-black-500 font-medium text-sm')}>Status</Text>
                        <Text
                            style={tailwind('font-semibold ml-1 text-sm', {
                                'text-primary-500': props.isLive,
                                'text-brand-gray-700': !props.isLive
                            })}
                        >
                            {`${props.isLive ? 'Live' : 'Not live'}`}
                        </Text>
                    </View>
                </View>
            </Pressable>
    )
}
