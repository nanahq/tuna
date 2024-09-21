import { Pressable, Text, View} from 'react-native'
import {EmptyMenu} from "@components/Empty/Listings";
import { ScheduledListingI} from "@nanahq/sticky";
import {tailwind} from "@tailwind";
import {FlashList, ListRenderItemInfo} from "@shopify/flash-list";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import {useCallback} from "react";
import {IconButton} from "@components/commons/buttons/IconButton";
import moment from "moment";

export function ScheduledListings (props: {listings: ScheduledListingI[], state: boolean}): JSX.Element {

    function onListingPress (listing: ScheduledListingI): void {

    }


    const renderItem = useCallback(({item}:  ListRenderItemInfo<ScheduledListingI>): JSX.Element => {
        return <ListingCard
            onPress={onListingPress}
            listing={item}
        />
    }, [])
    if (props.listings.length <= 0) {
        return (
            <EmptyMenu
                type='MENU'
                title="Scheduled Listing"
                subtitle='Food and drinks that will be available in the future based on preorders'
            />
        )
    }

    if (props.state) {
        return <View style={tailwind('flex h-full w-full items-center justify-center')}>
            <LoaderComponent style={tailwind('text-primary-100')} size='large' />
        </View>

    }


    return (
        <View style={tailwind('flex-1 bg-white')}>
            <FlashList
                contentContainerStyle={tailwind('py-4')}
                data={props.listings}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                estimatedItemSize={props.listings.length}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )

}

export function ListingCard ({listing, onPress}: {listing:ScheduledListingI, onPress: (listing: ScheduledListingI) => void}) {
    const date = moment(listing.availableDate).format('ddd Do MMMM')
    return (
        <Pressable onPress={() => onPress(listing)} style={[tailwind(' flex w-full h-full px-2 mb-4 rounded-lg overflow-hidden'), {

        }]}>
            <View style={tailwind('overflow-hidden relative bg-white border-0.5 border-gray-300 rounded-lg')}>
                <View style={tailwind('p-4')}>
                    <View style={tailwind('flex flex-row justify-between w-full items-center')}>
                        <Text style={tailwind('text-lg text-black')}>{listing?.listing?.name}</Text>
                        <IconButton iconName="more-horizontal" iconType="Feather" iconSize={24} iconStyle={tailwind('text-brand-gray-700')} />
                    </View>
                    <View style={tailwind('flex flex-col  w-full')}>
                        <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                            <View style={tailwind('flex flex-row items-center')}>
                                <Text style={tailwind('text-black mr-4')}>Quantity remaining</Text>
                                <Text style={tailwind('text-black')}>{listing?.remainingQuantity}</Text>
                            </View>
                            <View style={tailwind('flex flex-row items-center')}>
                                <Text style={tailwind(' text-black mr-4')}>Quantity Sold</Text>
                                <Text style={tailwind('text-black')}>{listing?.quantity - listing?.remainingQuantity }</Text>
                            </View>
                        </View>
                        <View style={tailwind('flex mt-2 flex-row items-center')}>
                            <Text style={tailwind(' text-black mr-5')}>Available Date</Text>
                            <Text style={tailwind(' text-black')}>{date}</Text>
                        </View>
                    </View>
                </View>
                {listing.soldOut && (
                    <View style={tailwind('absolute top-0 right-0  py-1 w-28 bg-green-500')}>
                        <Text style={tailwind('text-white text-center')}>Sold out</Text>
                    </View>
                )}
            </View>

        </Pressable>
    )
}
