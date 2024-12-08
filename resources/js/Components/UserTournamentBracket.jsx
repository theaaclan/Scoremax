import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2"; // Import SweetAlert2
import "@css/tournament.css";

const styles = {
    Title: {
        fontSize: "32px", // Default size for larger screens
        fontWeight: "bold",
        margin: "20px",
    },
    Branch_1: {
        height: "620px",
        width: "450px",
        flexWrap: "wrap",
        display: "flex",
    },
    Branch_2: {
        height: "300px",
        width: "400px",
        flexWrap: "wrap",
        display: "flex",
        marginTop: "160px",
    },
    Branch_3: {
        height: "150px",
        width: "400px",
        flexWrap: "wrap",
        display: "flex",
        marginTop: "240px",
    },

    Object_1_even: {
        display: "grid",
        gridTemplateColumns: "230px 100px",
        gridTemplateRows: "50px 50px",
        backgroundColor: "rgb(153, 153, 153)",
        width: "300px",
        paddingTop: "30px",
        paddingBottom: "25px",
        paddingLeft: "4px",
        border: "2px solid red",
        marginTop: "30px",
    },
    Object_1_odd: {
        position: "relative",
        display: "grid",
        gridTemplateColumns: "230px 100px",
        gridTemplateRows: "50px 50px",
        backgroundColor: "rgb(153, 153, 153)",
        width: "300px",
        paddingTop: "40px",
        paddingLeft: "4px",
        border: "2px solid red",
    },
    Name: {
        width: "210px",
        height: "40px",
        fontSize: "20px",
        borderRadius: "4px",
        backgroundColor: "white",
    },
    Button: {
        padding: "5px 20px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "4px",
        margin: "5px",
    },
};

const Bracket = () => {
    const { teams } = usePage().props; // Get the teams data from Inertia props

    // Load saved data from localStorage or set initial state
    const [selectedTeams, setSelectedTeams] = useState(
        () => JSON.parse(localStorage.getItem("selectedTeams")) || {}
    );
    const [results, setResults] = useState(
        () =>
            JSON.parse(localStorage.getItem("results")) || {
                Match1: null,
                Match2: null,
                Match3: null,
                Match4: null,
                Match5: null,
                Match6: null,
                Match7: null,
                Match8: null,
            }
    );

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

    // Save data to localStorage whenever `selectedTeams` or `results` changes
    useEffect(() => {
        localStorage.setItem("selectedTeams", JSON.stringify(selectedTeams));
    }, [selectedTeams]);

    useEffect(() => {
        localStorage.setItem("results", JSON.stringify(results));
    }, [results]);

    const handleAdvance = (teamId, matchId) => {
        if (!teamId) return; // Don't advance if no team is selected

        // Show confirmation alert before advancing
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to advance this team to the next match?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Advance!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // Store the winner of the match
                const updatedResults = {
                    ...results,
                    [matchId]: teamId,
                };
                setResults(updatedResults);

                // Advance to the next match if needed
                if (matchId === "Match1") {
                    setSelectedTeams((prev) => ({ ...prev, Player9: teamId }));
                } else if (matchId === "Match2") {
                    setSelectedTeams((prev) => ({ ...prev, Player10: teamId }));
                } else if (matchId === "Match3") {
                    setSelectedTeams((prev) => ({ ...prev, Player11: teamId }));
                } else if (matchId === "Match4") {
                    setSelectedTeams((prev) => ({ ...prev, Player12: teamId }));
                } else if (matchId === "Match5") {
                    setSelectedTeams((prev) => ({ ...prev, Player13: teamId }));
                } else if (matchId === "Match6") {
                    setSelectedTeams((prev) => ({ ...prev, Player14: teamId }));
                } else if (matchId === "Match7") {
                    setSelectedTeams((prev) => ({ ...prev, Player15: teamId }));
                }
            }
        });
    };
    const editable = false; // Set this to true or false based on your logic

    const renderMatch = (team1Id, team2Id, matchId, editable = true) => (
        <div style={styles.Object_1_even}>
            <div>
                <select
                    style={{
                        ...styles.Name,
                        backgroundColor: "white", // Ensure background is white
                        color: editable ? "black" : "black", // Text color
                        cursor: editable ? "pointer" : "not-allowed", // Pointer for editable
                        opacity: 1, // Force full opacity
                        border: "1px solid #ccc", // Clear, neutral border
                        boxShadow: "none", // Remove shadows
                        appearance: "none", // Remove default styling on some browsers
                        WebkitAppearance: "none", // For Safari
                        MozAppearance: "none", // For Firefox
                        backgroundImage: "none", // Remove the default background image
                    }}
                    id={team1Id}
                    value={selectedTeams[team1Id] || ""}
                    onChange={(e) => {
                        if (editable) {
                            const updatedTeams = {
                                ...selectedTeams,
                                [team1Id]: e.target.value,
                            };
                            setSelectedTeams(updatedTeams);
                        }
                    }}
                    disabled={!editable}
                >
                    <option value="">TBA</option>
                    {filteredTeams.map((team) => (
                        <option key={team.TeamID} value={team.TeamID}>
                            {team.TeamName}
                        </option>
                    ))}
                </select>
            </div>
            <div></div>
            <div>
                <select
                    style={{
                        ...styles.Name,
                        backgroundColor: "white", // Ensure background is white
                        color: editable ? "black" : "black", // Text color
                        cursor: editable ? "pointer" : "not-allowed", // Pointer for editable
                        opacity: 1, // Force full opacity
                        border: "1px solid #ccc", // Clear, neutral border
                        boxShadow: "none", // Remove shadows
                        appearance: "none", // Remove default styling on some browsers
                        WebkitAppearance: "none", // For Safari
                        MozAppearance: "none", // For Firefox
                        backgroundImage: "none", // Remove the default background image
                    }}
                    id={team2Id}
                    value={selectedTeams[team2Id] || ""}
                    onChange={(e) => {
                        if (editable) {
                            const updatedTeams = {
                                ...selectedTeams,
                                [team2Id]: e.target.value,
                            };
                            setSelectedTeams(updatedTeams);
                        }
                    }}
                    disabled={!editable}
                >
                    <option value="">TBA</option>
                    {filteredTeams.map((team) => (
                        <option key={team.TeamID} value={team.TeamID}>
                            {team.TeamName}
                        </option>
                    ))}
                </select>
            </div>
            <div></div>
        </div>
    );

    const branch1Matches = [
        { id1: "Player1", id2: "Player2", matchId: "Match1" },
        { id1: "Player3", id2: "Player4", matchId: "Match2" },
        { id1: "Player5", id2: "Player6", matchId: "Match3" },
        { id1: "Player7", id2: "Player8", matchId: "Match4" },
    ];

    const branch2Matches = [
        { id1: "Player9", id2: "Player10", matchId: "Match5" },
        { id1: "Player11", id2: "Player12", matchId: "Match6" },
    ];

    const branch3Matches = [
        { id1: "Player13", id2: "Player14", matchId: "Match7" },
    ];
    const branch4Matches = [{ id1: "Player15", id2: "", matchId: "Match8" }];

    return (
        <div className="flex">
            <div className="Container">
                {/* Branch 1 */}
                <div style={styles.Branch_1}>
                    <div style={styles.Title}> ELIMINATION</div>
                    {branch1Matches.map((match, index) => (
                        <React.Fragment key={`branch1-${index}`}>
                            {renderMatch(
                                match.id1,
                                match.id2,
                                match.matchId,
                                false
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div style={styles.Branch_2}>
                    <div style={styles.Title}> SEMI FINALS</div>
                    {branch2Matches.map((match, index) => (
                        <React.Fragment key={`branch2-${index}`}>
                            {renderMatch(
                                match.id1,
                                match.id2,
                                match.matchId,
                                false
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div style={styles.Branch_3}>
                    <div style={styles.Title}> FINALS</div>
                    {branch3Matches.map((match, index) => (
                        <React.Fragment key={`branch3-${index}`}>
                            {renderMatch(
                                match.id1,
                                match.id2,
                                match.matchId,
                                false
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="Branch_4">
                    <div style={styles.Title}>CHAMPION</div>
                    {branch4Matches.map((match) => (
                        <div style={styles.Object_1_odd} key={match.matchId}>
                            <div>
                                <select
                                    style={{
                                        ...styles.Name,
                                        backgroundColor: "white", // Ensure background is white
                                        color: "black", // Text color for read-only
                                        cursor: "not-allowed", // Change cursor to not-allowed for read-only
                                        opacity: 1, // Force full opacity
                                        border: "1px solid #ccc", // Clear, neutral border
                                        boxShadow: "none", // Remove shadows
                                        appearance: "none", // Remove default styling on some browsers
                                        WebkitAppearance: "none", // For Safari
                                        MozAppearance: "none", // For Firefox
                                        backgroundImage: "none", // Remove the default background image
                                    }}
                                    id={match.id1}
                                    value={selectedTeams[match.id1] || "TBA"} // Default to TBA if no team is selected
                                    onChange={() => {}} // No action needed since it's read-only
                                    disabled // Make it disabled (read-only)
                                >
                                    <option value="">TBA</option>
                                    {teams.map((team) => (
                                        <option
                                            key={team.TeamID}
                                            value={team.TeamID}
                                        >
                                            {team.TeamName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bracket;
