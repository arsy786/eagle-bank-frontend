"use client";

import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	dateOfBirth?: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	register: (userData: any) => Promise<boolean>;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const userId = localStorage.getItem("userId"); // This might actually be an email

		if (token && userId && !user) {
			apiClient.setToken(token);
			// Don't try to load user details since the endpoint doesn't exist
			// Just set basic user info from localStorage
			setUser({
				id: userId,
				email: userId,
				firstName: "",
				lastName: "",
				phoneNumber: "",
				dateOfBirth: "",
			});
		}
		setLoading(false);
	}, [user]);

	const loadUser = async (userEmail: string) => {
		try {
			const userData = await apiClient.getUserByEmail(userEmail);
			setUser(userData);
		} catch (error) {
			console.error("Failed to load user:", error);
			logout();
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const response = await apiClient.login(email, password);

			// Handle the actual response format from the server
			const token = response.accessToken;
			const userEmail = response.email;

			if (!token) {
				throw new Error("No token received from server");
			}

			// Set the token first
			apiClient.setToken(token);
			localStorage.setItem("userId", userEmail); // Use email as userId

			// Set user state with basic info from login response
			setUser({
				id: userEmail, // Use email as ID
				email: userEmail,
				firstName: "", // Will be populated later if needed
				lastName: "",
				phoneNumber: "",
				dateOfBirth: "",
			});

			setLoading(false);
			toast.success("Successfully logged in!");
			router.push("/dashboard");
			return true;
		} catch (error: any) {
			toast.error(error.message || "Login failed");
			return false;
		}
	};

	const register = async (userData: any): Promise<boolean> => {
		try {
			const response = await apiClient.register(userData);
			toast.success("Account created successfully! Please log in.");
			router.push("/login");
			return true;
		} catch (error: any) {
			toast.error(error.message || "Registration failed");
			return false;
		}
	};

	const logout = () => {
		apiClient.setToken(null);
		localStorage.removeItem("userId");
		setUser(null);
		router.push("/login");
		toast.success("Logged out successfully");
	};

	const refreshUser = async () => {
		const userId = localStorage.getItem("userId");
		if (userId) {
			await loadUser(userId);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				register,
				logout,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
