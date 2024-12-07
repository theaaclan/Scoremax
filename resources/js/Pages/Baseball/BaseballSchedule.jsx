import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "@css/tailwind.css";

const BaseballSchedule = ({ initialTeams }) => {
    const [schedule, setSchedule] = useState([]);
    const [teams, setTeams] = useState(
        Array.isArray(initialTeams) ? initialTeams : []
    );
    const [matchScores, setMatchScores] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [activeLeague, setActiveLeague] = useState(
        JSON.parse(localStorage.getItem("activeLeague"))
    );

    useEffect(() => {
        // Retrieve the active league on component load or when local storage changes
        const leagueData = JSON.parse(localStorage.getItem("activeLeague"));
        if (leagueData) {
            setActiveLeague(leagueData);
        }
    }, []);

    // Load active league from local storage
    useEffect(() => {
        const activeLeague = JSON.parse(localStorage.getItem("activeLeague"));
        if (activeLeague) {
            const leagueId = activeLeague.LeagueID;

            // Filter teams belonging to the active league
            const leagueTeams = teams.filter(
                (team) => team.LeagueID === leagueId
            );
            setFilteredTeams(leagueTeams);
        } else {
            console.warn("No active league found in local storage.");
        }
    }, [teams]);

    useEffect(() => {
        const activeLeagueData = JSON.parse(
            localStorage.getItem("activeLeague")
        );

        if (activeLeagueData) {
            const leagueID = activeLeagueData.LeagueID;
            const key = `BaseballSchedule_${leagueID}`;
            const storedSchedule = JSON.parse(localStorage.getItem(key));

            if (storedSchedule) {
                setSchedule(storedSchedule);
            } else {
                setSchedule([]); // Clear the schedule if no data exists for the league
            }
        } else {
            console.warn("No active league found in local storage.");
            setSchedule([]);
        }
    }, [activeLeague]);

    useEffect(() => {
        // Load the schedule from localStorage if it exists
        const storedSchedule = JSON.parse(
            localStorage.getItem("baseballSchedule")
        );
        if (storedSchedule) {
            setSchedule(storedSchedule);
        }

        // Fetch match scores from the backend
        fetchMatchScores();
    }, []);

    const fetchMatchScores = () => {
        axios
            .get("/baseball_match_score")
            .then((response) => {
                setMatchScores(response.data);
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Error Fetching Match Scores",
                    text: "Unable to retrieve match scores from the database.",
                });
            });
    };

    const getGameWinner = (team1, team2) => {
        // Find the match score for the given teams
        const match = matchScores.find(
            (score) =>
                (score.Team1Name === team1 && score.Team2Name === team2) ||
                (score.Team1Name === team2 && score.Team2Name === team1)
        );

        // Return the winner if available
        if (match) {
            if (match.Team1Score > match.Team2Score) {
                return match.Team1Name;
            } else if (match.Team2Score > match.Team1Score) {
                return match.Team2Name;
            } else {
                return "Draw"; // In case of a tie
            }
        }
        return <i>TBA</i>; // If no match has occurred
    };

    const handleShuffle = () => {
        if (!activeLeague) {
            Swal.fire({
                icon: "warning",
                title: "No Active League",
                text: "Please select a league before shuffling the teams.",
            });
            return;
        }

        if (filteredTeams.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No Teams Available",
                text: "There are no teams registered for the active league.",
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This will shuffle the teams and save the schedule automatically!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, shuffle and save!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                const shuffledTeams = [...filteredTeams];
                shuffledTeams.sort(() => Math.random() - 0.5);

                const newSchedule = generateSchedule(shuffledTeams);

                // Include LeagueID in each match
                const formattedSchedule = newSchedule.map((match) => ({
                    ...match,
                    LeagueID: activeLeague.LeagueID, // Add LeagueID here
                }));

                setSchedule(formattedSchedule);

                // Save the schedule in localStorage with a key based on LeagueID
                const key = `baseballSchedule_${activeLeague.LeagueID}`;
                localStorage.setItem(key, JSON.stringify(formattedSchedule));

                axios
                    .post("/baseballschedule", {
                        schedule: formattedSchedule,
                    })
                    .then(() => {
                        Swal.fire({
                            icon: "success",
                            title: "Teams Shuffled!",
                            text: "The teams have been shuffled, and the schedule has been saved.",
                        });
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: "error",
                            title: "Error Saving Schedule",
                            text: "There was an issue saving the schedule to the database.",
                        });
                    });
            }
        });
    };

    const generateSchedule = (shuffledTeams) => {
        const schedule = [];
        const teamCount = shuffledTeams.length;

        const matchups = [];
        for (let i = 0; i < teamCount; i++) {
            for (let j = i + 1; j < teamCount; j++) {
                matchups.push([shuffledTeams[i], shuffledTeams[j]]);
            }
        }

        const gameTimes = [
            "4:00 PM - 6:00 PM",
            "6:00 PM - 8:00 PM",
            "8:00 PM - 10:00 PM",
        ];

        const startDate = new Date();
        let currentDate = new Date(startDate);

        while (matchups.length > 0) {
            const gamesToday = matchups.splice(0, 3);
            gamesToday.forEach((pair, index) => {
                const matchTime = gameTimes[index];
                const formattedDate = currentDate.toISOString().split("T")[0];
                schedule.push({
                    team_1: pair[0].TeamName,
                    team_2: pair[1].TeamName,
                    date: formattedDate,
                    match_time: matchTime,
                });
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return schedule;
    };

    const handleClear = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, clear it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                setSchedule([]);
                // Remove the schedule from localStorage
                localStorage.removeItem("baseballSchedule");

                Swal.fire({
                    icon: "success",
                    title: "Cleared!",
                    text: "The schedule has been cleared successfully.",
                });
            }
        });
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
                        href={route("baseballteams.index")}
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
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Game Winner
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
                                    <td className="border border-gray-300 px-4 py-2">
                                        {getGameWinner(
                                            match.team_1,
                                            match.team_2
                                        )}
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

export default BaseballSchedule;
