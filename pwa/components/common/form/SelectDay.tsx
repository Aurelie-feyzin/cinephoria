import {daysOfWeek} from "./utils";
import React from "react";
import dayjs, {Dayjs} from "dayjs";


const SelectDay = ({register, now, setAfter, setBefore, selectedDay}:
                   { register: any, now: Dayjs, setAfter: React.Dispatch<string>, setBefore: React.Dispatch<string>, selectedDay?: string  }) => {
    if (selectedDay) {
        let newAfterDate = now;
        let newAfterDay = newAfterDate.day();
        while (Number(selectedDay) !== newAfterDay) {
            newAfterDate = dayjs(newAfterDate).add(1, 'day');
            newAfterDay = newAfterDate.day();
        }
        setAfter(newAfterDate.format('YYYY-MM-DD'));
        setBefore(newAfterDate.format('YYYY-MM-DD'));
    } else {
        setAfter(now.format('YYYY-MM-DD'));
        setBefore(now.add(6, 'day').format('YYYY-MM-DD'));
    }

    return (
        <>
            <label htmlFor="day-filter" className="block text-secondary font-semibold mb-2">
                Jour
            </label>
            <select
                id="day-filter"
                {...register('day')}
                className="w-full p-2 border rounded-md"
            >
                {daysOfWeek.map((day) => (
                    <option key={day.value} value={day.value}>
                        {day.label}
                    </option>
                ))}
            </select>
        </>
    );
}

export default SelectDay;