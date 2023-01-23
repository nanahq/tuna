import {persistence} from "@api/persistence";
import * as Updates from "expo-updates";

export async function clearOnAuthError (nullableState?: any): Promise<void> {
    nullableState !== undefined && (nullableState = null)
    await persistence.deleteSecure()
    await Updates.reloadAsync()
}
