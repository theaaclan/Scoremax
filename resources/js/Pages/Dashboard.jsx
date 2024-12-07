// resources/js/Pages/Dashboard.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PieChart from "../Components/PieChart";
import { Head, usePage } from "@inertiajs/react";
import "@css/tailwind.css";
import LeagueForm from "./League";

export default function Dashboard() {
    const { stats } = usePage().props; // Assuming stats is passed from the backend

    // Separate data for players and teams
    const playerData = {
        labels: [
            "Basketball Players",
            "Volleyball Players",
            "Baseball Players",
            "Sepak Takraw Players",
            "Football Players",
        ],
        datasets: [
            {
                label: "Players",
                data: [150, 100, 120, 80, 200],
                backgroundColor: [
                    "#FF5733",
                    "#33FF57",
                    "#C233FF",
                    "#FF33A8",
                    "#FF3380",
                ],
                borderColor: "#fff",
                borderWidth: 1,
            },
        ],
    };

    const teamData = {
        labels: [
            "Basketball Teams",
            "Volleyball Teams",
            "Baseball Teams",
            "Sepak Takraw Teams",
            "Football Teams",
        ],
        datasets: [
            {
                label: "Teams",
                data: [10, 8, 6, 4, 15],
                backgroundColor: [
                    "#FFBD33",
                    "#33D1FF",
                    "#FF33A8",
                    "#F5C233",
                    "#FF5733",
                ],
                borderColor: "#fff",
                borderWidth: 1,
            },
        ],
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="flex">
                {/* Main Content */}

                <div className="w-full p-6">
                    <h1 className="relative text-2xl font-semibold mb-6 text-center">
                        Dashboard
                    </h1>
                    <LeagueForm />
                    {/* Responsive flex layout for two Pie Charts */}
                    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
                        {/* Player Stats Chart */}
                        <div className="relative lg:w-1/3 w-1/2">
                            <PieChart
                                data={playerData}
                                title="Players Statistics"
                                width={200} // Adjust width here
                                height={200} // Adjust height here
                            />
                        </div>

                        {/* Team Stats Chart */}
                        <div className="relative lg:w-1/3 w-1/2">
                            <PieChart
                                data={teamData}
                                title="Teams Statistics"
                                width={200} // Adjust width here
                                height={200} // Adjust height here
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
