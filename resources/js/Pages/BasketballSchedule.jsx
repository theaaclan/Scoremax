import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import "@css/tailwind.css";

const BasketballSchedule = ({ initialTeams }) => {
    const [schedule, setSchedule] = useState([]);
    const [teams, setTeams] = useState(
        Array.isArray(initialTeams) ? initialTeams : []
    ); // Ensure teams is always an array

    useEffect(() => {
        // Load the schedule from localStorage if it exists
        const storedSchedule = JSON.parse(
            localStorage.getItem("basketballSchedule")
        );
        if (storedSchedule) {
            setSchedule(storedSchedule);
        }
    }, []);

    const handleShuffle = () => {
        if (teams.length === 0) {
            alert("No teams available to shuffle!");
            return;
        }

        if (confirm("Are you sure you want to shuffle the teams?")) {
            const shuffledTeams = [...teams];

            // Shuffle the teams randomly
            shuffledTeams.sort(() => Math.random() - 0.5);

            // Generate a schedule after shuffling
            const newSchedule = generateSchedule(shuffledTeams);

            // Update the state with the shuffled schedule
            setSchedule(newSchedule);

            // Store the schedule in localStorage
            localStorage.setItem(
                "basketballSchedule",
                JSON.stringify(newSchedule)
            );
        }
    };

    const generateSchedule = (shuffledTeams) => {
        const schedule = [];
        const teamCount = shuffledTeams.length;

        // Generate all matchups (pairs)
        const matchups = [];
        for (let i = 0; i < teamCount; i++) {
            for (let j = i + 1; j < teamCount; j++) {
                matchups.push([shuffledTeams[i], shuffledTeams[j]]);
            }
        }

        // Fixed game times for each day
        const gameTimes = [
            "4:00 PM - 6:00 PM",
            "6:00 PM - 8:00 PM",
            "8:00 PM - 10:00 PM",
        ];

        const startDate = new Date(); // Start date for scheduling
        let currentDate = new Date(startDate); // The current available date for scheduling games

        // Assign 3 games per day
        while (matchups.length > 0) {
            // Get the next 3 matchups for today
            const gamesToday = matchups.splice(0, 3);
            gamesToday.forEach((pair, index) => {
                // Assign the match time
                let matchTime = gameTimes[index];

                // Add the match to the schedule
                schedule.push({
                    team_1: pair[0].TeamName,
                    team_2: pair[1].TeamName,
                    date: currentDate.toLocaleDateString(),
                    match_time: matchTime,
                });
            });

            // Move to the next day after assigning 3 games
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return schedule;
    };

    const handleClear = () => {
        if (confirm("Are you sure you want to clear the schedule?")) {
            setSchedule([]);
            // Remove the schedule from localStorage
            localStorage.removeItem("basketballSchedule");
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto mt-8">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Round Robin Matchups
                </h1>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={handleShuffle}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Shuffle Teams
                    </button>
                    <button
                        onClick={handleClear}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                    >
                        Clear Schedule
                    </button>
                    <a
                        href={route("basketballteams.index")}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                    >
                        Back
                    </a>
                </div>

                {/* Schedule Table */}
                {schedule.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Team 1
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Team 2
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Match Date
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Match Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((match, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">
                                        {match.team_1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {match.team_2}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {match.date}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {match.match_time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div
                        className="text-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded"
                        role="alert"
                    >
                        No schedule available. Please shuffle the teams to
                        create a new schedule.
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default BasketballSchedule;
