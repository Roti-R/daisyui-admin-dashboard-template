import axios from "axios";

const axiosClient = axios.create(
    {
        baseURL: process.env.REACT_APP_BASE_URL2,
        headers: {
            "Content-Type": "application/json"
        }
    }
)

export default axiosClient;