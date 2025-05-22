import LayoutContainer from "@/components/shared/layout-container";
import Chart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {useOutletContext} from "react-router-dom";
import {OrderDto, ProductOutputDTO} from "@/types";
import GridLayout from "@/components/shared/grid-layout.tsx";
import RecentOrders from "@/features/orders/components/recent-orders-table.tsx";
import {getOrders} from "@/features/orders/api";
import {useEffect, useState} from "react";

const chartOptions: ApexOptions = {
    chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#6366f1"],
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.05,
            stops: [0, 90, 100],
        },
        colors: ["#6366f1"],
    },
    xaxis: {
        categories: ["01.05", "05.05", "10.05", "15.05", "20.05", "21.05", "22.05", "23.05"],
        labels: { style: { colors: "#6b7280" } },
    },
    yaxis: {
        labels: { style: { colors: "#6b7280" } },
    },
    grid: {
        borderColor: "#e5e7eb",
    },
    tooltip: {
        theme: "light",
    },
};

const chartSeries = [
    {
        name: "Lagerbestand",
        data: [1200, 1100, 550, 1020, 980, 1180],
    },
];

const Dashboard = () => {
    const allProducts = useOutletContext<ProductOutputDTO[]>();
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const stats = [
        { title: "Produkte", value: allProducts.length },
        { title: "Bestellungen", value: 68 },
        { title: "Kategorien", value: 12 },
    ];

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const allOrders = await getOrders();
                const sorted = (allOrders as (OrderDto & { id: string })[]).sort((a, b) => {
                    const updatedDiff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                    if (updatedDiff !== 0) return updatedDiff;

                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });

                setOrders(sorted);
            } catch (error) {
                console.error("Fehler beim Laden der Bestellungen:", error);
            } finally {
                setIsLoading(false);
            }
        })()
    }, []);
    return (
        <LayoutContainer className="overflow-x-hidden">
            <h1>Warehouse Dashboard</h1>

            <GridLayout
                gridCols={{ base: 1, sm: 2,  md: 2, xl: 3}}>
                {stats.map((s) => (
                    <div key={s.title} className="card text-center">
                        <p className="text-sm font-semibold">{s.title}</p>
                        <h2 className="text-indigo-400">{s.value}</h2>
                    </div>
                ))}
            </GridLayout>

            <GridLayout gridCols={{ base: 1, sm: 1,  md: 2 }}>
                <div className="card bg-transparent overflow-hidden p-0">
                    <h2 className="text-lg font-semibold mb-4">Lagerbestand – Verlauf</h2>
                    <div className="w-full h-72">
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="area"
                            width="100%"
                            height="100%"
                        />
                    </div>
                </div>
                <RecentOrders
                    orders={orders}
                    isLoading={isLoading}
                />
            </GridLayout>
        </LayoutContainer>
    );
};

export default Dashboard;
