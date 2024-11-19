import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "@inertiajs/inertia-react"; // Inertia form handling

const BasketballTeamForm = ({ team }) => {
    // Initialize state or use form hook
    const { data, setData, post, put, errors } = useForm({
        TeamName: team ? team.TeamName : "",
        CoachName: team ? team.CoachName : "",
        PlayerCount: team ? team.PlayerCount : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (team) {
            // Update an existing team if team prop is passed
            put(`/basketballteams/${team.TeamID}`);
        } else {
            // Create a new team
            post("/basketballteams");
        }
    };

    return (
        <div>
            <h1>{team ? "Edit Team" : "Add New Team"}</h1>

            {/* Display errors if there are any */}
            {errors && Object.keys(errors).length > 0 && (
                <div className="alert alert-danger">
                    <ul>
                        {Object.keys(errors).map((key) => (
                            <li key={key}>{errors[key]}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Team Name input */}
                <div className="mb-3">
                    <label className="form-label" htmlFor="TeamName">
                        Team Name
                    </label>
                    <input
                        type="text"
                        id="TeamName"
                        name="TeamName"
                        className="form-control"
                        value={data.TeamName}
                        onChange={(e) => setData("TeamName", e.target.value)}
                        required
                    />
                </div>

                {/* Coach Name input */}
                <div className="mb-3">
                    <label className="form-label" htmlFor="CoachName">
                        Coach Name
                    </label>
                    <input
                        type="text"
                        id="CoachName"
                        name="CoachName"
                        className="form-control"
                        value={data.CoachName}
                        onChange={(e) => setData("CoachName", e.target.value)}
                        required
                    />
                </div>

                {/* Player Count input */}
                <div className="mb-3">
                    <label className="form-label" htmlFor="PlayerCount">
                        Player Count
                    </label>
                    <input
                        type="number"
                        id="PlayerCount"
                        name="PlayerCount"
                        className="form-control"
                        value={data.PlayerCount}
                        onChange={(e) => setData("PlayerCount", e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    {team ? "Update Team" : "Add Team"}
                </button>
            </form>
        </div>
    );
};

export default BasketballTeamForm;
