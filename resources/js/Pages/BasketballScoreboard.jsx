import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "../../css/scoreboard.css";

const BasketballScoreboard = () => {
    const { teams, basketballPlayers } = usePage().props;

    const [selectedTeams, setSelectedTeams] = useState({ A: null, B: null });
    const [scores, setScores] = useState({ A: 0, B: 0 });
    const [timer, setTimer] = useState(720); // 12 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [players, setPlayers] = useState({ A: [], B: [] });

    // Timer logic
    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning]);

    const formatTime = (seconds) =>
        `${Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

    const getPlayersByTeam = (teamId) =>
        basketballPlayers
            ?.filter((player) => player.TeamID === parseInt(teamId))
            .map((player) => ({
                ...player,
                points: 0,
                assists: 0,
                rebounds: 0,
                blocks: 0,
                fouls: 0,
            }));

    const handleTeamChange = (teamKey, teamId) => {
        setSelectedTeams((prev) => ({ ...prev, [teamKey]: teamId }));
        setPlayers((prev) => ({
            ...prev,
            [teamKey]: getPlayersByTeam(teamId),
        }));
    };

    const handleStatChange = (teamKey, playerId, stat, value) => {
        setPlayers((prev) => {
            const updatedPlayers = prev[teamKey].map((player) =>
                player.PlayerID === playerId
                    ? { ...player, [stat]: parseInt(value) || 0 }
                    : player
            );

            // Recalculate team score only for "points"
            const updatedScore =
                stat === "points"
                    ? updatedPlayers.reduce(
                          (sum, player) => sum + player.points,
                          0
                      )
                    : scores[teamKey];

            setScores((prevScores) => ({
                ...prevScores,
                [teamKey]: updatedScore,
            }));

            return { ...prev, [teamKey]: updatedPlayers };
        });
    };

    const renderPlayerTable = (teamKey) => {
        const teamId = selectedTeams[teamKey];
        const teamName = teams.find(
            (team) => team.TeamID === parseInt(teamId)
        )?.TeamName;
        const teamPlayers = players[teamKey];

        const tableClass =
            teamKey === "A" ? "player-board-left" : "player-board-right";

        return (
            teamId && (
                <div className={tableClass}>
                    <h2 className="text-center">{teamName} Players</h2>
                    <table className="players-table">
                        <thead>
                            <tr>
                                {[
                                    "Player Name",
                                    "Points",
                                    "Assists",
                                    "Rebounds",
                                    "Blocks",
                                    "Fouls",
                                ].map((header) => (
                                    <th
                                        className="players-table-cell"
                                        key={header}
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {teamPlayers.map((player) => (
                                <tr key={player.PlayerID}>
                                    <td className="players-table-cell">
                                        {player.FullName}
                                    </td>
                                    {[
                                        "points",
                                        "assists",
                                        "rebounds",
                                        "blocks",
                                        "fouls",
                                    ].map((stat) => (
                                        <td
                                            className="players-table-cell"
                                            key={stat}
                                        >
                                            <input
                                                className="input"
                                                type="number"
                                                value={player[stat]}
                                                onChange={(e) =>
                                                    handleStatChange(
                                                        teamKey,
                                                        player.PlayerID,
                                                        stat,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        );
    };

    return (
        <AuthenticatedLayout>
            <div className="scoreboard-container">
                <div className="timer-container">
                    <button
                        className={`timer-button ${
                            isRunning ? "timer-button-pause" : ""
                        }`}
                        onClick={() => setIsRunning(!isRunning)}
                    >
                        {isRunning ? "Pause" : "Start"}
                    </button>
                    <span className="timer">{formatTime(timer)}</span>
                </div>

                <div className="scoreboard-and-tables">
                    {/* Team A Players Table */}
                    {renderPlayerTable("A")}

                    {/* Score Left Container */}
                    <div className="score-left">
                        <div className="dropdown-container">
                            <select
                                className="select"
                                onChange={(e) =>
                                    handleTeamChange("A", e.target.value)
                                }
                                value={selectedTeams.A || ""}
                            >
                                <option value="" disabled>
                                    Select a team
                                </option>
                                {teams.map((team) => (
                                    <option
                                        key={team.TeamID}
                                        value={team.TeamID}
                                    >
                                        {team.TeamName}
                                    </option>
                                ))}
                            </select>
                            <h3 className="score-text">{scores.A}</h3>
                        </div>
                    </div>

                    {/* Score Right Container */}
                    <div className="score-right">
                        <div className="dropdown-container">
                            <select
                                className="select"
                                onChange={(e) =>
                                    handleTeamChange("B", e.target.value)
                                }
                                value={selectedTeams.B || ""}
                            >
                                <option value="" disabled>
                                    Select a team
                                </option>
                                {teams.map((team) => (
                                    <option
                                        key={team.TeamID}
                                        value={team.TeamID}
                                    >
                                        {team.TeamName}
                                    </option>
                                ))}
                            </select>
                            <h3 className="score-text">{scores.B}</h3>
                        </div>
                    </div>

                    {/* Team B Players Table */}
                    {renderPlayerTable("B")}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BasketballScoreboard;
