import {View} from 'react-native'
import {tailwind} from '@tailwind'

export function ProgressBar (props: {progress?: 1 | 2}): JSX.Element {
    const {progress = 1} = props
    return (
        <View style={tailwind('flex flex-row w-full items-center justify-end mt-2')}>
            <View style={[tailwind('bg-secondary-500 rounded-lg mr-2'), {
                height: 5,
                width: 50
            }]} />
            <View style={[tailwind('rounded-lg', {
                'bg-secondary-500':progress === 2,
                'bg-brand-gray-200 ':progress === 1
            }), {
                height: 5,
                width: 50
            }]} />
        </View>
    )
}
