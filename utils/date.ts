import days from 'dayjs'

function calculatePreorderDate (date: string): string {
return days(date).subtract(30, 'minutes').format('HH:mm on dddd, DD')
}

// function calculateOnDemand (date): string {

// }
export {
    calculatePreorderDate
}