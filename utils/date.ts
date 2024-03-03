import moment from "moment";

function calculatePreorderDate (date: any): string {
return moment(date).subtract(30, 'minutes').format('HH:mm on ddd, DD MMM')
}

function calculateOnDemandDeliveryDate (preparationTime: number, orderCreationDate: string): string {
    const time = moment(orderCreationDate).add(preparationTime + 5, "minutes").format('HH:mm')
    return `Before ${time}`
}
export {
    calculatePreorderDate,
    calculateOnDemandDeliveryDate
}
