import {useEffect, useState} from "react";
import {Logger} from '@api/logging.util'
import * as Font from 'expo-font'
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import {
    Montserrat_100Thin,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'


/**
 * Delaying splash screen to load additional resources prior to rendering the app
 * @return boolean when loading complete
 */
export function useCachedResource (): boolean {
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() =>{
        LoadCachedResourceAsync().finally(() => {
            setIsLoaded(true)
        })
    }, [])

    return isLoaded
}

async function LoadCachedResourceAsync (): Promise<void> {
    try {
        await Font.loadAsync({
            ...MaterialIcons.font,
            ...MaterialCommunityIcons.font,
            ThinFont: Montserrat_100Thin,
            LightFont: Montserrat_300Light,
            RegularFont: Montserrat_400Regular,
            MediumFont: Montserrat_500Medium,
            SemiBoldFont: Montserrat_600SemiBold,
            BoldFont: Montserrat_700Bold
        })
    } catch (error) {
        Logger.error(error)
    }
}
