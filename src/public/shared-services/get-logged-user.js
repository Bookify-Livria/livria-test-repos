import axios from "axios";

export function getLoggedInUser() {
    return axios.get("https://livria-6efh.onrender.com/userlogin")
        .then(response => {
            const loginEntries = response.data;

            if (loginEntries.length > 0) {
                const loggedInUserId = loginEntries[0].id;

                return axios.get("https://livria-6efh.onrender.com/users")
                    .then(usersResponse => {
                        const users = usersResponse.data;
                        const user = users.find(u => String(u.id) === String(loggedInUserId));
                        return user || null;
                    });
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error("Error getting logged-in user:", error);
            throw error;
        });
}
