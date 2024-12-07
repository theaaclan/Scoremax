import "../css/app.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useEffect } from "react"; // Import useEffect

// Set the CSRF token globally for Axios
axios.defaults.headers.common["X-CSRF-TOKEN"] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// Helper functions for user management (these should be defined somewhere)
const getActiveUser = () => {
    // Retrieve the active user index (this is just an example)
    return localStorage.getItem("activeUser");
};

const getUsersFromLocalStorage = () => {
    // Assume users are stored in localStorage
    return JSON.parse(localStorage.getItem("users") || "{}");
};

function AppWrapper({ children }) {
    useEffect(() => {
        const activeUser = getActiveUser();
        if (activeUser) {
            const users = getUsersFromLocalStorage();
            console.log(`Active user: ${users[activeUser]?.email}`);
        }
    }, []); // Empty dependency array to run this effect once when the component mounts

    return <div>{children}</div>;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.{jsx,js}") // Include all subdirectories
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        // Wrap the Inertia app with AppWrapper for global setup
        root.render(
            <AppWrapper>
                <App {...props} />
            </AppWrapper>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
