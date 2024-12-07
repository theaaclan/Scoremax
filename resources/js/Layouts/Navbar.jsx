import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faTimes,
    faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import "@css/tailwind.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdown, setDropdown] = useState(null);

    const onToggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleDropdown = (menu) => {
        setDropdown(dropdown === menu ? null : menu);
    };

    return (
        <header className="bg-white">
            <nav className="flex justify-between items-center w-[92%] mx-auto">
                <div>
                    <img
                        className="w-16 cursor-pointer"
                        src="images/Splashlogo.png"
                        alt="logo"
                    />
                </div>
                <div
                    className={`nav-links duration-500 md:static absolute bg-white md:min-h-fit min-h-[40vh] left-0 top-[-100%] md:w-auto w-full flex items-center px-5 ${
                        menuOpen ? "top-[1%]" : ""
                    }`}
                    style={{ zIndex: 50 }}
                >
                    <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
                        {menuOpen && (
                            <FontAwesomeIcon
                                onClick={onToggleMenu}
                                icon={faTimes}
                                className="text-3xl cursor-pointer absolute top-4 right-4 md:hidden"
                            />
                        )}
                        <li>
                            <a className="hover:text-gray-500" href="/">
                                Home
                            </a>
                        </li>

                        <li className="relative">
                            <button
                                className="hover:text-gray-500 flex items-center gap-1"
                                onClick={() => toggleDropdown("bracket")}
                            >
                                Bracket
                                <FontAwesomeIcon icon={faCaretDown} />
                            </button>
                            {dropdown === "bracket" && (
                                <ul className="absolute top-10 left-0 bg-white shadow-lg p-2 rounded-md w-max z-50">
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserBasketballBracket"
                                        >
                                            Basketball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserVolleyballBracket"
                                        >
                                            Volleyball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserBaseballBracket"
                                        >
                                            Baseball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserSepakTakrawBracket"
                                        >
                                            SepakTakraw
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserFootballBracket"
                                        >
                                            Football
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="relative">
                            <button
                                className="hover:text-gray-500 flex items-center gap-1"
                                onClick={() => toggleDropdown("schedule")}
                            >
                                Schedule
                                <FontAwesomeIcon icon={faCaretDown} />
                            </button>
                            {dropdown === "schedule" && (
                                <ul className="absolute top-10 left-0 bg-white shadow-lg p-2 rounded-md w-max z-50">
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserBasketballSchedule"
                                        >
                                            Basketball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserVolleyballSchedule"
                                        >
                                            Volleyball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserBaseballSchedule"
                                        >
                                            Baseball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserSepakTakrawSchedule"
                                        >
                                            SepakTakraw
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserFootballSchedule"
                                        >
                                            Football
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="relative">
                            <button
                                className="hover:text-gray-500 flex items-center gap-1"
                                onClick={() => toggleDropdown("scoreboard")}
                            >
                                Scoreboard
                                <FontAwesomeIcon icon={faCaretDown} />
                            </button>
                            {dropdown === "scoreboard" && (
                                <ul className="absolute top-10 left-0 bg-white shadow-lg p-2 rounded-md w-max z-50">
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserBasketballScoreboard"
                                        >
                                            Basketball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserVolleyballScoreboard"
                                        >
                                            Volleyball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserBaseballScoreboard"
                                        >
                                            Baseball
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserSepakTakrawScoreboard"
                                        >
                                            SepakTakraw
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="block px-4 py-2 hover:bg-gray-100"
                                            href="/UserFootballScoreboard"
                                        >
                                            Football
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        className="bg-[#B41C1C] text-white px-5 py-2 rounded-full hover:bg-[#462022]"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Login
                    </button>

                    <FontAwesomeIcon
                        onClick={onToggleMenu}
                        icon={faBars}
                        className="text-3xl cursor-pointer md:hidden"
                    />
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
