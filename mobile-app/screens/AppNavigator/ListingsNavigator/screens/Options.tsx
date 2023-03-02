import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";
import {useCallback} from "react";
import {Pressable, Text, View} from 'react-native'
import {EmptyMenu} from "@components/Empty/Listings";

import {ListingOptionGroupI} from "@imagyne/eatlater-types";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {useNavigation} from "@react-navigation/native";
import {LoaderComponent} from "@components/commons/LoaderComponent";

export function ListingsOptions (props: {options: ListingOptionGroupI[], state: boolean}): JSX.Element {
    const navigation = useNavigation<any>()

    function onOptionPress (option:ListingOptionGroupI ): void {
        navigation.navigate('AddOption', {
            option,
            merge: true
        })
    }

    if (props.options.length <= 0) {
        return (
            <EmptyMenu type='OPTION' title="Options" subtitle='Add options and add-ons. Meat, Chillis, Zobo etc' />
        )
    }

    if(props.state) {
        return <View style={tailwind('flex h-full w-full items-center justify-center')}>
            <LoaderComponent style={tailwind('text-brand-secondary-500')} size='large' />
        </View>

    }

    const renderItem = useCallback(({item}:  ListRenderItemInfo<ListingOptionGroupI>): JSX.Element => {
        return <OptionCard
            onPress={onOptionPress}
            option={item}
        />
    }, [])


    return (
            <FlashList
                contentContainerStyle={tailwind('py-8')}
                data={props.options}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                estimatedItemSize={props.options.length}
                showsVerticalScrollIndicator={false}
            />
    )
}

export interface OptionCardProps {
    option: ListingOptionGroupI
    onPress: (option: ListingOptionGroupI) => void
}

export function OptionCard ({option, onPress}: OptionCardProps): JSX.Element {
    return (
        <Pressable onPress={() => onPress(option)} style={[tailwind('flex flex-col w-full px-2 mb-4'),{
            shadowColor: '#171717',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
        }]}>
           <View style={tailwind('border-0.5 border-brand-black-500 bg-white p-3')}>
               <View style={tailwind('flex flex-row w-full items-start justify-between ')}>
                   <Text style={tailwind('text-brand-black-500 font-semibold text-lg mb-5')}>{option.name}</Text>
                   <IconButton iconName="more-horizontal" iconType="Feather" iconSize={18} iconStyle={tailwind('text-brand-gray-700')} />
               </View>
               <View style={tailwind('flex flex-row w-full items-center justify-between')}>
                   <Text style={tailwind('text-brand-black-500 font-medium text-sm')} >{`No. of options: ${option.options.length} `}</Text>
               </View>
           </View>
        </Pressable>
    )
}
