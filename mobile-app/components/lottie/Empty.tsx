import { Text, View } from 'react-native'
import { tailwind } from '@tailwind'
import Lottie from 'lottie-react-native'
import Animation from '@assets/app/872-empty-list.json'
import { useEffect, useRef } from 'react'

export function EmptyAnimation (props: {text: string}): JSX.Element {
    const animationRef = useRef<any>(null)
    useEffect(() => {
        animationRef.current?.play()
    }, [])
    return (
        <View style={tailwind('flex flex-col items-center justify-center w-full')}>
                <Lottie
                ref={animationRef}
                style={{
                    width: 300,
                    height: 300
                }}
                source={Animation}
                  autoPlay
                   loop
                    />
                <Text style={tailwind('text-center text-brand-gray-700 text-lg font-bold')}>{props.text}</Text>
        </View>
    )
}