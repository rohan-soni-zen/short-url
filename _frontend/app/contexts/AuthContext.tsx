import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
	id: number;
	name: string;
	email: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	success: boolean;
	user?: User;
	message?: string;
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	login: (data: LoginRequest) => Promise<AuthResponse>;
	register: (data: RegisterRequest) => Promise<AuthResponse>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

interface AuthProviderProps {
	children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [mounted, setMounted] = useState(false);

	const login = async (data: LoginRequest): Promise<AuthResponse> => {
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:3000/api/auth/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);

			const result: AuthResponse = await response.json();

			if (result.success && result.user) {
				setUser(result.user);
				if (typeof window !== "undefined") {
					localStorage.setItem("user", JSON.stringify(result.user));
				}
			}

			return result;
		} catch (error) {
			console.error("Login error:", error);
			return {
				success: false,
				message: "Network error. Please try again.",
			};
		} finally {
			setLoading(false);
		}
	};

	const register = async (data: RegisterRequest): Promise<AuthResponse> => {
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:3000/api/auth/register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);

			const result: AuthResponse = await response.json();

			if (result.success && result.user) {
				setUser(result.user);
				if (typeof window !== "undefined") {
					localStorage.setItem("user", JSON.stringify(result.user));
				}
			}

			return result;
		} catch (error) {
			console.error("Registration error:", error);
			return {
				success: false,
				message: "Network error. Please try again.",
			};
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		if (typeof window !== "undefined") {
			localStorage.removeItem("user");
		}
	};

	// Initialize user from localStorage on mount
	useEffect(() => {
		setMounted(true);
		if (typeof window !== "undefined") {
			const storedUser = localStorage.getItem("user");
			if (storedUser) {
				try {
					setUser(JSON.parse(storedUser));
				} catch (error) {
					console.error("Failed to parse stored user data:", error);
					localStorage.removeItem("user");
				}
			}
		}
	}, []);

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		loading,
		login,
		register,
		logout,
	};

	// Don't render children until mounted to prevent hydration mismatches
	if (!mounted) {
		return null;
	}

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}
