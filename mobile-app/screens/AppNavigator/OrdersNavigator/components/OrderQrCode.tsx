import QrCode from 'react-qr-code'

export function OrderQrCode (props: {orderId: string}): JSX.Element {
    return  (
        <QrCode value={props.orderId} size={200} />
    )
}
