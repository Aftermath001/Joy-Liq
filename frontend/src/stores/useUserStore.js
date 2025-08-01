import { create } from "zustand";
import { toast } from "react-hot-toast";
import instance from "../lib/axios";
import axios from "axios";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });
	
		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}
	

		try {
			const res = await instance.post("/auth/signup", { name, email, password });
			console.log("Signup Response:", res); // Debugging line
			set({ user: res.data, loading: false });
		} catch (error) {
			console.error("Signup Error:", error); // Log the full error
			set({ loading: false });
	
			// Ensure error.response exists before accessing data
			const errorMessage = error.response?.data?.message || "An error occurred";
			toast.error(errorMessage);
		}
	},
	
	login: async (email, password, navigate) => {
		set({ loading: true });
	
		try {
			const res = await instance.post("/auth/login", { email, password });
	
			// Debugging - Check what the API returns
			console.log("Login Response:", res.data);
	
			set({ user: res.data, loading: false });
	
			// Redirect based on user role
			if (res.data.role === "admin") {
				navigate("/adminpage"); // Redirect admin to the admin page
			} else {
				navigate("/homepage"); // Redirect regular users to the homepage
			}
		} catch (error) {
			set({ loading: false });
	
			const errorMessage = error.response?.data?.message || "An error occurred";
			toast.error(errorMessage);
		}
	},
	

	logout: async (navigate) => {
		try {
			await instance.post("/auth/logout");
			set({ user: null });
			navigate("/"); // Redirect to index page after logout
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await instance.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await instance.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);