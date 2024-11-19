import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";
import "@css/tailwind.css";

const BasketballTeams = ({ teams, auth }) => {
    // Add auth prop
    // State variables for the form
    const [teamName, setTeamName] = useState("");
    const [coachName, setCoachName] = useState("");
    const [playerCount, setPlayerCount] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle form submission to add a new team
    const handleSubmit = (e) => {
        e.preventDefault();

        // Use authenticated user's ID
        const userId = auth.user.id;

        // If there's a selected team, update it
        if (selectedTeam) {
            Inertia.put(`/basketballteams/${selectedTeam.TeamID}`, {
                TeamName: teamName,
                CoachName: coachName,
                PlayerCount: playerCount,
                user_id: userId,
            });
        } else {
            // Create new team if no team is selected
            Inertia.post("/basketballteams", {
                TeamName: teamName,
                CoachName: coachName,
                PlayerCount: playerCount,
                user_id: userId,
            });
        }

        // Clear form and close modal
        setTeamName("");
        setCoachName("");
        setPlayerCount("");
        setIsModalOpen(false);
        setSelectedTeam(null);
    };

    // Handle deleting a team
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this team?")) {
            Inertia.delete(`/basketballteams/${id}`);
        }
    };

    // Handle opening the edit modal
    const handleEdit = (team) => {
        setSelectedTeam(team);
        setTeamName(team.TeamName);
        setCoachName(team.CoachName);
        setPlayerCount(team.PlayerCount);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <div style={styles.container}>
                <h1 style={styles.title}>Basketball Teams</h1>

                {/* Form to add a new team */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Team Name"
                        required
                        style={styles.input}
                    />
                    <input
                        type="text"
                        value={coachName}
                        onChange={(e) => setCoachName(e.target.value)}
                        placeholder="Coach Name"
                        required
                        style={styles.input}
                    />
                    <input
                        type="number"
                        value={playerCount}
                        onChange={(e) => setPlayerCount(e.target.value)}
                        placeholder="Player Count"
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>
                        {selectedTeam ? "Update Team" : "Add Team"}{" "}
                        {/* Dynamically change button text */}
                    </button>
                </form>

                {/* Table to display all basketball teams */}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Team Name</th>
                            <th style={styles.tableHeader}>Coach Name</th>
                            <th style={styles.tableHeader}>Player Count</th>
                            <th style={styles.tableHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => (
                            <tr key={team.TeamID} style={styles.tableRow}>
                                <td>{team.TeamName}</td>
                                <td>{team.CoachName}</td>
                                <td>{team.PlayerCount}</td>
                                <td style={styles.actions}>
                                    {/* Edit button opens modal */}
                                    <button
                                        onClick={() => handleEdit(team)}
                                        style={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                    {/* Delete button */}
                                    <button
                                        onClick={() =>
                                            handleDelete(team.TeamID)
                                        }
                                        style={styles.deleteButton}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for editing a team */}
                {isModalOpen && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h2 style={styles.modalTitle}>Edit Team</h2>
                            <form
                                onSubmit={handleSubmit}
                                style={styles.modalForm}
                            >
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) =>
                                        setTeamName(e.target.value)
                                    }
                                    placeholder="Team Name"
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="text"
                                    value={coachName}
                                    onChange={(e) =>
                                        setCoachName(e.target.value)
                                    }
                                    placeholder="Coach Name"
                                    required
                                    style={styles.input}
                                />
                                <input
                                    type="number"
                                    value={playerCount}
                                    onChange={(e) =>
                                        setPlayerCount(e.target.value)
                                    }
                                    placeholder="Player Count"
                                    required
                                    style={styles.input}
                                />
                                <div style={styles.modalActions}>
                                    <button type="submit" style={styles.button}>
                                        Update Team
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        style={styles.closeButton}
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

const styles = {
    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "400px",
        margin: "0 auto 20px",
    },
    input: {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 15px",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
    },
    tableHeader: {
        padding: "12px",
        textAlign: "left",
        backgroundColor: "#4CAF50",
        color: "#fff",
    },
    tableRow: {
        borderBottom: "1px solid #ddd",
    },
    actions: {
        display: "flex",
        gap: "10px",
    },
    editButton: {
        padding: "5px 10px",
        backgroundColor: "#ffa500",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    deleteButton: {
        padding: "5px 10px",
        backgroundColor: "#f44336",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "400px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    modalTitle: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    modalForm: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    modalActions: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
    },
    closeButton: {
        padding: "10px 15px",
        backgroundColor: "#ccc",
        color: "#000",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default BasketballTeams;
