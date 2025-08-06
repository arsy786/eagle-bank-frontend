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

	const loadUser = async () => {
		try {
			const userData = await apiClient.getMe();
			setUser(userData);
		} catch (error) {
			setUser(null);
			apiClient.setToken(null);
		} finally {
			setLoading(false);
		}
	};

	// Set up JWT expiration handler
	useEffect(() => {
		apiClient.setOnTokenExpired(() => {
			setUser(null);
			localStorage.removeItem("userId");
			toast.error("Session expired. Please log in again.");
			router.push("/login");
		});
	}, [router]);

	// Handle token expiration
	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			apiClient.setToken(token);
			loadUser();
		}
		setLoading(false);
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
		} catch (error: any) {
			toast.error(error.message || "Login failed");
			return false;
		}
	};

	const register = async (userData: any): Promise<boolean> => {
		try {
			await apiClient.register(userData);
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
