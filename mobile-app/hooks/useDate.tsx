import {useEffect, useState} from "react";
import {DaysListMapper} from '@typings/Days'

export function useDate (): any {
    const [today, setToday] = useState<string>(DaysListMapper[0])
    useEffect(() => {
        const dt = new Date().getDay()
        setToday(DaysListMapper[dt])
    }, [])



    return {
        today
    }
}


