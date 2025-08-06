"use client";

import { apiClient } from "@/lib/api";
import { ApiError, RegisterRequest, User } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	register: (userData: RegisterRequest) => Promise<boolean>;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const loadUser = async () => {
		try {
			const userData = await apiClient.getMe();
			setUser(userData);
		} catch (error) {
			// Only clear user if it's a 401 (unauthorized) error
			const err = error as ApiError;
			if (err.status === 401) {
				setUser(null);
				apiClient.setToken(null);
				localStorage.removeItem("token");
			}
			// For other errors, keep the user logged in (token might still be valid)
		} finally {
			setLoading(false);
		}
	};

	// Set up JWT expiration handler
	useEffect(() => {
		apiClient.setOnTokenExpired(() => {
			setUser(null);
			localStorage.removeItem("token");
			toast.error("Session expired. Please log in again.");
			router.push("/login");
		});
	}, [router]);

	// Handle initial token loading and user authentication
	useEffect(() => {
		const initializeAuth = async () => {
			const token = localStorage.getItem("token");

			if (token) {
				apiClient.setToken(token);
				await loadUser();
			} else {
				setLoading(false);
			}
		};

		initializeAuth();
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const response = await apiClient.login(email, password);

			const token = response.accessToken;

			if (!token) {
				throw new Error("No token received from server");
			}

			apiClient.setToken(token);
			await loadUser();

			toast.success("Successfully logged in!");
			router.push("/dashboard");
			return true;
		} catch (error) {
			const err = error as ApiError;
			toast.error(err.message || "Login failed");
			return false;
		}
	};

	const register = async (userData: RegisterRequest): Promise<boolean> => {
		try {
			await apiClient.register(userData);
			toast.success("Account created successfully! Please log in.");
			router.push("/login");
			return true;
		} catch (error) {
			const err = error as ApiError;
			toast.error(err.message || "Registration failed");
			return false;
		}
	};

	const logout = () => {
		apiClient.setToken(null);
		localStorage.removeItem("token");
		setUser(null);
		router.push("/login");
		toast.success("Logged out successfully");
	};

	const refreshUser = async () => {
		await loadUser();
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
