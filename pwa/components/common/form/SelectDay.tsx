import {daysOfWeek} from "./utils";
import React from "react";


const SelectDay = ({register}: { register: any }) => (
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


export default SelectDay;