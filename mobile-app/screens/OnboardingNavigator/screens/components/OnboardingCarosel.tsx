import SwiperFlatList from 'react-native-swiper-flatlist'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import OnboardinCorouselImage1 from '@assets/onboarding/onboarding_image_1.png'
import OnboardinCorouselImage2 from '@assets/onboarding/onboarding_image_2.png'
import OnboardinCorouselImage3 from '@assets/onboarding/onboarding_image_3.png'
import SiteLogoGreenWhite from '@assets/onboarding/site_logo_green_white.png'

import {Dimensions,Image, ImageBackground, ImageSourcePropType, Text, View} from "react-native";
import {getColor, tailwind} from "@tailwind";
import * as Device from 'expo-device'

interface CarouselSlidesProps {
    image: ImageSourcePropType
    title: string

}
const slides: JSX.Element[] = [
    <CarouselSlide
        image={OnboardinCorouselImage1}
        title='Order food from your favorite vendors'
    />,
    <CarouselSlide
        image={OnboardinCorouselImage2}
        title='Order food from your favorite vendors'
    />,
    <CarouselSlide
        image={OnboardinCorouselImage3}
        title='Order food from your favorite vendors'
    />

]

// Needs for it to work on web. Otherwise, it takes full window size
const { width, height } = Device.modelName === "web" ? { width: 375, height: 652 } : Dimensions.get("window");

function CarouselSlide (props: CarouselSlidesProps): JSX.Element  {
    const {top: topInsert} = useSafeAreaInsets()
     return (
        <View style={[tailwind('flex-1'), {width, height: height - 160}]} >
            <ImageBackground source={props.image} resizeMode='cover' style={tailwind('flex-1')}>
                <View style={[tailwind('px-16'), {paddingTop: topInsert + 10} ]}>
                    <Image source={SiteLogoGreenWhite}  resizeMode='center' style={{width: 281, height: 59 }} />
                </View>
                <View style={[tailwind('px-10 flex flex-row justify-center'), {top: height - 427}]}>
                    <Text style={tailwind('font-semibold  text-white text-xl text-center')}>{props.title}</Text>
                </View>
            </ImageBackground>

        </View>
    )
}


export function OnboardingCarousel(): JSX.Element {
    return (
        <SwiperFlatList
            autoplay
            autoplayDelay={10}
            autoplayLoop
            autoplayLoopKeepAnimation
            data={slides}
            index={0}
            paginationActiveColor={
                getColor("secondary-500")
            }
            paginationStyleItemActive={tailwind("w-4 h-4 rounded-full border-secondary-500 border-2")}
            paginationDefaultColor={
                getColor("transparent")
            }
            paginationStyleItem={tailwind("h-4 w-4 rounded-full -mt-80  border-2 border-white")}
            renderItem={({ item }) => <View style={{ width }}>{item}</View>}
            showPagination
        />
    );
}
