'use client';

import React, {useEffect, useState} from "react";
import PageContainer from "../components/common/layout/PageContainer";
import {useUser} from "../context/UserContext";
import {useQuery} from "react-query";
import {fetchUserReservations} from "../request/reservation";
import AlertError from "../components/common/alert/AlertError";
import {useRouter} from "next/router";
import dayjs from "dayjs";
import Pagination from "../components/common/Pagination";
import PageLoading from "../components/common/PageLoading";
import CardReservation from "../components/user/CardReservation";

const Orders = () => {
    const {user} = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("futur");

    useEffect(() => {
        if (!user) {
            router.push('/signIn').then();
        }
    }, [router, user]);

    return (
        <PageContainer title='Vos réservations' titlePage="Vos réservations">
            <div className="w-full bg-black text-white">
                <div className="relative right-0">
                    <ul className="relative flex flex-wrap list-none bg-primary_light border-b border-gray-700" role="list">
                        {["futur", "past"].map((tab) => (
                            <li key={tab} className="flex-auto text-center">
                                <button
                                    className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition-all 
                            border-b-2 border-transparent 
                            ${activeTab === tab ? "border-white text-white" : "text-gray-300 hover:text-white hover:border-gray-400"}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === "futur" ? "A venir" : "Passée"}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="p-5">
                        {activeTab === "futur" && (
                            <div id="futur" role="tabpanel">
                                <CardReservation past={false}/>
                            </div>
                        )}
                        {activeTab === "past" && (
                            <div id="past" role="tabpanel">
                                <CardReservation past/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
export default Orders;