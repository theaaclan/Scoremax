import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

const styles = {
    Container: {
        display: "flex",
        marginTop: "130px",
        marginLeft: "120px",
    },
    Title: {
        fontSize: "32px",
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
        paddingTop: "40px",
        paddingLeft: "4px",
    },
    Object_1_odd: {
        display: "grid",
        gridTemplateColumns: "230px 100px",
        gridTemplateRows: "50px 50px",
        backgroundColor: "rgb(110, 110, 110)",
        width: "300px",
        paddingTop: "40px",
        paddingLeft: "4px",
    },
    Name: {
        width: "210px",
        height: "40px",
        fontSize: "20px",
        borderRadius: "4px",
    },
};

const Bracket = () => {
    const { teams } = usePage().props; // Get the teams data from Inertia props

    // Load initial selected teams and results from localStorage
    const loadSavedData = () => {
        const savedTeams = localStorage.getItem("selectedTeams");
        const savedResults = localStorage.getItem("results");
        return {
            teams: savedTeams ? JSON.parse(savedTeams) : {},
            results: savedResults ? JSON.parse(savedResults) : {},
        };
    };

    const [selectedTeams, setSelectedTeams] = useState(loadSavedData().teams);
    const [results, setResults] = useState(loadSavedData().results);

    // Save data to localStorage on change
    const saveData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // Handle team selection change
    const handleTeamSelectChange = (e) => {
        const { id, value } = e.target;
        setSelectedTeams((prevSelectedTeams) => {
            const updatedTeams = { ...prevSelectedTeams, [id]: value };
            saveData("selectedTeams", updatedTeams);
            return updatedTeams;
        });
    };

    // Handle result change
    const handleResultChange = (e) => {
        const { id, value } = e.target;
        setResults((prevResults) => {
            const updatedResults = {
                ...prevResults,
                [id]: parseInt(value, 10),
            };
            saveData("results", updatedResults);
            return updatedResults;
        });
    };

    const renderMatch = (team1Id, team2Id, result1, result2, isEven) => (
        <div style={isEven ? styles.Object_1_even : styles.Object_1_odd}>
            <div>
                <select
                    style={styles.Name}
                    id={team1Id}
                    value={selectedTeams[team1Id] || ""}
                    onChange={handleTeamSelectChange}
                >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.TeamID} value={team.TeamID}>
                            {team.TeamName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <select
                    id={result1}
                    value={results[result1] || 0}
                    onChange={handleResultChange}
                >
                    {[0, 1, 2, 3].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <select
                    style={styles.Name}
                    id={team2Id}
                    value={selectedTeams[team2Id] || ""}
                    onChange={handleTeamSelectChange}
                >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.TeamID} value={team.TeamID}>
                            {team.TeamName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <select
                    id={result2}
                    value={results[result2] || 0}
                    onChange={handleResultChange}
                >
                    {[0, 1, 2, 3].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    const branch1Players = [
        {
            id1: "Player1",
            id2: "Player2",
            resultId1: "Result1",
            resultId2: "Result2",
        },
        {
            id1: "Player3",
            id2: "Player4",
            resultId1: "Result3",
            resultId2: "Result4",
        },
        {
            id1: "Player5",
            id2: "Player6",
            resultId1: "Result5",
            resultId2: "Result6",
        },
        {
            id1: "Player7",
            id2: "Player8",
            resultId1: "Result7",
            resultId2: "Result8",
        },
    ];

    const branch2Players = [
        {
            id1: "Player9",
            id2: "Player10",
            resultId1: "Result9",
            resultId2: "Result10",
        },
        {
            id1: "Player11",
            id2: "Player12",
            resultId1: "Result11",
            resultId2: "Result12",
        },
    ];

    const branch3Players = [
        {
            id1: "Player13",
            id2: "Player14",
            resultId1: "Result13",
            resultId2: "Result14",
        },
    ];

    return (
        <div>
            <h1 style={styles.Title}>Basketball Tournament Bracket</h1>
            <div style={styles.Container}>
                {/* Branch 1 */}
                <div style={styles.Branch_1}>
                    {branch1Players.map((match, index) => (
                        <React.Fragment key={`branch1-${index}`}>
                            {renderMatch(
                                match.id1,
                                match.id2,
                                match.resultId1,
                                match.resultId2,
                                index % 2 === 0
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Branch 2 */}
                <div style={styles.Branch_2}>
                    {branch2Players.map((match, index) => (
                        <React.Fragment key={`branch2-${index}`}>
                            {renderMatch(
                                match.id1,
                                match.id2,
                                match.resultId1,
                                match.resultId2,
                                index % 2 === 0
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Branch 3 */}
                <div style={styles.Branch_3}>
                    {branch3Players.map((match, index) => (
                        <React.Fragment key={`branch3-${index}`}>
                            {renderMatch(
                                match.id1,
                                match.id2,
                                match.resultId1,
                                match.resultId2,
                                index % 2 === 0
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bracket;
