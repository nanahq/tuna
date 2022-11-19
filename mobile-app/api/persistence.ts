import AsyncStorage from "@react-native-async-storage/async-storage";

enum AUTH_KEY {
    KEY = '@AUTH_TOKEN'
}

async function get (): Promise<string | null> {
  const token = await AsyncStorage.getItem(AUTH_KEY.KEY)

    if (token !== null && token?.length > 1) {
        return token
    }

    return null
}

async function set (token: string): Promise<void> {
  return await AsyncStorage.setItem(AUTH_KEY.KEY, token)
}

export async function clear (): Promise<void> {
    return await AsyncStorage.removeItem(AUTH_KEY.KEY)
}

export const persistence = {
    set,
    get
}
