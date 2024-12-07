import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons"; // Import the trophy icon
import "@css/tailwind.css";
import Swal from "sweetalert2"; // Import SweetAlert2
import { faEye } from "@fortawesome/free-solid-svg-icons";

const LeagueForm = () => {
    const [formData, setFormData] = useState({
        LeagueName: "",
        StartDate: "",
        EndDate: "",
    });

    const [activeLeague, setActiveLeague] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // State to control history modal visibility
    const [allLeagues, setAllLeagues] = useState([]); // State to store all leagues

    // Fetch the active league and all leagues when the component mounts
    useEffect(() => {
        // Retrieve the active league from localStorage if available
        const storedActiveLeague = localStorage.getItem("activeLeague");

        if (storedActiveLeague) {
            try {
                setActiveLeague(JSON.parse(storedActiveLeague));
            } catch (error) {
                console.error(
                    "Error parsing active league from localStorage:",
                    error
                );
            }
        }
        // Fetch all leagues for history modal
        axios
            .get("/leagues") // Adjust the endpoint if necessary
            .then((response) => {
                setAllLeagues(response.data.leagues);
            })
            .catch((error) => {
                console.error("Error fetching leagues:", error);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createLeague = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/leagues", formData, {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });
            Swal.fire({
                title: "Success!",
                text: "League created successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });
            setActiveLeague(response.data); // Update the active league in the state
            localStorage.setItem("activeLeague", JSON.stringify(response.data)); // Store active league in localStorage
            setIsModalOpen(false); // Close the modal after successful creation
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Error creating league.",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    const endLeague = async () => {
        try {
            const response = await axios.post(
                "/leagues/end",
                {},
                {
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );
            Swal.fire({
                title: "Success!",
                text: "Active league ended.",
                icon: "success",
                confirmButtonText: "OK",
            });
            setActiveLeague(null); // Clear the active league from state
            localStorage.removeItem("activeLeague"); // Remove active league from localStorage
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Error ending league.",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    const setActiveLeagueHandler = async (leagueId) => {
        try {
            const response = await axios.post(
                `/leagues/${leagueId}/set-active`,
                { IsActive: true }, // Update the IsActive field
                {
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );
            setActiveLeague(response.data); // Set the selected league as active
            localStorage.setItem("activeLeague", JSON.stringify(response.data)); // Store active league in localStorage
            setIsHistoryModalOpen(false); // Close the history modal after setting active
            Swal.fire({
                title: "Success!",
                text: "League activated successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Error setting active league:", error);
            Swal.fire({
                title: "Error",
                text: "Error setting active league.",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg ">
            <h1 className="text-2xl font-bold mb-6 text-center">
                League Manager
            </h1>

            {activeLeague ? (
                <div>
                    <h2 className="text-lg font-semibold">
                        Active League: {activeLeague.LeagueName}
                    </h2>
                    <p>Start Date: {activeLeague.StartDate}</p>
                    <p>End Date: {activeLeague.EndDate || "Ongoing"}</p>
                    <button
                        onClick={endLeague}
                        className="mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition duration-200"
                    >
                        End Active League
                    </button>
                </div>
            ) : (
                <div className="flex space-x-12">
                    <button
                        onClick={() => setIsModalOpen(true)} // Open create league modal when clicked
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        <FontAwesomeIcon icon={faTrophy} className="mr-2" />{" "}
                        Create League
                    </button>

                    <button
                        onClick={() => setIsHistoryModalOpen(true)} // Open league history modal when clicked
                        className="ml-8 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        League History
                    </button>

                    {/* Create League Modal */}
                    {isModalOpen && (
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                            onClick={() => setIsModalOpen(false)} // Close the modal when clicking outside
                        >
                            <div
                                className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96"
                                onClick={(e) => e.stopPropagation()} // Prevent modal from closing on form clicks
                            >
                                <h2 className="text-xl font-bold mb-4">
                                    Create League
                                </h2>
                                <form
                                    onSubmit={createLeague}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="LeagueName"
                                            className="block text-gray-700 font-medium"
                                        >
                                            League Name
                                        </label>
                                        <input
                                            type="text"
                                            id="LeagueName"
                                            name="LeagueName"
                                            value={formData.LeagueName}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="StartDate"
                                            className="block text-gray-700 font-medium"
                                        >
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="StartDate"
                                            name="StartDate"
                                            value={formData.StartDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="EndDate"
                                            className="block text-gray-700 font-medium"
                                        >
                                            End Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            id="EndDate"
                                            name="EndDate"
                                            value={formData.EndDate}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        Create League
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* League History Modal */}
                    {isHistoryModalOpen && (
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                            onClick={() => setIsHistoryModalOpen(false)} // Close the modal when clicking outside
                        >
                            <div
                                className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96"
                                onClick={(e) => e.stopPropagation()} // Prevent modal from closing on button clicks
                            >
                                <h2 className="text-xl font-bold mb-4">
                                    League History
                                </h2>
                                <ul>
                                    {allLeagues.map((league) => (
                                        <li
                                            key={league.LeagueID} // Use LeagueID instead of id
                                            className="flex justify-between items-center mb-2"
                                        >
                                            <span>{league.LeagueName}</span>
                                            <button
                                                onClick={() =>
                                                    setActiveLeagueHandler(
                                                        league.LeagueID
                                                    )
                                                } // Pass LeagueID instead of id
                                                className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition duration-200"
                                            >
                                                Activate
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeagueForm;
