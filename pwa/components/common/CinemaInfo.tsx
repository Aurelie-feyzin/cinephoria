import PhoneIcon from "./Icon/PhoneIcon";
import Popover from "./Popover";
import ClockIcon from "./Icon/ClockIcon";
import React from "react";
import {Cinema} from "../../model/Cinema";


const CinemaInfo = ({cinema}: {
    cinema: Cinema;
}) => (
    <div className="flex items-center justify-between p-4 ">
        <div className="flex-grow">
            <p className="text-base md:text-lg font-semibold text-secondary">{cinema.name}</p>
            <div className="text-sm sm:inline-flex items-baseline">
                {cinema.address.street},
            </div>
            <div className="text-sm sm:inline-flex items-baseline">
                {cinema.address.postalCode} {cinema.address.city},
            </div>
            <div className="text-sm md:inline-flex items-baseline">
                <span className="text-sm inline-flex items-baseline">
                    <PhoneIcon/>: {cinema.phoneNumber}
                </span>
            </div>
        </div>
        <div className="grow-0 items-center mx-auto justify-between focus:outline-none">
                <Popover
                    title="Horaires"
                    content={
                        <ul className="list-disc pl-5">
                            {cinema.openingHours.map((hours, index) => (
                                <li key={index} className="p-1">
                                    {hours.dayOfWeek}: {hours.openingTime} - {hours.closingTime}
                                </li>
                            ))}
                        </ul>
                    }
                >
                    <ClockIcon ariaLabel='Horaires du cinéma'/>
                </Popover>
        </div>
    </div>
        )

export default CinemaInfo;