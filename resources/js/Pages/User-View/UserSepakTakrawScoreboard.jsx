import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import Navbar from "@/Layouts/Navbar";
import "../../../css/scoreboard.css";
import "@css/tailwind.css";

const SepaktakrawScoreboard = () => {
    const { teams, sepaktakrawPlayers } = usePage().props;

    // Default state if no saved state is found
    const defaultState = {
        selectedTeams: { A: null, B: null },
        scores: { A: 0, B: 0 },
        players: { A: [], B: [] },
        editable: false,
        mvp: "",
        sets: { A: 0, B: 0 },
    };

    const [selectedTeams, setSelectedTeams] = useState(
        defaultState.selectedTeams
    );
    const [scores, setScores] = useState(defaultState.scores);
    const [players, setPlayers] = useState(defaultState.players);
    const [mvp, setMVP] = useState(defaultState.mvp);
    const [loading, setLoading] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(false);

    const toggleButtonsVisibility = () => {
        setButtonsVisible((prevState) => !prevState);
    };

    useEffect(() => {
        // Save state to localStorage whenever state changes
        const currentState = {
            selectedTeams,
            scores,
            players,
            mvp,
        };
        localStorage.setItem(
            "sepaktakrawScoreboardState",
            JSON.stringify(currentState)
        );
    }, [selectedTeams, scores, players, mvp]);

    const getPlayersByTeam = (teamId) =>
        sepaktakrawPlayers
            ?.filter((player) => player.TeamID === parseInt(teamId))
            .map((player) => ({
                ...player,
                kills: 0,
                aces: 0,
                digs: 0,
                blocks: 0,
                service_errors: 0,
            }));

    const handleTeamChange = (teamKey, teamId) => {
        setSelectedTeams((prev) => ({ ...prev, [teamKey]: teamId }));
        setPlayers((prev) => ({
            ...prev,
            [teamKey]: getPlayersByTeam(teamId),
        }));
    };

    const handleStatChange = (teamKey, playerId, stat, change) => {
        setPlayers((prev) => {
            const updatedPlayers = prev[teamKey].map((player) =>
                player.PlayerID === playerId
                    ? { ...player, [stat]: Math.max(0, player[stat] + change) }
                    : player
            );

            const updatedScore =
                stat === "kills"
                    ? updatedPlayers.reduce(
                          (sum, player) => sum + player.kills,
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

    const [sets, setSets] = useState({ A: 1, B: 1 }); // State for set scores

    const handleSetChange = (teamKey) => {
        setSets((prevSets) => ({
            ...prevSets,
            [teamKey]: prevSets[teamKey] + 1,
        }));
        setScores({ A: 1, B: 1 }); // Reset the scores
    };

    const calculateMVP = () => {
        // Combine all players from both teams
        const allPlayers = [...players.A, ...players.B];

        // Check if there are players available
        if (allPlayers.length === 0) return "No players available";

        // Calculate MVP by summing the relevant stats (points, assists, rebounds, blocks)
        const mvp = allPlayers.reduce((bestPlayer, currentPlayer) => {
            const currentTotal =
                currentPlayer.kills +
                currentPlayer.aces +
                currentPlayer.digs +
                currentPlayer.blocks;

            const bestTotal =
                bestPlayer.kills +
                bestPlayer.aces +
                bestPlayer.digs +
                bestPlayer.blocks;

            return currentTotal > bestTotal ? currentPlayer : bestPlayer;
        });

        return mvp.FullName;
    };

    const handleSubmitMatchDetailsAndScore = async () => {
        setLoading(true);
        try {
            // Validate player data
            const allPlayers = [...players.A, ...players.B];
            if (
                allPlayers.some(
                    (player) =>
                        player.points == null ||
                        player.assists == null ||
                        player.rebounds == null ||
                        player.blocks == null ||
                        player.fouls == null
                )
            ) {
                Swal.fire({
                    icon: "error",
                    title: "Missing Information",
                    text: "Please enter all player statistics before submitting.",
                });
                return;
            }

            // Validate team scores
            if (!scores.A || !scores.B) {
                Swal.fire({
                    icon: "error",
                    title: "Scores Missing",
                    text: "Please enter both team scores before submitting.",
                });
                return;
            }

            // Determine the game winner
            let gameWinner;
            if (scores.A > scores.B) {
                gameWinner = teams.find(
                    (team) => team.TeamID === parseInt(selectedTeams.A)
                )?.TeamName;
            } else if (scores.B > scores.A) {
                gameWinner = teams.find(
                    (team) => team.TeamID === parseInt(selectedTeams.B)
                )?.TeamName;
            } else {
                gameWinner = "Draw"; // Handle tie scenarios
            }

            // Prepare match details
            const matchDetails = allPlayers.map((player) => ({
                team_id: player.TeamID,
                player_id: player.PlayerID,
                points: player.points,
                assists: player.assists,
                rebounds: player.rebounds,
                blocks: player.blocks,
                fouls: player.fouls,
            }));

            // Prepare match score
            const team1 = teams.find(
                (team) => team.TeamID === parseInt(selectedTeams.A)
            );
            const team2 = teams.find(
                (team) => team.TeamID === parseInt(selectedTeams.B)
            );

            // Submit match details
            await axios.post("http://127.0.0.1:8000/sepaktakrawmatchdetails", {
                match_details: matchDetails,
            });

            // Submit match score with the game winner
            await axios.post("http://127.0.0.1:8000/sepaktakrawmatchscore", {
                team1_name: team1.TeamName,
                team2_name: team2.TeamName,
                team1_score: scores.A,
                team2_score: scores.B,
                game_winner: gameWinner, // Include the game winner
            });

            // Single success notification
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Match details and scores submitted successfully!",
                timer: 3000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Error submitting match details or scores:",
                error.response?.data
            );
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: `Failed to submit match details or scores. ${
                    error.response?.data?.message ||
                    "Please check the console for more details."
                }`,
            });
        } finally {
            setLoading(false);
        }
    };

    const clearState = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will clear the scoreboard!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, clear it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedTeams(defaultState.selectedTeams);
                setScores(defaultState.scores);
                setPlayers(defaultState.players);
                setMVP(defaultState.mvp);
                setSets(defaultState.sets);

                // Also clear the localStorage
                localStorage.removeItem("sepaktakrawScoreboardState");

                Swal.fire({
                    icon: "success",
                    title: "Cleared!",
                    text: "Scoreboard has been cleared successfully.",
                });
            }
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
                                    "Kills",
                                    "Aces",
                                    "Digs",
                                    "Blocks",
                                    "Service_Errors",
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
                                        "kills",
                                        "aces",
                                        "digs",
                                        "blocks",
                                        "service_errors",
                                    ].map((stat) => (
                                        <td
                                            className="players-table-cell"
                                            key={stat}
                                        >
                                            <div className="button-counter">
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() =>
                                                        handleStatChange(
                                                            teamKey,
                                                            player.PlayerID,
                                                            stat,
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                                <span>{player[stat]}</span>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleStatChange(
                                                            teamKey,
                                                            player.PlayerID,
                                                            stat,
                                                            -1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                            </div>
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
        <div>
            <Navbar />
            <div className="scoreboard-container flex flex-col md:flex-row justify-between items-center">
                <div className="scoreboard">
                    <div className="timer-container"></div>

                    <div className="scoreboard-scores">
                        <div className="score-left">
                            <div className="dropdown-container pointer-events-none">
                                <select
                                    className="select"
                                    onChange={(e) =>
                                        handleTeamChange("A", e.target.value)
                                    }
                                    value={selectedTeams.A || ""}
                                >
                                    <option value="" disabled>
                                        TBA
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
                        <div className="period-container"></div>
                        <div className="score-right">
                            <div className="dropdown-container pointer-events-none">
                                <select
                                    className="select"
                                    onChange={(e) =>
                                        handleTeamChange("B", e.target.value)
                                    }
                                    value={selectedTeams.B || ""}
                                >
                                    <option value="" disabled>
                                        TBA
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
                    </div>
                </div>

                <div className="set-buttons-a pointer-events-none">
                    <button
                        className="btn btn-primary set-button"
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            borderRadius: "10px",
                            margin: "10px",
                            padding: "15px 30px",
                            fontSize: "18px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => handleSetChange("A")}
                    >
                        Sets: {sets.A}
                    </button>
                </div>

                <div className="set-buttons-b pointer-events-none">
                    <button
                        className="btn btn-primary set-button"
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            borderRadius: "10px",
                            margin: "10px",
                            padding: "15px 30px",
                            fontSize: "18px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => handleSetChange("B")}
                    >
                        Sets: {sets.B}
                    </button>
                </div>

                {/* Player Tables Section */}
                <div className="player-tables-section">
                    {renderPlayerTable("A")}
                    {renderPlayerTable("B")}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SepaktakrawScoreboard;
