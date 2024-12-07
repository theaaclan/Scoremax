import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import "@css/tailwind.css";

export default function AuthenticatedLayout({ header, children }) {
    const [showPlayers, setShowPlayers] = useState(false);
    const [showTeams, setShowTeams] = useState(false);
    const [showBracket, setShowBracket] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showScoreboard, setShowScoreboard] = useState(false);
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div>
            <nav className="border-b border-blue-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>

                                {/* Players Dropdown */}
                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex items-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
                                                    Players
                                                    <svg
                                                        className="ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={"/basketballplayers"}
                                                >
                                                    Basketball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"/volleyballplayers"}
                                                >
                                                    Volleyball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"baseballplayers"}
                                                >
                                                    Baseball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"sepaktakrawplayers"}
                                                >
                                                    Sepak Takraw
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"footballplayers"}
                                                >
                                                    Football
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex items-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
                                                    Teams
                                                    <svg
                                                        className="ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={"/basketballteams"}
                                                >
                                                    Basketball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"/volleyballteams"}
                                                >
                                                    Volleyball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"/baseballteams"}
                                                >
                                                    Baseball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"/sepaktakrawteams"}
                                                >
                                                    Sepak Takraw
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"footballteams"}
                                                >
                                                    Football
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex items-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
                                                    Bracket
                                                    <svg
                                                        className="ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={"basketballbracket"}
                                                >
                                                    Basketball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"volleyballbracket"}
                                                >
                                                    Volleyball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"baseballbracket"}
                                                >
                                                    Baseball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"sepaktakrawbracket"}
                                                >
                                                    Sepak Takraw
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"footballbracket"}
                                                >
                                                    Football
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex items-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
                                                    Schedule
                                                    <svg
                                                        className="ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={"basketballschedule"}
                                                >
                                                    Basketball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"volleyballschedule"}
                                                >
                                                    Volleyball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"baseballschedule"}
                                                >
                                                    Baseball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"sepaktakrawschedule"}
                                                >
                                                    Sepak Takraw
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"footballschedule"}
                                                >
                                                    Football
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex items-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
                                                    Scoreboard
                                                    <svg
                                                        className="ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={
                                                        "basketballscoreboard"
                                                    }
                                                >
                                                    Basketball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={
                                                        "/volleyballscoreboard"
                                                    }
                                                >
                                                    Volleyball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"baseballscoreboard"}
                                                >
                                                    Baseball
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={
                                                        "sepaktakrawscoreboard"
                                                    }
                                                >
                                                    Sepak Takraw
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={"footballscoreboard"}
                                                >
                                                    Football
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6"></div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={showingNavigationDropdown ? "block" : "hidden"}>
                    {/* Dashboard Link */}
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    {/* Players Dropdown */}
                    <div className="space-y-1 pb-3 pt-2">
                        <div
                            onClick={() => setShowPlayers(!showPlayers)}
                            className="cursor-pointer flex w-full items-start border-l-4 py-2 pe-4 ps-3"
                        >
                            Players
                        </div>
                        {showPlayers && (
                            <div className="px-4 space-y-1">
                                <ResponsiveNavLink href="basketballplayers">
                                    Basketball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="volleyballplayers">
                                    Volleyball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="baseballplayers">
                                    Baseball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="sepaktakrawplayers">
                                    Sepak Takraw
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="footballplayers">
                                    Football
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>

                    {/* Teams Dropdown */}
                    <div className="space-y-1 pb-3 pt-2">
                        <div
                            onClick={() => setShowTeams(!showTeams)}
                            className="cursor-pointer flex w-full items-start border-l-4 py-2 pe-4 ps-3"
                        >
                            Teams
                        </div>
                        {showTeams && (
                            <div className="px-4 space-y-1">
                                <ResponsiveNavLink href="basketballteams">
                                    Basketball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="volleyballteams">
                                    Volleyball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="baseballteams">
                                    Baseball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="sepaktakrawteams">
                                    Sepak Takraw
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="footballteams">
                                    Football
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>

                    {/* Bracket Dropdown */}
                    <div className="space-y-1 pb-3 pt-2">
                        <div
                            onClick={() => setShowBracket(!showBracket)}
                            className="cursor-pointer flex w-full items-start border-l-4 py-2 pe-4 ps-3"
                        >
                            Bracket
                        </div>
                        {showBracket && (
                            <div className="px-4 space-y-1">
                                <ResponsiveNavLink href="basketballbracket">
                                    Basketball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="volleyballbracket">
                                    Volleyball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="baseballbracket">
                                    Baseball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="sepaktakrawbracket">
                                    Sepak Takraw
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="footballbracket">
                                    Football
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>

                    {/* Schedule Dropdown */}
                    <div className="space-y-1 pb-3 pt-2">
                        <div
                            onClick={() => setShowSchedule(!showSchedule)}
                            className="cursor-pointer flex w-full items-start border-l-4 py-2 pe-4 ps-3"
                        >
                            Schedule
                        </div>
                        {showSchedule && (
                            <div className="px-4 space-y-1">
                                <ResponsiveNavLink href="basketballschedule">
                                    Basketball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="volleyballschedule">
                                    Volleyball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="baseballschedule">
                                    Baseball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="sepaktakrawschedule">
                                    Sepak Takraw
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="footballschedule">
                                    Football
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>

                    {/* Scoreboard Dropdown */}
                    <div className="space-y-1 pb-3 pt-2">
                        <div
                            onClick={() => setShowScoreboard(!showScoreboard)}
                            className="cursor-pointer flex w-full items-start border-l-4 py-2 pe-4 ps-3"
                        >
                            Scoreboard
                        </div>
                        {showScoreboard && (
                            <div className="px-4 space-y-1">
                                <ResponsiveNavLink href="basketballscoreboard">
                                    Basketball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="volleyballscoreboard">
                                    Volleyball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="baseballscoreboard">
                                    Baseball
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="sepaktakrawscoreboard">
                                    Sepak Takraw
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href="footballscoreboard">
                                    Football
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
