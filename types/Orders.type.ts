export interface Order {
    id: string
    userId: string
    listingId: string
    vendorId: string
    totalOrderValue: number
    orderValueToCharge: number
    orderStatus: OrderStatus
    deliveryMode: OrderDeliveryMode
    deliveryAddress: string
    isThirdParty: boolean
    primaryContact: string
    secondaryContact: string
    customizableOptions: string[]
    addOns: string[]
    orderBreakDown: OrderBreakDown
    refId: number
}

export interface OrderBreakDown {
    orderCost: number
    systemFee: number
    deliveryFee: number
    vat: number
}

export enum OrderStatus {
    PROCESSED = 'ORDER_PLACED', // default order status
    COLLECTED = 'COLLECTED_FROM_VENDOR', // Only vendors can updated/use this
    IN_ROUTE = 'OUT_FOR_DELIVERY', // Only admin/rider can update/use this
    FULFILLED = 'DELIVERED_TO_CUSTOMER',
}


export enum OrderDeliveryMode {
    PICKUP = 'ORDER_PICK_UP',
    DELIVERY = 'ORDER_DELIVERY',
}
