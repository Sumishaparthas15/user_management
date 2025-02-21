import axios from "axios";
import { getCSRFToken } from "./csrf"; // Import CSRF function

const api = axios.create({
    baseURL: "http://localhost:8000", // Backend API
    withCredentials: true, // Required for cookies & CSRF protection
});

export const loginUser = async (email, password) => {
    const csrfToken = await getCSRFToken(); // Fetch CSRF token first
    return api.post("/login/", { email, password }, {
        headers: { "X-CSRFToken": csrfToken }, // Attach CSRF token in headers
    });
};
