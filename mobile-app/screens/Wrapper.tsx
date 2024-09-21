import {
    BatchSize,
    DatadogProvider,
    DatadogProviderConfiguration,
    SdkVerbosity,
    UploadFrequency,
} from "@datadog/mobile-react-native";
import {PropsWithChildren} from "react";
console.log(process.env)

const config = new DatadogProviderConfiguration(
    "pubd7316220d1b7c35e4204285ee5d7b31f",
    "development",
    "f0a5596b-63b6-44e6-a554-12902be801c2",
    true,
    true,
    true
)
config.site = "US1"
config.longTaskThresholdMs = 100
config.nativeCrashReportEnabled = true
config.sampleRate = 100

if (__DEV__) {
    config.uploadFrequency = UploadFrequency.FREQUENT
    config.batchSize = BatchSize.SMALL
    config.verbosity = SdkVerbosity.DEBUG
}

export  function Wrapper({children}: PropsWithChildren<{}>) {
    return (
        <DatadogProvider configuration={config}>
            {children}
        </DatadogProvider>
    );
}

