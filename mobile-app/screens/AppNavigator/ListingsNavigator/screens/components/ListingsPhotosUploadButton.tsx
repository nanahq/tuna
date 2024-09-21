import {GenericButton} from "@components/commons/buttons/GenericButton";
import {tailwind} from "@tailwind";

export function ListingsPhotosUploadButton (props: {onPress: () => Promise<void>, disabled?: boolean, loading?: boolean}): JSX.Element {
    return (

        <GenericButton labelColor={tailwind('text-white')} disabled={props.disabled} onPress={props.onPress} loading={props.loading} label={props.loading ? 'updating image' : 'Upload Photo'} testId="" />
    )
}
