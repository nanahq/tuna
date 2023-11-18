import moment from "moment";

function calculatePreorderDate (date: any): string {
return moment(date).subtract(30, 'minutes').format('HH:mm on ddd, DD MMM')
}

function calculateOnDemandDeliveryDate (preparationTime: number, orderCreationDate: string): string {
    return moment(orderCreationDate).add(preparationTime, "minutes").format('HH:mm on ddd, DD MMM')
}
export {
    calculatePreorderDate,
    calculateOnDemandDeliveryDate
}
