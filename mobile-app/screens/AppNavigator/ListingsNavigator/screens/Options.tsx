import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";
import {useCallback} from "react";
import { Text, View, TouchableOpacity} from 'react-native'
import {EmptyMenu} from "@components/Empty/Listings";

import {ListingOptionGroupI} from "@nanahq/sticky";
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

    const renderItem = useCallback(({item}:  ListRenderItemInfo<ListingOptionGroupI>): JSX.Element => {
        return <OptionCard
            onPress={onOptionPress}
            option={item}
        />
    }, [])


    if (props.options.length <= 0) {
        return (
            <EmptyMenu type='OPTION' title="Options" subtitle='Add options and add-ons. Meat, Chillis, Zobo etc' />
        )
    }

    if (props.state) {
        return <View style={tailwind('flex h-full w-full items-center justify-center')}>
            <LoaderComponent style={tailwind('text--primary-100')} size='large' />
        </View>

    }




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
        <TouchableOpacity onPress={() => onPress(option)} style={[tailwind('flex flex-col w-full px-2 mb-4 bg-transparent'),{

        }]}>
           <View style={tailwind('border-0.5 border-gray-300 bg-white p-3 rounded-lg')}>
               <View style={tailwind('flex flex-row w-full items-start justify-between ')}>
                   <Text style={tailwind('text-black mb-2')}>{option.name}</Text>
               </View>
               <View style={tailwind('flex flex-row w-full items-center justify-between')}>
                   <Text style={tailwind('text-black  text-sm')} >{`No. of options: ${option.options.length} `}</Text>
               </View>
           </View>
        </TouchableOpacity>
    )
}
