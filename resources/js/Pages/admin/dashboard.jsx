import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Inertia } from "@inertiajs/inertia";
import Modal from "react-bootstrap/Modal";
import GuestLayout from "../../Layouts/GuestLayout";
import Button from "react-bootstrap/Button";
import Register from "../Auth/Register"; // Import your Register component

const Dashboard = ({ users }) => {
    const [showModal, setShowModal] = useState(false);

    // Function to toggle modal visibility
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // Filter users to exclude admin
    const filteredUsers = users.filter((user) => user.usertype === "user");

    const columns = [
        { name: "ID", selector: (row) => row.id, sortable: true },
        { name: "Name", selector: (row) => row.name, sortable: true },
        { name: "Email", selector: (row) => row.email },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    onClick={() => deleteUser(row.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Delete
                </button>
            ),
        },
    ];

    const deleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            Inertia.delete(`/admin/users/${userId}`, {
                onSuccess: () => alert("User deleted successfully."),
                onError: () => alert("Error deleting user."),
            });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <GuestLayout />
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            {/* Register Button */}
            <div className="mb-4 flex justify-start">
                <button
                    onClick={handleShow}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Register
                </button>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredUsers}
                pagination
                highlightOnHover
                striped
                responsive
                noDataComponent="No users found."
            />

            {/* Modal for Register Form */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Register />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Dashboard;
