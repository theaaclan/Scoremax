// localStorageUtils.js
export function setUserInLocalStorage(userData) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const nextIndex = Object.keys(users).length;
    users[nextIndex] = userData;
    localStorage.setItem("users", JSON.stringify(users));
}

export function getUsersFromLocalStorage() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

export function loginUser(newUser) {
    let users = getUsersFromLocalStorage();

    const existingUser = Object.entries(users).find(
        ([, user]) => user.email === newUser.email
    );

    if (existingUser) {
        return existingUser[0]; // Index of existing user
    }

    const newIndex = Object.keys(users).length;
    users[newIndex] = newUser;
    localStorage.setItem("users", JSON.stringify(users));
    return newIndex;
}

export function setActiveUser(index) {
    localStorage.setItem("activeUser", index);
}

export function getActiveUser() {
    return localStorage.getItem("activeUser");
}

export function logoutUser() {
    const activeIndex = getActiveUser();
    if (activeIndex !== null) {
        let users = getUsersFromLocalStorage();
        delete users[activeIndex];
        localStorage.setItem("users", JSON.stringify(users));
    }
    localStorage.removeItem("activeUser");
}
