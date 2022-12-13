import {useEffect, useState} from "react";
import {DaysListMapper} from '@types/Days'

export function useDate (): any {
    const [today, setToday] = useState<string>(DaysListMapper[0])

    useEffect(() => {
        const dt = new Date()
        setToday(DaysListMapper[dt.getDay()])
    }, [])
    return {
        today
    }
}


