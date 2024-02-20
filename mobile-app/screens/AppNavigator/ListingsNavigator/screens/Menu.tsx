import {Image, Pressable, Text, View} from 'react-native'
import {EmptyMenu} from "@components/Empty/Listings";
import {ListingApprovalStatus, ListingMenuI} from "@nanahq/sticky";
import {tailwind} from "@tailwind";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import {useCallback} from "react";
import {IconButton} from "@components/commons/buttons/IconButton";
import {useNavigation} from "@react-navigation/native";

export function ListingsMenu (props: {menu: ListingMenuI[], state: boolean}): JSX.Element {
    const navigation = useNavigation<any>()

    function onListingPress (menu: ListingMenuI): void {
        navigation.navigate("SingleMenu", {
            menu
        })
    }


    const renderItem = useCallback(({item}:  ListRenderItemInfo<ListingMenuI>): JSX.Element => {
        return <ListingMenuCard
            onPress={onListingPress}
            menu={item}
        />
    }, [])
    if (props.menu.length <= 0) {
        return (
            <EmptyMenu
                type='MENU'
                title="Menu"
                subtitle='Food and drinks you sell. Add them here'
            />
        )
    }

    if (props.state) {
        return <View style={tailwind('flex h-full w-full items-center justify-center')}>
            <LoaderComponent style={tailwind('text-primary-500')} size='large' />
        </View>

    }


    return (
        <View style={tailwind('flex-1 bg-white')}>
            <FlashList
                contentContainerStyle={tailwind('py-4')}
                data={props.menu}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                estimatedItemSize={props.menu.length}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )

}

export function ListingMenuCard ({menu, onPress}: {menu:ListingMenuI, onPress: (menu: ListingMenuI) => void}) {
    return (
        <Pressable onPress={() => onPress(menu)} style={[tailwind('flex w-full h-full  px-2 mb-4 rounded-lg overflow-hidden'), {

        }]}>
            <View style={tailwind('relative overflow-hidden  bg-white border-0.5 border-brand-black-500  rounded-lg')}>
                <View style={tailwind('w-full h-20')}>
                    <Image source={{uri: menu.photo , cache: 'force-cache'}} resizeMode='cover'   style={tailwind('w-full h-full')} />
                </View>
               <View style={tailwind('p-4')}>
                  <View style={tailwind('flex flex-row justify-between w-full items-center')}>
                      <Text style={tailwind('font-semibold text-lg text-brand-black-500')}>{menu.name}</Text>
                      <IconButton iconName="more-horizontal" iconType="Feather" iconSize={24} iconStyle={tailwind('text-brand-gray-700')} />
                  </View>
                   <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                       <View style={tailwind('flex flex-row items-center')}>
                           <Text style={tailwind('text-lg font-medium text-brand-black-500')}>{menu.isAvailable ? 'Available' : 'Not Available'}</Text>
                           <View style={tailwind('rounded-full ml-1 h-2 w-2', {
                               'bg-green-500': menu.isAvailable,
                               'bg-brand-gray-700': !menu.isAvailable
                           })} />
                       </View>
                       <View style={tailwind('flex flex-row items-center')}>
                           <Text style={tailwind('text-lg font-medium text-brand-black-500')}>{menu.isLive ? 'Live': 'Not Live'}</Text>
                           <View style={tailwind('rounded-full ml-1 h-2 w-2', {
                               'bg-green-500': menu.isLive,
                               'bg-brand-gray-700': !menu.isLive
                           })} />
                       </View>
                   </View>
               </View>
                {menu.status === ListingApprovalStatus.PENDING && (
                    <View style={tailwind('absolute top-0 right-0 bg-warning-200 px-3 py-1')}>
                        <Text style={tailwind('text-brand-black-500')}>Pending Approval</Text>
                    </View>
                )}
            </View>
        </Pressable>
    )
}
