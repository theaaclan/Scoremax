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

const BaseballScoreboard = () => {
    const { teams, baseballPlayers } = usePage().props;

    // Load state from localStorage on mount
    const loadStateFromLocalStorage = () => {
        const savedState = localStorage.getItem("baseballScoreboardState");
        return savedState ? JSON.parse(savedState) : defaultState;
    };

    const [count, setCount] = useState(() => {
        const savedCount = localStorage.getItem("baseballScoreboardCount");
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    const defaultState = {
        selectedTeams: { A: null, B: null },
        scores: { A: 0, B: 0 },
        players: { A: [], B: [] },
        mvp: "",
        count: 0,
    };

    const initialState = loadStateFromLocalStorage() || defaultState;
    const [selectedTeams, setSelectedTeams] = useState(
        initialState.selectedTeams
    );
    const [scores, setScores] = useState(initialState.scores);
    const [isRunning, setIsRunning] = useState(initialState.isRunning);
    const [players, setPlayers] = useState(initialState.players);
    const [period, setPeriod] = useState(initialState.period);
    const [mvp, setMVP] = useState(initialState.mvp);
    const [loading, setLoading] = useState(false);
    const [teamACheckedState, setTeamACheckedState] = useState(
        initialState.teamACheckedState || [false, false, false]
    );
    const [teamBCheckedState, setTeamBCheckedState] = useState(
        initialState.teamBCheckedState || [false, false]
    );
    const [teamCCheckedState, setTeamCCheckedState] = useState(
        initialState.teamCCheckedState || [false, false]
    );
    const [buttonsVisible, setButtonsVisible] = useState(false);

    const toggleButtonsVisibility = () => {
        setButtonsVisible((prevState) => !prevState);
    };

    const circleCheckedStyle = {
        content: "",
        width: "15px",
        height: "15px",
        backgroundColor: "red",
        borderRadius: "50%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 1, // Visible when checked
    };

    const circleUncheckedStyle = {
        ...circleCheckedStyle,
        opacity: 0, // Hidden when not checked
    };

    const handleTeamCheckboxChange = (team, index) => {
        let updatedState, setStateFn;

        // Determine the team state and corresponding state updater
        if (team === "A") {
            updatedState = [...teamACheckedState];
            setStateFn = setTeamACheckedState;
        } else if (team === "B") {
            updatedState = [...teamBCheckedState];
            setStateFn = setTeamBCheckedState;
        } else if (team === "C") {
            updatedState = [...teamCCheckedState];
            setStateFn = setTeamCCheckedState;
        }

        // Update the state for the clicked checkbox
        updatedState[index] = !updatedState[index];
        setStateFn(updatedState);

        // Check if all checkboxes are checked
        if (updatedState.every((isChecked) => isChecked)) {
            // Reset the checkboxes after 2 seconds
            setTimeout(() => {
                const resetState = updatedState.map(() => false);
                setStateFn(resetState);

                // Save the reset state to localStorage
                const currentState = {
                    selectedTeams,
                    scores,
                    players,
                    mvp,
                    count,
                    teamACheckedState:
                        team === "A" ? resetState : teamACheckedState,
                    teamBCheckedState:
                        team === "B" ? resetState : teamBCheckedState,
                    teamCCheckedState:
                        team === "C" ? resetState : teamCCheckedState,
                };
                localStorage.setItem(
                    "baseballScoreboardState",
                    JSON.stringify(currentState)
                );
            }, 2000);
        }
    };

    // Timer logic
    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 0) {
                        if (period < 4) {
                            setPeriod((prevPeriod) => prevPeriod + 1);
                            setIsRunning(false);
                            return 720;
                        }
                        clearInterval(interval);
                        return prev;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, period]);

    useEffect(() => {
        if (period === 3) {
            setTimeouts({ A: 3, B: 3 });
        }
    }, [period]);

    useEffect(() => {
        // Save state to localStorage whenever state changes
        const currentState = {
            selectedTeams,
            scores,
            players,
            mvp,
            count,
            teamACheckedState,
            teamBCheckedState,
            teamCCheckedState,
        };
        localStorage.setItem(
            "baseballScoreboardState",
            JSON.stringify(currentState)
        );
    }, [
        selectedTeams,
        scores,
        players,
        mvp,
        count,
        teamACheckedState,
        teamBCheckedState,
        teamCCheckedState,
    ]);

    const getPlayersByTeam = (teamId) =>
        baseballPlayers
            ?.filter((player) => player.TeamID === parseInt(teamId))
            .map((player) => ({
                ...player,
                runs: 0,
                hits: 0,
                home_runs: 0,
                strikeouts: 0,
                errors: 0,
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
                stat === "runs"
                    ? updatedPlayers.reduce(
                          (sum, player) => sum + player.runs,
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

    const calculateMVP = () => {
        // Combine all players from both teams
        const allPlayers = [...players.A, ...players.B];

        // Check if there are players available
        if (allPlayers.length === 0) return "No players available";

        // Calculate MVP by summing the relevant stats (, assists, rebounds, blocks)
        const mvp = allPlayers.reduce((bestPlayer, currentPlayer) => {
            const currentTotal =
                currentPlayer.runs +
                currentPlayer.hits +
                currentPlayer.home_runs +
                currentPlayer.strikeouts;

            const bestTotal =
                bestPlayer.runs +
                bestPlayer.hits +
                bestPlayer.home_runs +
                bestPlayer.strikeouts;

            return currentTotal > bestTotal ? currentPlayer : bestPlayer;
        });

        return mvp.FullName;
    };

    // Save count to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("baseballScoreboardCount", count);
    }, [count]);

    // Handle button click to increment count
    const handleIncrement = () => {
        setCount((prevCount) => prevCount + 1); // Increment count by 1
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
            await axios.post("http://127.0.0.1:8000/baseballmatchdetails", {
                match_details: matchDetails,
            });

            // Submit match score with the game winner
            await axios.post("http://127.0.0.1:8000/baseballmatchscore", {
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
                setCount(defaultState.count);
                setMVP(defaultState.mvp);
                setTeamACheckedState(
                    defaultState.teamACheckedState || [false, false, false]
                );
                setTeamBCheckedState(
                    defaultState.teamBCheckedState || [false, false]
                );
                setTeamCCheckedState(
                    defaultState.teamCCheckedState || [false, false]
                );

                // Also clear the localStorage
                localStorage.removeItem("baseballScoreboardState");

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
                                    "Runs",
                                    "Hits",
                                    "Home_Runs",
                                    "Strikeouts",
                                    "Errors",
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
                                        "runs",
                                        "hits",
                                        "home_runs",
                                        "strikeouts",
                                        "errors",
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
                <div className="container-style">
                    <span className="label-style"> Ball</span>
                    <div className="checkbox-group-style pointer-events-none">
                        {teamACheckedState.map((isChecked, index) => (
                            <label
                                key={index}
                                className="checkbox-wrapper-style"
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox-style"
                                    checked={isChecked}
                                    onChange={() =>
                                        handleTeamCheckboxChange("A", index)
                                    }
                                />
                                <span className="circle-style">
                                    <span
                                        style={
                                            isChecked
                                                ? circleCheckedStyle
                                                : circleUncheckedStyle
                                        }
                                    ></span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="container-style2 pointer-events-none">
                    <span className="label-style"> Strike</span>
                    <div className="checkbox-group-style">
                        {teamBCheckedState.map((isChecked, index) => (
                            <label
                                key={index}
                                className="checkbox-wrapper-style"
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox-style"
                                    checked={isChecked}
                                    onChange={() =>
                                        handleTeamCheckboxChange("B", index)
                                    }
                                />
                                <span className="circle-style">
                                    <span
                                        style={
                                            isChecked
                                                ? circleCheckedStyle
                                                : circleUncheckedStyle
                                        }
                                    ></span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="container-style3 pointer-events-none">
                    <span className="label-style"> Out</span>
                    <div className="checkbox-group-style">
                        {teamCCheckedState.map((isChecked, index) => (
                            <label
                                key={index}
                                className="checkbox-wrapper-style"
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox-style"
                                    checked={isChecked}
                                    onChange={() =>
                                        handleTeamCheckboxChange("C", index)
                                    }
                                />
                                <span className="circle-style">
                                    <span
                                        style={
                                            isChecked
                                                ? circleCheckedStyle
                                                : circleUncheckedStyle
                                        }
                                    ></span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

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
                        <div className="period-container pointer-events-none">
                            <div className="period-box">
                                <button
                                    onClick={handleIncrement}
                                    style={{
                                        fontSize: "20px",
                                        width: "100%",
                                    }}
                                >
                                    INN: {count}
                                </button>
                            </div>
                        </div>
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
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "20px",
                        backgroundColor: "#f4f4f9",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        maxWidth: "400px",
                        margin: "auto",
                    }}
                ></div>
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

export default BaseballScoreboard;
