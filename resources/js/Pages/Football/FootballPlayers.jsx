import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Draggable from "react-draggable";
import Swal from "sweetalert2";
import React, { useEffect, useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const FootballPlayers = ({ players: initialPlayers = [], teams, auth }) => {
    const [players, setPlayers] = useState(initialPlayers);
    const [searchTerm, setSearchTerm] = useState(""); // State for search
    const [form, setForm] = useState({
        FullName: "",
        Height: "",
        Weight: "",
        Position: "",
        Jersey_num: "",
        TeamID: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [matchDetails, setMatchDetails] = useState([]);
    const modalRef = useRef(null);
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

    const resetForm = () => {
        setForm({
            FullName: "",
            Height: "",
            Weight: "",
            Position: "",
            Jersey_num: "",
            TeamID: "",
        });
        setSelectedPlayer(null);
    };

    const openModal = (player = null) => {
        if (player) {
            setForm({ ...player });
            setSelectedPlayer(player);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const openHistoryModal = () => {
        setIsHistoryModalOpen(true);
        fetchMatchDetails();
    };

    const closeHistoryModal = () => {
        setIsHistoryModalOpen(false);
    };

    const fetchMatchDetails = () => {
        axios
            .get("/footballmatchdetails")
            .then((response) => {
                setMatchDetails(response.data);
            })
            .catch(() => {
                toast.error("Error fetching match details.");
            });
    };
    const [selectedStat, setSelectedStat] = useState("");

    const handleDropdownChange = (criteria) => {
        if (!criteria) {
            setSelectedStat("");
            return;
        }

        const getPlayerByCriteria = (criteria) => {
            if (!matchDetails || matchDetails.length === 0) return null;

            return matchDetails.reduce((max, player) => {
                const statKey = criteria.replace("highest", "");
                if (!statKey) return null;

                if (criteria === "highestTotal") {
                    // Only include Goals and Assists in the total computation
                    const totalMax = (max.Goals || 0) + (max.Assists || 0);
                    const totalPlayer =
                        (player.Goals || 0) + (player.Assists || 0);
                    return totalPlayer > totalMax ? player : max;
                }

                const maxValue = max[statKey] || 0;
                const playerValue = player[statKey] || 0;

                return playerValue > maxValue ? player : max;
            });
        };

        const resultPlayer = getPlayerByCriteria(criteria);

        if (resultPlayer) {
            const statKey =
                criteria === "highestTotal"
                    ? "Total"
                    : criteria.replace("highest", "");
            const statValue =
                criteria === "highestTotal"
                    ? (resultPlayer.Goals || 0) + (resultPlayer.Assists || 0) // Exclude cards
                    : resultPlayer[statKey] || 0;

            setSelectedStat(
                `${resultPlayer.PlayerName} (${statKey}: ${statValue})`
            );
        } else {
            setSelectedStat("No data available");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedPlayer) {
            // Update Player
            axios
                .put(`/footballplayers/${selectedPlayer.PlayerID}`, form)
                .then((response) => {
                    setPlayers((prev) =>
                        prev.map((player) =>
                            player.PlayerID === selectedPlayer.PlayerID
                                ? response.data
                                : player
                        )
                    );
                    Swal.fire({
                        icon: "success",
                        title: "Player Updated!",
                        text: "The player information has been updated successfully.",
                    });
                    closeModal();
                })
                .catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "There was an error updating the player.",
                    });
                });
        } else {
            // Add Player
            axios
                .post("/footballplayers", form)
                .then((response) => {
                    setPlayers((prev) => [...prev, response.data]);
                    Swal.fire({
                        icon: "success",
                        title: "Player Added!",
                        text: "The player has been added successfully.",
                    });
                    closeModal();
                })
                .catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "There was an error adding the player.",
                    });
                });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/footballplayers/${id}`)
                    .then(() => {
                        setPlayers((prev) =>
                            prev.filter((player) => player.PlayerID !== id)
                        );
                        Swal.fire(
                            "Deleted!",
                            "The player has been deleted.",
                            "success"
                        );
                    })
                    .catch(() => {
                        Swal.fire("Error!", "Error deleting player.", "error");
                    });
            }
        });
    };

    const filteredPlayers = players.filter(
        (player) =>
            player.LeagueID === activeLeague?.LeagueID &&
            player.FullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { name: "Full Name", selector: (row) => row.FullName, sortable: true },
        { name: "Height (m)", selector: (row) => row.Height, sortable: true },
        { name: "Weight (kg)", selector: (row) => row.Weight, sortable: true },
        { name: "Position", selector: (row) => row.Position, sortable: true },
        { name: "Jersey #", selector: (row) => row.Jersey_num, sortable: true },
        {
            name: "Team",
            selector: (row) => row.TeamName || "N/A",
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <div>
                    <button
                        onClick={() => openModal(row)}
                        className="btn btn-warning btn-sm me-2"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.PlayerID)}
                        className="btn btn-danger btn-sm"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const historyColumns = [
        {
            name: "Player Name",
            selector: (row) => row.PlayerName,
            sortable: true,
        },
        { name: "Team Name", selector: (row) => row.TeamName, sortable: true },
        { name: "Goals", selector: (row) => row.Goals, sortable: true },
        { name: "Assists", selector: (row) => row.Assists, sortable: true },
        {
            name: "Yellow Cards",
            selector: (row) => row.YellowCard,
            sortable: true,
        },
        { name: "Red Cards", selector: (row) => row.RedCard, sortable: true },
        {
            name: "Date",
            selector: (row) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
        },
    ];

    const exportToExcel = () => {
        // Prepare the table data
        const worksheetData = filteredPlayers.map((player) => ({
            FullName: player.FullName,
            Height: player.Height,
            Weight: player.Weight,
            Position: player.Position,
            JerseyNumber: player.Jersey_num,
            TeamName: player.TeamName || "N/A",
        }));

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Players");

        // Export the workbook as an Excel file
        XLSX.writeFile(workbook, "Football_Players.xlsx");
    };

    const exportMatchDetailsToExcel = () => {
        // Prepare the match details data
        const matchDetailsData = matchDetails.map((match) => ({
            PlayerName: match.PlayerName,
            TeamName: match.TeamName,
            Goals: match.Goals,
            Assists: match.Assists,
            YellowCard: match.YellowCard,
            RedCard: match.RedCard,
        }));

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(matchDetailsData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Match Details");

        // Export the workbook as an Excel file
        XLSX.writeFile(workbook, "Match_Details.xlsx");
    };

    const columnsPlayers = [
        { title: "Full Name", dataKey: "FullName" },
        { title: "Height (m)", dataKey: "Height" },
        { title: "Weight (kg)", dataKey: "Weight" },
        { title: "Position", dataKey: "Position" },
        { title: "Jersey #", dataKey: "Jersey_num" },
        { title: "Team", dataKey: "TeamName" },
    ];
    const columnsMatchDetails = [
        { title: "Player Name", dataKey: "PlayerName" },
        { title: "Team Name", dataKey: "TeamName" },
        { title: "Goals", dataKey: "Goals" },
        { title: "Assists", dataKey: "Assists" },
        { title: "YellowCard", dataKey: "YellowCard" },
        { title: "RedCard", dataKey: "RedCard" },
    ];

    const handlePrintPlayersPDF = () => {
        const doc = new jsPDF();

        // Add title for players
        doc.setFontSize(18);
        doc.text("Football Players List", 14, 10); // Title

        // Add players table
        doc.setFontSize(12);
        doc.autoTable({
            startY: 20, // Start players table below the title
            head: [columnsPlayers.map((col) => col.title)], // Players table headers
            body: filteredPlayers.map((player) => [
                player.FullName,
                player.Height,
                player.Weight,
                player.Position,
                player.Jersey_num,
                player.TeamName || "N/A",
            ]),
            theme: "grid",
        });

        // Save the generated PDF with a name
        doc.save("FootballPlayers.pdf");
    };

    const handlePrintMatchDetailsPDF = () => {
        const doc = new jsPDF();

        // Add title for match details
        doc.setFontSize(18);
        doc.text("Match Details", 14, 10); // Title

        // Add match details table
        doc.setFontSize(12);
        doc.autoTable({
            startY: 20, // Start match details table below the title
            head: [columnsMatchDetails.map((col) => col.title)], // Match details table headers
            body: matchDetails.map((match) => [
                match.PlayerName,
                match.TeamName,
                match.Goals,
                match.Assists,
                match.YellowCard,
                match.RedCard,
            ]),
            theme: "grid",
        });

        // Save the generated PDF with a name
        doc.save("MatchDetails.pdf");
    };

    return (
        <AuthenticatedLayout>
            <div className="container my-4">
                <h1>Football Players</h1>

                <button
                    onClick={() => openModal()}
                    className="btn btn-success mb-3"
                >
                    Add Player
                </button>

                <button
                    onClick={openHistoryModal}
                    className="btn btn-info mb-3 ms-2"
                >
                    Player History
                </button>
                <div className="mb-3">
                    <button
                        className="btn btn-secondary mb-3"
                        onClick={exportToExcel}
                    >
                        <FontAwesomeIcon icon={faPrint} className="me-2" />
                        Print Excel
                    </button>
                    <button
                        className="btn btn-secondary mb-3 ms-2 "
                        onClick={handlePrintPlayersPDF}
                    >
                        <FontAwesomeIcon icon={faPrint} className="me-2" />
                        Print PDF
                    </button>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search players by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "300px" }}
                    />
                </div>

                <DataTable
                    title="Players"
                    columns={columns}
                    data={filteredPlayers} // Use filtered players
                    pagination
                />

                {isModalOpen && (
                    <div className="modal" style={{ display: "block" }}>
                        <Draggable nodeRef={modalRef} handle=".modal-header">
                            <div className="modal-dialog" ref={modalRef}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5>
                                            {selectedPlayer
                                                ? "Edit Player"
                                                : "Add Player"}
                                        </h5>
                                        <button
                                            onClick={closeModal}
                                            className="btn-close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <input
                                                type="text"
                                                value={form.FullName}
                                                placeholder="Full Name"
                                                className="form-control mb-3"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        FullName:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <select
                                                value={form.TeamID}
                                                className="form-select mb-3"
                                                onChange={(e) => {
                                                    const selectedTeam =
                                                        teams.find(
                                                            (team) =>
                                                                team.TeamID ===
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                        );
                                                    setForm({
                                                        ...form,
                                                        TeamID: e.target.value,
                                                        TeamName: selectedTeam
                                                            ? selectedTeam.TeamName
                                                            : "",
                                                    });
                                                }}
                                                required
                                            >
                                                <option value="">
                                                    Select a Team
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
                                            <input
                                                type="number"
                                                value={form.Height}
                                                placeholder="Height"
                                                className="form-control mb-3"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        Height: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <input
                                                type="number"
                                                value={form.Weight}
                                                placeholder="Weight"
                                                className="form-control mb-3"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        Weight: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={form.Position}
                                                placeholder="Position"
                                                className="form-control mb-3"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        Position:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <input
                                                type="number"
                                                value={form.Jersey_num}
                                                placeholder="Jersey Number"
                                                className="form-control mb-3"
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        Jersey_num:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                            <button
                                                className="btn btn-primary"
                                                type="submit"
                                            >
                                                {selectedPlayer
                                                    ? "Update"
                                                    : "Add"}{" "}
                                                Player
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </Draggable>
                    </div>
                )}

                {isHistoryModalOpen && (
                    <div className="modal" style={{ display: "block" }}>
                        <Draggable nodeRef={modalRef} handle=".modal-header">
                            <div
                                className="modal-dialog"
                                ref={modalRef}
                                style={{ maxWidth: "68%" }}
                            >
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5>Match History</h5>
                                        <button
                                            onClick={closeHistoryModal}
                                            className="btn-close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Dropdown and Text Input */}
                                        <div className="mb-3">
                                            <button
                                                className="btn btn-secondary mb-3"
                                                onClick={
                                                    exportMatchDetailsToExcel
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPrint}
                                                    className="me-2"
                                                />
                                                Print Excel
                                            </button>
                                            <button
                                                className="btn btn-secondary mb-3 ms-2 "
                                                onClick={
                                                    handlePrintMatchDetailsPDF
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPrint}
                                                    className="me-2"
                                                />
                                                Print PDF
                                            </button>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <select
                                                className="form-select me-3"
                                                style={{ width: "300px" }}
                                                onChange={(e) =>
                                                    handleDropdownChange(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select a Stat
                                                </option>
                                                <option value="highestGoals">
                                                    Highest Goals
                                                </option>
                                                <option value="highestAssists">
                                                    Highest Assists
                                                </option>
                                                <option value="highestTotal">
                                                    Highest Total Value
                                                </option>
                                            </select>
                                            <input
                                                type="text"
                                                style={{ width: "350px" }}
                                                className="form-control"
                                                readOnly
                                                value={selectedStat}
                                                placeholder="Result will appear here..."
                                            />
                                        </div>

                                        {/* Data Table */}
                                        <DataTable
                                            title="Match Details"
                                            columns={historyColumns} // Football columns passed here
                                            data={matchDetails} // Football match details passed here
                                            pagination
                                        />
                                    </div>
                                </div>
                            </div>
                        </Draggable>
                    </div>
                )}
            </div>
            <ToastContainer />
        </AuthenticatedLayout>
    );
};

export default FootballPlayers;
