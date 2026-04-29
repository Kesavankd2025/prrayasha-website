import axios from "axios";


// export const BASE_URL = "http://65.0.84.181:4000/api/website";
// export const IMAGE_BASE_URL = "http://65.0.84.181:4000/public";

export const BASE_URL = "https://prrayasha-backend.onrender.com/api/website";
export const IMAGE_BASE_URL = "https://prrayasha-backend.onrender.com/public";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" }
});

// Request: token auto attach & logging
apiClient.interceptors.request.use((config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response: 401 handle (auto logout)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
