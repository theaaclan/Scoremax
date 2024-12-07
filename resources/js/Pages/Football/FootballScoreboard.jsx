import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import "../../../css/scoreboard.css";
import "@css/tailwind.css";

const FootballScoreboard = () => {
    const { teams, footballPlayers } = usePage().props;

    // Load state from localStorage on mount
    const loadStateFromLocalStorage = () => {
        const savedState = localStorage.getItem("footballScoreboardState");
        return savedState ? JSON.parse(savedState) : null;
    };

    // Default state if no saved state is found
    const defaultState = {
        selectedTeams: { A: null, B: null },
        scores: { A: 0, B: 0 },
        timer: 2700, // 45 minutes in seconds
        isRunning: false,
        players: { A: [], B: [] },
        period: 1,
        editable: false,
        mvp: "",
    };

    const initialState = loadStateFromLocalStorage() || defaultState;

    const [selectedTeams, setSelectedTeams] = useState(
        initialState.selectedTeams
    );
    const [scores, setScores] = useState(initialState.scores);
    const [timer, setTimer] = useState(initialState.timer);
    const [isRunning, setIsRunning] = useState(initialState.isRunning);
    const [players, setPlayers] = useState(initialState.players);
    const [period, setPeriod] = useState(initialState.period);
    const [editable, setEditable] = useState(initialState.editable);
    const [mvp, setMVP] = useState(initialState.mvp);
    const [loading, setLoading] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(false);

    const toggleButtonsVisibility = () => {
        setButtonsVisible((prevState) => !prevState);
    };

    const [filteredTeams, setFilteredTeams] = useState([]);

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

    // Timer logic
    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 0) {
                        if (period === 1) {
                            // End of first half
                            setTimer(900); // 15 minutes in seconds
                            setIsRunning(false); // Pause for the break
                            setPeriod((prevPeriod) => prevPeriod + 1); // Increment period after the first 45 minutes
                        } else if (period === 2) {
                            // End of break
                            setTimer(2700); // 45 minutes in seconds
                            setIsRunning(false); // Pause before second half starts
                        } else if (period === 3) {
                            // End of match
                            clearInterval(interval);
                        }
                        return prev;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, period]);

    useEffect(() => {
        // Save state to localStorage whenever state changes
        const currentState = {
            selectedTeams,
            scores,
            timer,
            isRunning,
            players,
            period,
            editable,
            mvp,
        };
        localStorage.setItem(
            "footballScoreboardState",
            JSON.stringify(currentState)
        );
    }, [
        selectedTeams,
        scores,
        timer,
        isRunning,
        players,
        period,
        editable,
        mvp,
    ]);

    const formatTime = (seconds) =>
        `${Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

    const getPlayersByTeam = (teamId) =>
        footballPlayers
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

    const handleStatChange = (teamKey, playerId, stat, change) => {
        setPlayers((prev) => {
            const updatedPlayers = prev[teamKey].map((player) =>
                player.PlayerID === playerId
                    ? { ...player, [stat]: Math.max(0, player[stat] + change) }
                    : player
            );

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

    const handleTimeChange = (e) => {
        const value = e.target.value;
        const [minutes, seconds] = value.split(":").map((num) => parseInt(num));
        if (
            !isNaN(minutes) &&
            !isNaN(seconds) &&
            minutes >= 0 &&
            seconds >= 0 &&
            seconds < 60
        ) {
            setTimer(minutes * 60 + seconds);
        }
    };

    const handleTimeClick = () => {
        if (!isRunning) {
            setEditable(true);
        }
    };

    const handleTimeBlur = () => {
        setEditable(false);
    };

    const calculateMVP = () => {
        // Combine all players from both teams
        const allPlayers = [...players.A, ...players.B];

        // Check if there are players available
        if (allPlayers.length === 0) return "No players available";

        // Calculate MVP by summing the relevant stats (points, assists, rebounds, blocks)
        const mvp = allPlayers.reduce((bestPlayer, currentPlayer) => {
            const currentTotal =
                currentPlayer.points +
                currentPlayer.assists +
                currentPlayer.rebounds +
                currentPlayer.blocks;

            const bestTotal =
                bestPlayer.points +
                bestPlayer.assists +
                bestPlayer.rebounds +
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
            await axios.post("http://127.0.0.1:8000/footballmatchdetails", {
                match_details: matchDetails,
            });

            // Submit match score with the game winner
            await axios.post("http://127.0.0.1:8000/footballmatchscore", {
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
                setTimer(defaultState.timer);
                setIsRunning(defaultState.isRunning);
                setPlayers(defaultState.players);
                setPeriod(defaultState.period);
                setEditable(defaultState.editable);
                setTimeouts(defaultState.timeouts);
                setMVP(defaultState.mvp);

                // Also clear the localStorage
                localStorage.removeItem("footballScoreboardState");

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
        <AuthenticatedLayout>
            <div className="scoreboard-container flex flex-col md:flex-row justify-between items-center">
                <div className="gear">
                    {/* Gear Icon Button */}
                    <FontAwesomeIcon
                        icon={faGear}
                        style={{
                            fontSize: "2rem",
                            cursor: "pointer",
                        }}
                        onClick={toggleButtonsVisibility}
                    />

                    {/* Action Buttons in Column */}
                    {buttonsVisible && (
                        <div className="action-buttons flex flex-col gap-2 mt-4">
                            <button
                                className={`bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg ${
                                    loading ? "cursor-not-allowed" : ""
                                }`}
                                onClick={() => setMVP(calculateMVP())}
                                disabled={loading}
                            >
                                {loading ? "Calculating..." : "Calculate MVP"}
                            </button>
                            {mvp && (
                                <p className="mvp-text mt-2 font-bold text-gray-700">
                                    MVP: {mvp}
                                </p>
                            )}

                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                onClick={handleSubmitMatchDetailsAndScore}
                                disabled={loading}
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Match Details and Score"}
                            </button>

                            <button
                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                onClick={clearState}
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                <div className="scoreboard">
                    <div className="scoreboard-scores">
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
                                    {filteredTeams.map((team) => (
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
                        <div className="period-container">
                            <div className="period-box">Quarter: {period}</div>
                        </div>
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
                                    {filteredTeams.map((team) => (
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

                <div className="timer-container">
                    <button
                        className={`timer-button ${
                            isRunning ? "timer-button-pause" : ""
                        }`}
                        onClick={() => setIsRunning(!isRunning)}
                    >
                        {isRunning ? "Pause" : "Start"}
                    </button>

                    {editable ? (
                        <input
                            type="text"
                            className="timer timer-edit-input"
                            value={formatTime(timer)}
                            onChange={handleTimeChange}
                            onBlur={handleTimeBlur}
                            autoFocus
                        />
                    ) : (
                        <span className="timer" onClick={handleTimeClick}>
                            {formatTime(timer)}
                        </span>
                    )}
                </div>

                {/* Player Tables Section */}
                <div className="player-tables-section">
                    {renderPlayerTable("A")}
                    {renderPlayerTable("B")}
                </div>
            </div>
            <ToastContainer />
        </AuthenticatedLayout>
    );
};

export default FootballScoreboard;
