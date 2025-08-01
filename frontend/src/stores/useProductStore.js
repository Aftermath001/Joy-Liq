import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
	products: [], // Ensure products is always initialized
	loading: false,

	setProducts: (products) => set({ products }),

	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((state) => ({
				products: [...state.products, res.data], // Ensure state update
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response?.data?.error || "Error creating product");
			set({ loading: false });
		}
	},

	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data?.products || [], loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},

	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products || [], loading: false }); // Store an empty array if no products found
		} catch (error) {
			set({ products: [], loading: false }); // Ensure no unwanted data appears
			toast.error(error.response?.data?.message || "Failed to fetch products");
		}
	},
	
	

	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((state) => ({
				products: state.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to delete product");
		}
	},

	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			set((state) => ({
				products: state.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		}
	},

	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data?.products || response.data || [], loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error("Failed to fetch featured products");
		}
	},
}));