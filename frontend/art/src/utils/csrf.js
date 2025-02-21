import axios from "axios";

export const getCSRFToken = async () => {
    try {
        const response = await axios.get("http://localhost:8000/app1/get-csrf-token/", {
            withCredentials: true, // This allows sending cookies with requests
        });
        return response.data.csrfToken;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        return null;
    }
};
