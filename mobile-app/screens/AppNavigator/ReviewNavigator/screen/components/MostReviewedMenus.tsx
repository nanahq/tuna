import {ScrollView, Text, View} from "react-native";
import {tailwind} from '@tailwind'
import {IconComponent} from "@components/commons/IconComponent";
import {NumericFormat as NumberFormat} from "react-number-format";
import {ReviewI} from "@imagyne/eatlater-types";


export function MostReviewedMenus (props: {reviews: ReviewI[]  }): JSX.Element {

    if (props.reviews.length <= 0) {
        return <></>
    }

    return (
       <View style={tailwind('flex flex-col my-10')}>
           <Text style={tailwind('text-brand-black-500 text-lg font-medium')}>Top rated menus</Text>
           <ScrollView horizontal style={tailwind('px-2')} showsHorizontalScrollIndicator={false}>
               {props.reviews.map((review, index) => (
                   <MostReviewedMenusItem name={review.listingId.name} key={`review_top_menu_${index}`} reviews={review.reviewBody} rating={review.reviewStars.toString()} />
               ))}

           </ScrollView>
       </View>
    )
}


function MostReviewedMenusItem  (props: {name: string, rating: string, reviews: string, noLeftMargin?: boolean}): JSX.Element {
    return (
        <View style={[
            tailwind('border-0.5 border-brand-black-500 bg-white px-2 py-3 flex flex-col justify-between rounded-sm', {
                'mr-3': props.noLeftMargin === undefined,
            }),
            {
                width: 160
            }
        ]}>
            <Text style={tailwind('text-brand-black-500 text-base mr-2 font-semibold')}>{props.name}</Text>
            <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                <View style={tailwind('flex flex-row items-center')}>
                    <Text style={tailwind('text-brand-black-500 ')}>{props.rating}</Text>
                    <IconComponent iconType='MaterialIcons' name='star-rate' style={tailwind('text-yellow-500')} size={14} />
                </View>
                <View style={tailwind('flex flex-row items-center ')}>
                    <NumberFormat
                        value={props.reviews}
                        thousandSeparator
                        displayType="text"
                        renderText={(value) => (
                            <Text
                                style={tailwind('text-brand-black-500 ')}
                            >
                                {value}
                            </Text>
                        )}
                    />
                    <IconComponent iconType='Feather' name='message-circle' style={tailwind('text-brand-green-500')} size={14} />
                </View>
            </View>
        </View>
    )
}



