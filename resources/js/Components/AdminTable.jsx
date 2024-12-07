import React from "react";
import DataTable from "react-data-table-component";
import { Inertia } from "@inertiajs/inertia";

const Dashboard = ({ users }) => {
    // Define columns for the data table
    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
        },
        {
            name: "User Type",
            selector: (row) => row.usertype,
        },
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
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    // Function to handle delete action
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
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <DataTable
                columns={columns}
                data={users}
                pagination
                highlightOnHover
                striped
                responsive
            />
        </div>
    );
};

export default Dashboard;
