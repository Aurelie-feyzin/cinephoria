'use client';

import type {NextPage} from "next";
import React, {useState} from "react";
import PageAdminContainer from "../../components/admin/PageAdminContainer";
import {useQuery} from "react-query";
import {fetchDashboard} from "../../request/dashboard";
import PageLoading from "../../components/common/PageLoading";
import PageError from "../../components/common/PageError";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Admin: NextPage = () => {
    const [barChartByMovie, setBarChartByMovie] = useState<any>(null)
    const [donutChartByCinema, setDonutChartByCinema] = useState<any>(null)
    const [lineChartByDay, setLineChartByDay] = useState<any>(null)
    const {error, isLoading} = useQuery<any, Error>(
        ['dashboard'],
        () => fetchDashboard(),
        {
            onSuccess: (data) => {
                setBarChartByMovie({
                    series: [{
                        data: Object.values(data.reservationsByMovie)
                    }],
                    options: {
                        chart: {
                            type: 'bar',
                            id: 'chart-by-cinema',
                        },
                        title: {
                            text: 'Réservation par film',
                            align: 'center',
                        },
                        plotOptions: {
                            bar: {
                                borderRadius: 4,
                                borderRadiusApplication: 'end',
                                horizontal: true,
                            }
                        },
                        dataLabels: {
                            enabled: true,
                            textAnchor: 'start',
                        },
                        xaxis: {
                            categories: Object.keys(data.reservationsByMovie),
                            labels: {
                                style: {fontSize: "12px"},
                                trim: true
                            },
                            min: 0,
                        },
                    },
                });
                setDonutChartByCinema({
                    series: Object.values(data.reservationsByCinema),
                    options: {
                        chart: {
                            type: 'donut',
                        },
                        plotOptions: {
                            pie: {
                                startAngle: -90,
                                endAngle: 270,
                                donut: {
                                    labels: {
                                        show: true,
                                        total: {
                                            showAlways: true,
                                            show: true
                                        }
                                    }
                                }
                            }
                        },
                        labels: Object.keys(data.reservationsByCinema),
                        dataLabels: {
                            enabled: true
                        },
                        fill: {
                            type: 'gradient',
                        },
                        title: {
                            text: 'Réservation par cinéma',
                            align: 'center'
                        },
                        legend: {
                            show: true,
                            position: 'right',
                            horizontalAlign: 'center',
                            itemMargin: {
                                horizontal: 5,
                                vertical: 5
                            },
                            offsetY: 60
                        }
                    },
                });
                const maxReservationbyDay = Math.max(...Object.values(data.reservationsByDay as number[]));
                setLineChartByDay({
                    series: [{
                        data: Object.values(data.reservationsByDay)
                    }],
                    options: {
                        chart: {
                            id: 'chart_by_day',
                            height: 350,
                            type: 'line',
                            toolbar: {
                                show: false
                            },
                            zoom: {
                                enabled: false
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            curve: 'smooth'
                        },
                        title: {
                            text: 'Réservation par date',
                            align: 'center'
                        },
                        markers: {
                            size: 0
                        },
                        xaxis: {
                            categories: Object.keys(data.reservationsByDay),
                            labels: {rotate: -45}
                        },
                        yaxis: {
                            min: 0,
                            max: Math.round(maxReservationbyDay * 1.10),
                        },
                        legend: {
                            show: false
                        },
                    },
                });
            }
        })
    ;

    return (
        <PageAdminContainer titlePage="Réservations sur les 7 prochains jours">
            {isLoading && <PageLoading/>}
            {error && <PageError message={error.message}/>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {donutChartByCinema && (
                    <div className="p-4 shadow-lg rounded-2xl bg-white">
                        <ReactApexChart
                            options={donutChartByCinema.options}
                            series={donutChartByCinema.series}
                            type="donut"
                            width={600}
                        />
                    </div>
                )}

                {lineChartByDay && (
                    <div className="p-4 shadow-lg rounded-2xl bg-white">
                        <ReactApexChart
                            options={lineChartByDay.options}
                            series={lineChartByDay.series}
                            type="line"
                            width={600}
                        />
                    </div>
                )}
            </div>

            {barChartByMovie && (
                <div className="flex justify-center mt-6">
                    <div className="p-6 shadow-lg rounded-2xl bg-white max-w-6xl">
                        <ReactApexChart
                            options={barChartByMovie?.options || []}
                            series={barChartByMovie?.series || []}
                            type="bar"
                            width="1000"
                        />
                    </div>
                </div>
            )}
        </PageAdminContainer>
    );
}

export default Admin;
