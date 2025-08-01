import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:5000/api", // Adjust this if necessary
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export default instance;