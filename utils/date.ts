import days from 'dayjs'

function calculatePreorderDate (date: any): string {
return days(date).subtract(30, 'minutes').format('HH:mm on ddd, DD MMM')
}

// function calculateOnDemand (date): string {

// }
export {
    calculatePreorderDate
}
