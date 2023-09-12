import days from 'dayjs'

function calculatePreorderDate (date: any): string {
return days(date).subtract(30, 'minutes').format('HH:mm on ddd, DD MMM')
}

function calculateOnDemandDeliveryDate (preparationTime: number, orderCreationDate: string): string {
    return days(orderCreationDate).add(preparationTime, "minutes").format('HH:mm on ddd, DD MMM')
}
export {
    calculatePreorderDate,
    calculateOnDemandDeliveryDate
}
