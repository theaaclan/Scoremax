import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import "@css/tailwind.css";

const BasketballPlayers = ({ players, teams, auth }) => {
    // State variables
    const [fullName, setFullName] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [position, setPosition] = useState("");
    const [jerseyNum, setJerseyNum] = useState("");
    const [teamID, setTeamID] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle form submission to add or update a player
    const handleSubmit = (e) => {
        e.preventDefault();

        const userId = auth.user.id; // Use authenticated user's ID

        if (selectedPlayer) {
            // Update player
            Inertia.put(`/basketballplayers/${selectedPlayer.PlayerID}`, {
                FullName: fullName,
                Height: height,
                Weight: weight,
                Position: position,
                Jersey_num: jerseyNum,
                TeamID: teamID,
                user_id: userId,
            });
        } else {
            // Add new player
            Inertia.post("/basketballplayers", {
                FullName: fullName,
                Height: height,
                Weight: weight,
                Position: position,
                Jersey_num: jerseyNum,
                TeamID: teamID,
                user_id: userId,
            });
        }

        // Reset form and close modal
        setFullName("");
        setHeight("");
        setWeight("");
        setPosition("");
        setJerseyNum("");
        setTeamID("");
        setIsModalOpen(false);
        setSelectedPlayer(null);
    };

    // Handle deleting a player
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this player?")) {
            Inertia.delete(`/basketballplayers/${id}`);
        }
    };

    // Handle editing a player
    const handleEdit = (player) => {
        setSelectedPlayer(player);
        setFullName(player.FullName);
        setHeight(player.Height);
        setWeight(player.Weight);
        setPosition(player.Position);
        setJerseyNum(player.Jersey_num);
        setTeamID(player.TeamID);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <div style={styles.container}>
                <h1 style={styles.title}>Basketball Players</h1>

                {/* Form to add a new player */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        required
                        style={styles.input}
                    />
                    <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Height"
                        required
                        style={styles.input}
                    />
                    <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Weight"
                        required
                        style={styles.input}
                    />
                    <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="Position"
                        required
                        style={styles.input}
                    />
                    <input
                        type="number"
                        value={jerseyNum}
                        onChange={(e) => setJerseyNum(e.target.value)}
                        placeholder="Jersey Number"
                        required
                        style={styles.input}
                    />
                    <select
                        value={teamID}
                        onChange={(e) => setTeamID(e.target.value)}
                        required
                        style={styles.select}
                    >
                        <option value="">Select Team</option>
                        {teams.map((team) => (
                            <option key={team.TeamID} value={team.TeamID}>
                                {team.TeamName}
                            </option>
                        ))}
                    </select>
                    <button type="submit" style={styles.button}>
                        {selectedPlayer ? "Update Player" : "Add Player"}
                    </button>
                </form>

                {/* Table to display players */}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Full Name</th>
                            <th style={styles.tableHeader}>Height</th>
                            <th style={styles.tableHeader}>Weight</th>
                            <th style={styles.tableHeader}>Position</th>
                            <th style={styles.tableHeader}>Jersey #</th>
                            <th style={styles.tableHeader}>Team</th>
                            <th style={styles.tableHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.PlayerID} style={styles.tableRow}>
                                <td>{player.FullName}</td>
                                <td>{player.Height}</td>
                                <td>{player.Weight}</td>
                                <td>{player.Position}</td>
                                <td>{player.Jersey_num}</td>
                                <td>{player.TeamName}</td>
                                <td style={styles.actions}>
                                    <button
                                        onClick={() => handleEdit(player)}
                                        style={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(player.PlayerID)
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

export default BasketballPlayers;
